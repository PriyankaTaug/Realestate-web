"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; title: string; description?: string; type?: ToastType };

type ToastContextValue = {
	show: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const show = useCallback((t: Omit<Toast, "id">) => {
		const id = Date.now() + Math.random();
		setToasts((prev) => [...prev, { id, ...t }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((x) => x.id !== id));
		}, 3200);
	}, []);

	const value = useMemo(() => ({ show }), [show]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className="pointer-events-none fixed right-4 top-4 z-[100] space-y-2">
				{toasts.map((t) => (
					<div key={t.id} className={`pointer-events-auto w-80 rounded-md border p-3 shadow-lg ${
						t.type === "success"
							? "border-emerald-300 bg-emerald-50 text-emerald-900"
						: t.type === "error"
							? "border-rose-300 bg-rose-50 text-rose-900"
							: "border-neutral-200 bg-white text-neutral-900"
					}` }>
						<p className="text-sm font-semibold">{t.title}</p>
						{t.description ? <p className="mt-0.5 text-xs text-neutral-600">{t.description}</p> : null}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within ToastProvider");
	return ctx;
}


