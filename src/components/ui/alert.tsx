import { PropsWithChildren } from "react";

export function Alert({ children }: PropsWithChildren) {
	return (
		<div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">
			<span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold">!</span>
			<div className="text-sm leading-6">{children}</div>
		</div>
	);
}


