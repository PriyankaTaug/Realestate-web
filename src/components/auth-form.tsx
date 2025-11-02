"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

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
		role: z.enum(["Agent", "Seller"], { required_error: "Select a role" }),
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
		if (isLogin) {
			const { email, password } = values as LoginValues;
			if (email === "agent@test.com" && password === "123456") {
				show({ title: "Welcome back, Agent!", type: "success" });
				router.push("/dashboard/agent");
				return;
			}
			if (email === "seller@test.com" && password === "123456") {
				show({ title: "Welcome back, Seller!", type: "success" });
				router.push("/dashboard/seller");
				return;
			}
			show({ title: "Invalid credentials", description: "Use the test accounts shown above.", type: "error" });
			return;
		} else {
			const data = values as SignupValues;
			show({ title: "Account created", description: `Welcome ${data.fullName}!`, type: "success" });
			router.push("/login");
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
						<div className="flex gap-4">
							<label className="inline-flex items-center gap-2 text-sm text-neutral-700">
								<input type="radio" value="Agent" {...register("role")} className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" /> Agent
							</label>
							<label className="inline-flex items-center gap-2 text-sm text-neutral-700">
								<input type="radio" value="Seller" {...register("role")} className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" /> Seller
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


