import { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
	return <div className="rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8">{children}</div>;
}

export function CardHeader({ children }: PropsWithChildren) {
	return <div className="mb-5">{children}</div>;
}

export function CardTitle({ children }: PropsWithChildren) {
	return <h2 className="text-xl font-semibold text-neutral-900">{children}</h2>;
}

export function CardDescription({ children }: PropsWithChildren) {
	return <p className="mt-1 text-sm text-neutral-600">{children}</p>;
}

export function CardContent({ children }: PropsWithChildren) {
	return <div className="mt-4 space-y-4">{children}</div>;
}

export function CardFooter({ children }: PropsWithChildren) {
	return <div className="mt-6">{children}</div>;
}


