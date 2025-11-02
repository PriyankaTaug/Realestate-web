import { PropsWithChildren } from "react";

export default function AuthLayout({ children, title, subtitle }: PropsWithChildren<{ title: string; subtitle?: string }>) {
	return (
		<section className="min-h-[88vh] bg-gradient-to-b from-emerald-50/70 to-white">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
				<div className="mb-6 flex items-center gap-2">
					<span className="inline-block rounded-md bg-emerald-600 px-2.5 py-1 text-sm font-bold leading-none text-white">KH</span>
					<span className="text-lg font-semibold tracking-tight text-neutral-900">KeralaHomz</span>
				</div>
				<h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{title}</h1>
				{subtitle ? <p className="mt-1 text-sm text-neutral-600">{subtitle}</p> : null}
				<div className="mt-8 w-full max-w-md">{children}</div>
			</div>
		</section>
	);
}


