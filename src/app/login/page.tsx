"use client";

import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/components/auth-layout";

// Dynamically import AuthForm to reduce initial bundle size
const AuthForm = dynamic(() => import("@/components/auth-form"), {
	ssr: false,
	loading: () => (
		<div className="space-y-4">
			<div className="h-10 w-full animate-pulse rounded-md bg-neutral-200"></div>
			<div className="h-10 w-full animate-pulse rounded-md bg-neutral-200"></div>
			<div className="h-10 w-full animate-pulse rounded-md bg-neutral-200"></div>
		</div>
	),
});

export default function LoginPage() {
	return (
		<AuthLayout title="Welcome back" subtitle="Login to continue to KeralaHomez">
			<Card>
				<CardHeader>
					<CardTitle>Login</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense fallback={
						<div className="space-y-4">
							<div className="h-10 w-full animate-pulse rounded-md bg-neutral-200"></div>
							<div className="h-10 w-full animate-pulse rounded-md bg-neutral-200"></div>
							<div className="h-10 w-full animate-pulse rounded-md bg-neutral-200"></div>
						</div>
					}>
						<AuthForm mode="login" />
					</Suspense>

					<div className="mt-4 flex items-center justify-between text-sm">
						<Link href="#forgot" className="text-emerald-700 hover:underline">Forgot Password?</Link>
						<span className="text-neutral-600">
							New here? <Link href="/signup" className="font-semibold text-emerald-700 hover:underline">Create an account</Link>
						</span>
					</div>
				</CardContent>
			</Card>
		</AuthLayout>
	);
}


