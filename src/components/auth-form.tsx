"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import "../api/clientConfig";
import { AuthService, OpenAPI } from "../api/client";

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

export default function AuthForm({ mode }: { mode: Mode }) {
	const router = useRouter();
	const { show } = useToast();

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
				
				await AuthService.signupApiAuthSignupPost({
					full_name: data.fullName,
					email: data.email,
					password: data.password,
					role: data.role,
				});
				show({ title: "Account created", description: `Welcome ${data.fullName}!`, type: "success" });
				router.push("/login");
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

	const { register, handleSubmit, formState: { errors, isSubmitting } } = form as any;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{!isLogin && (
				<div>
					<label className="mb-1 block text-sm font-medium text-neutral-700">Full Name</label>
					<input {...register("fullName")} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Your name" />
					{errors.fullName && <p className="mt-1 text-xs text-rose-600">{String(errors.fullName.message)}</p>}
				</div>
			)}
			<div>
				<label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
				<input type="email" {...register("email")} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="you@example.com" />
				{errors.email && <p className="mt-1 text-xs text-rose-600">{String(errors.email.message)}</p>}
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium text-neutral-700">Password</label>
				<input type="password" {...register("password")} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="••••••" />
				{errors.password && <p className="mt-1 text-xs text-rose-600">{String(errors.password.message)}</p>}
			</div>
			{!isLogin && (
				<>
					<div>
						<label className="mb-1 block text-sm font-medium text-neutral-700">Confirm Password</label>
						<input type="password" {...register("confirmPassword")} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="••••••" />
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
			<button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
				{isLogin ? (isSubmitting ? "Logging in..." : "Login") : isSubmitting ? "Creating account..." : "Create account"}
			</button>
		</form>
	);
}


