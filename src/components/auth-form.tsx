"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect } from "react";
import "../api/clientConfig";
import { AuthService, OpenAPI } from "../api/client";
import { apiClient } from "../api/clientConfig";

type Mode = "login" | "signup";

const loginSchema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(6, "Minimum 6 characters"),
});

const signupSchema = z
	.object({
		fullName: z.string().min(2, "Enter your full name"),
		email: z.string().email("Enter a valid email"),
		password: z.string().min(6, "Minimum 6 characters"),
		confirmPassword: z.string().min(6, "Minimum 6 characters"),
		role: z.enum(["Agent", "Seller", "Buyer", "Admin"], { message: "Select a role" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

// Declare Google OAuth types
declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: any) => void;
					prompt: () => void;
					renderButton: (element: HTMLElement, config: any) => void;
				};
			};
		};
	}
}

export default function AuthForm({ mode }: { mode: Mode }) {
	const router = useRouter();
	const { show } = useToast();
	const [googleLoading, setGoogleLoading] = useState(false);
	const [showOtpVerification, setShowOtpVerification] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [otpCode, setOtpCode] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);

	const isLogin = mode === "login";

	const form = useForm<LoginValues | SignupValues>({
		resolver: zodResolver(isLogin ? loginSchema : signupSchema),
		defaultValues: isLogin
			? { email: "", password: "" }
			: { fullName: "", email: "", password: "", confirmPassword: "", role: undefined as any },
		mode: "onSubmit",
	});

	async function onSubmit(values: any) {
		try {
			if (isLogin) {
				const { email, password } = values as LoginValues;
				
				// Always use API for login
				const token = await AuthService.loginApiAuthLoginPost({ email, password });
				if (!token?.access_token) {
					show({ title: "Login failed", description: "No token returned from server.", type: "error" });
					return;
				}
				if (typeof window !== "undefined") {
					window.localStorage.setItem("kh_token", token.access_token);
				}
				// Update OpenAPI client token so subsequent calls (like /me) are authenticated
				OpenAPI.TOKEN = token.access_token;
				// Fetch current user to know their role and route to correct dashboard
				const me = await AuthService.readMeApiAuthMeGet();
				const role = (me.role || "agent").toLowerCase();
				show({ title: "Login successful", type: "success" });
				router.push(`/dashboard/${role}`);
				return;
			} else {
				const data = values as SignupValues;
				
				const response = await AuthService.signupApiAuthSignupPost({
					full_name: data.fullName,
					email: data.email,
					password: data.password,
					role: data.role,
				});
				
				// Show OTP verification form instead of redirecting
				setUserEmail(data.email);
				setShowOtpVerification(true);
				show({ 
					title: "Account created", 
					description: "Please check your email for the OTP verification code.", 
					type: "success" 
				});
			}
		} catch (error: any) {
			// Handle network errors
			if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
				show({
					title: "Connection Failed",
					description: "Cannot connect to the backend server. Please ensure the backend is running at http://127.0.0.1:8000",
					type: "error",
				});
				return;
			}
			
			// Handle validation errors
			if (error?.status === 422 || error?.body?.detail) {
				const detail = error.body?.detail;
				let errorMessage = "Validation error";
				if (Array.isArray(detail)) {
					errorMessage = detail.map((err: any) => {
						if (err.loc && err.msg) {
							return `${err.loc.join('.')}: ${err.msg}`;
						}
						return err.msg || JSON.stringify(err);
					}).join('; ');
				} else if (typeof detail === 'string') {
					errorMessage = detail;
				}
				show({
					title: "Login failed",
					description: errorMessage,
					type: "error",
				});
				return;
			}
			
			// Handle authentication errors
			if (error?.status === 401) {
				show({
					title: "Login failed",
					description: error?.body?.detail || "Incorrect email or password",
					type: "error",
				});
				return;
			}
			
			// Generic error
			show({
				title: "Request failed",
				description: error?.body?.detail || error?.message || "Something went wrong, please try again.",
				type: "error",
			});
		}
	}

	// Load Google Identity Services script and initialize (non-blocking)
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
		if (!GOOGLE_CLIENT_ID) {
			console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID not set. Google sign-in will not work.');
			return;
		}

		// Initialize Google OAuth callback (defined outside to avoid recreation)
		const initializeGoogleAuth = () => {
			// Initialize Google OAuth
			window.google?.accounts.id.initialize({
				client_id: GOOGLE_CLIENT_ID,
				callback: async (response: any) => {
					try {
						setGoogleLoading(true);
						if (!response.credential) {
							throw new Error('No credential received from Google');
						}

						// Send ID token to backend
						const result = await apiClient.post('/api/auth/google', {
							id_token: response.credential,
							role: isLogin ? undefined : "Buyer" // Default role for sign-ups
						});

						if (result.data?.access_token) {
							// Store token
							if (typeof window !== "undefined") {
								window.localStorage.setItem("kh_token", result.data.access_token);
							}
							OpenAPI.TOKEN = result.data.access_token;

							// Fetch user info to get role
							const me = await AuthService.readMeApiAuthMeGet();
							const role = (me.role || "buyer").toLowerCase();
							
							show({
								title: isLogin ? "Login successful" : "Account created",
								description: `Welcome ${me.full_name}!`,
								type: "success",
							});
							
							router.push(`/dashboard/${role}`);
						}
					} catch (error: any) {
						console.error('Google auth error:', error);
						let errorMessage = "Failed to authenticate with Google. Please try again.";
						
						if (error?.response?.data?.detail) {
							errorMessage = error.response.data.detail;
						} else if (error?.response?.data?.message) {
							errorMessage = error.response.data.message;
						} else if (error?.message) {
							errorMessage = error.message;
						}
						
						show({
							title: "Authentication failed",
							description: errorMessage,
							type: "error",
						});
					} finally {
						setGoogleLoading(false);
					}
				},
			});

			// Render Google button if ref is available (use requestAnimationFrame for non-blocking)
			requestAnimationFrame(() => {
				const buttonElement = document.getElementById('google-signin-button');
				if (buttonElement && window.google) {
					window.google.accounts.id.renderButton(buttonElement, {
						type: "standard",
						theme: "outline",
						size: "large",
						text: isLogin ? "signin_with" : "signup_with",
						width: "100%",
					});
				}
			});
		};

		// Load Google Identity Services script (non-blocking)
		if (!window.google) {
			// Check if script is already being loaded
			const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
			if (existingScript) {
				// Script is loading, wait for it
				existingScript.addEventListener('load', initializeGoogleAuth);
				return;
			}

			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.defer = true;
			script.onload = initializeGoogleAuth;
			script.onerror = () => {
				console.warn('Failed to load Google Identity Services script');
			};
			// Use requestIdleCallback or setTimeout to load script after page is interactive
			if ('requestIdleCallback' in window) {
				requestIdleCallback(() => {
					document.body.appendChild(script);
				}, { timeout: 2000 });
			} else {
				setTimeout(() => {
					document.body.appendChild(script);
				}, 100);
			}
		} else {
			// Google already loaded, initialize immediately
			initializeGoogleAuth();
		}

		// Cleanup function
		return () => {
			// Cleanup if needed
		};
	}, [isLogin, router, show]);

	const { register, handleSubmit, formState: { errors, isSubmitting } } = form as any;

	// Handle OTP verification
	async function handleOtpVerification(e: React.FormEvent) {
		e.preventDefault();
		setIsVerifying(true);
		
		try {
			const response = await apiClient.post('/api/auth/verify-otp', {
				email: userEmail,
				otp_code: otpCode
			});
			
			if (response.data?.access_token) {
				// Store token
				if (typeof window !== "undefined") {
					window.localStorage.setItem("kh_token", response.data.access_token);
				}
				OpenAPI.TOKEN = response.data.access_token;
				
				// Fetch user info to get role
				const me = await AuthService.readMeApiAuthMeGet();
				const role = (me.role || "buyer").toLowerCase();
				
				show({
					title: "Email verified",
					description: "Your account has been successfully verified!",
					type: "success",
				});
				
				router.push(`/dashboard/${role}`);
			}
		} catch (error: any) {
			let errorMessage = "Invalid OTP code. Please try again.";
			
			if (error?.response?.data?.detail) {
				errorMessage = error.response.data.detail;
			}
			
			show({
				title: "Verification failed",
				description: errorMessage,
				type: "error",
			});
		} finally {
			setIsVerifying(false);
		}
	}

	// Handle resend OTP
	async function handleResendOtp() {
		setIsResending(true);
		
		try {
			await apiClient.post('/api/auth/resend-otp', {
				email: userEmail
			});
			
			show({
				title: "OTP resent",
				description: "A new OTP code has been sent to your email.",
				type: "success",
			});
		} catch (error: any) {
			let errorMessage = "Failed to resend OTP. Please try again.";
			
			if (error?.response?.data?.detail) {
				errorMessage = error.response.data.detail;
			}
			
			show({
				title: "Resend failed",
				description: errorMessage,
				type: "error",
			});
		} finally {
			setIsResending(false);
		}
	}

	// Show OTP verification form if needed
	if (showOtpVerification && !isLogin) {
		return (
			<div className="space-y-4">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-neutral-900 mb-2">Verify Your Email</h2>
					<p className="text-sm text-neutral-600 mb-4">
						We've sent a 6-digit verification code to <strong>{userEmail}</strong>
					</p>
				</div>
				
				<form onSubmit={handleOtpVerification} className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium text-neutral-700">Enter OTP Code</label>
						<input
							type="text"
							value={otpCode}
							onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
							className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-center text-2xl font-mono tracking-widest shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
							placeholder="000000"
							maxLength={6}
							required
						/>
						<p className="mt-1 text-xs text-neutral-500">
							Enter the 6-digit code sent to your email
						</p>
					</div>
					
					<button
						type="submit"
						disabled={isVerifying || otpCode.length !== 6}
						className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isVerifying ? "Verifying..." : "Verify Email"}
					</button>
					
					<div className="text-center">
						<button
							type="button"
							onClick={handleResendOtp}
							disabled={isResending}
							className="text-sm text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isResending ? "Sending..." : "Resend OTP"}
						</button>
					</div>
					
					<div className="text-center">
						<button
							type="button"
							onClick={() => {
								setShowOtpVerification(false);
								setOtpCode("");
								setUserEmail("");
							}}
							className="text-sm text-neutral-600 hover:text-neutral-800"
						>
							Back to signup
						</button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Google Sign-In Button */}
			<div 
				id="google-signin-button"
				className="w-full"
				suppressHydrationWarning
			></div>
			{googleLoading && (
				<div className="text-center text-sm text-neutral-600">
					Signing in with Google...
				</div>
			)}

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-neutral-300"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="bg-white px-2 text-neutral-500">Or continue with email</span>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{!isLogin && (
				<div>
					<label className="mb-1 block text-sm font-medium text-neutral-700">Full Name</label>
					<input {...register("fullName")} suppressHydrationWarning className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Your name" />
					{errors.fullName && <p className="mt-1 text-xs text-rose-600">{String(errors.fullName.message)}</p>}
				</div>
			)}
			<div>
				<label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
				<input type="email" {...register("email")} suppressHydrationWarning className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="you@example.com" />
				{errors.email && <p className="mt-1 text-xs text-rose-600">{String(errors.email.message)}</p>}
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium text-neutral-700">Password</label>
				<input type="password" {...register("password")} suppressHydrationWarning className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="••••••" />
				{errors.password && <p className="mt-1 text-xs text-rose-600">{String(errors.password.message)}</p>}
			</div>
			{!isLogin && (
				<>
					<div>
						<label className="mb-1 block text-sm font-medium text-neutral-700">Confirm Password</label>
						<input type="password" {...register("confirmPassword")} suppressHydrationWarning className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="••••••" />
						{errors.confirmPassword && <p className="mt-1 text-xs text-rose-600">{String(errors.confirmPassword.message)}</p>}
					</div>
					<fieldset>
						<legend className="mb-1 block text-sm font-medium text-neutral-700">You are</legend>
						<div className="grid grid-cols-2 gap-3">
							<label className="inline-flex items-center gap-2 text-sm text-neutral-700">
								<input type="radio" value="Agent" {...register("role")} className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" /> Agent
							</label>
							<label className="inline-flex items-center gap-2 text-sm text-neutral-700">
								<input type="radio" value="Seller" {...register("role")} className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" /> Seller
							</label>
							<label className="inline-flex items-center gap-2 text-sm text-neutral-700">
								<input type="radio" value="Buyer" {...register("role")} className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" /> Buyer
							</label>
							<label className="inline-flex items-center gap-2 text-sm text-neutral-700">
								<input type="radio" value="Admin" {...register("role")} className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" /> Admin
							</label>
						</div>
						{errors.role && <p className="mt-1 text-xs text-rose-600">{String((errors as any).role.message)}</p>}
					</fieldset>
				</>
			)}
				<button type="submit" disabled={isSubmitting} suppressHydrationWarning className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
					{isLogin ? (isSubmitting ? "Logging in..." : "Login") : isSubmitting ? "Creating account..." : "Create account"}
				</button>
			</form>
		</div>
	);
}


