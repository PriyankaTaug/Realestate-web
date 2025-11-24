"use client";

import Link from "next/link";
import AuthForm from "@/components/auth-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AuthLayout from "@/components/auth-layout";

export default function SignupPage() {
	return (
		<AuthLayout title="Create your account" subtitle="Join KeralaHomez to get started">
			<Card>
				<CardHeader>
					<CardTitle>Sign up</CardTitle>
					<CardDescription>Fill the details below</CardDescription>
				</CardHeader>
				<CardContent>
					<AuthForm mode="signup" />
					<p className="mt-4 text-sm text-neutral-600">
						Already have an account? <Link href="/login" className="font-semibold text-emerald-700 hover:underline">Login</Link>
					</p>
				</CardContent>
			</Card>
		</AuthLayout>
	);
}


