"use client";

import Link from "next/link";
import AuthForm from "@/components/auth-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import AuthLayout from "@/components/auth-layout";

export default function LoginPage() {
	return (
		<AuthLayout title="Welcome back" subtitle="Login to continue to KeralaHomez">
			<Card>
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Use the test credentials below to explore</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert>
						<p className="font-semibold">Test credentials</p>
						<ul className="mt-1 list-inside list-disc text-sm">
							<li>Agent: agent@test.com / 123456 → /dashboard/agent</li>
							<li>Seller: seller@test.com / 123456 → /dashboard/seller</li>
							<li>Buyer: buyer@test.com / 123456 → /dashboard/buyer</li>
							<li>Admin: admin@test.com / 123456 → /dashboard/admin</li>
						</ul>
					</Alert>

					<div className="mt-4" />
					<AuthForm mode="login" />

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


