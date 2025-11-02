"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
	const ref = useRef<T | null>(null);
	const [inView, setInView] = useState(false);
	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) => e.isIntersecting && setInView(true));
		}, { threshold: 0.35, ...options });
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [options]);
	return { ref, inView } as const;
}

function AnimatedCounter({ end, prefix = "", suffix = "+", durationMs = 1200 }: { end: number; prefix?: string; suffix?: string; durationMs?: number }) {
	const { ref, inView } = useInView<HTMLParagraphElement>();
	const [value, setValue] = useState(0);
	useEffect(() => {
		if (!inView) return;
		let start: number | null = null;
		const step = (ts: number) => {
			if (start === null) start = ts;
			const progress = Math.min(1, (ts - start) / durationMs);
			setValue(Math.round(progress * end));
			if (progress < 1) requestAnimationFrame(step);
		};
		const id = requestAnimationFrame(step);
		return () => cancelAnimationFrame(id);
	}, [end, durationMs, inView]);
	return (
		<p ref={ref} className="text-2xl font-bold text-neutral-900">
			{prefix}
			{value}
			{suffix}
		</p>
	);
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
	return (
		<div className="group rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm transition hover:shadow-md">
			<div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100">
				{icon}
			</div>
			<h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
			<p className="mt-1 text-xs text-neutral-600">{desc}</p>
		</div>
	);
}

export default function About() {
	const features = useMemo(
		() => [
			{
				title: "Local Experts",
				desc: "In-depth neighborhood guidance from Kerala natives.",
				icon: (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
						<path d="M11.7 1.03a.75.75 0 0 1 .6 0l9 4a.75.75 0 0 1 0 1.36l-9 4a.75.75 0 0 1-.6 0l-9-4a.75.75 0 0 1 0-1.36l9-4Z"/>
						<path d="M3 9.53l8.4 3.73c.38.17.81.17 1.2 0L21 9.53V17a.75.75 0 0 1-.45.69l-9 4a.75.75 0 0 1-.6 0l-9-4A.75.75 0 0 1 3 17V9.53Z"/>
					</svg>
				),
			},
			{
				title: "Verified Listings",
				desc: "Quality checks for photos, documents, and amenities.",
				icon: (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
						<path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25V9h-.75A2.25 2.25 0 0 0 3.75 11.25v7.5A2.25 2.25 0 0 0 6 21h12a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 18 9h-.75V6.75A5.25 5.25 0 0 0 12 1.5Zm-3 7.5V6.75a3 3 0 0 1 6 0V9H9Z" clipRule="evenodd"/>
						<path d="M9.75 13.5l1.69 1.69 2.81-2.81 1.06 1.06-3.87 3.87-2.75-2.75 1.06-1.06Z"/>
					</svg>
				),
			},
			{
				title: "24/7 Support",
				desc: "Get help anytime via chat, call, or WhatsApp.",
				icon: (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
						<path d="M2.25 6.75A3.75 3.75 0 0 1 6 3h12a3.75 3.75 0 0 1 3.75 3.75V18A3.75 3.75 0 0 1 18 21H9.94a3.75 3.75 0 0 1-2.65-1.1l-4.14-4.14a3.75 3.75 0 0 1-1.1-2.65V6.75Z"/>
					</svg>
				),
			},
		],
		[]
	);

	return (
		<section id="about" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl text-center">
				<h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">About Us</h2>
				<p className="mt-2 text-sm text-neutral-600">KeralaHomz at a glance</p>
			</div>

			{/* Animated stats */}
			<div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-3">
				<div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:shadow-md">
					<AnimatedCounter end={1200} />
					<p className="text-sm text-neutral-600">Listed Properties</p>
				</div>
				<div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:shadow-md">
					<AnimatedCounter end={4500} />
					<p className="text-sm text-neutral-600">Happy Customers</p>
				</div>
				<div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:shadow-md">
					<AnimatedCounter end={100} />
					<p className="text-sm text-neutral-600">Awards</p>
				</div>
			</div>

			{/* Feature highlights */}
			<div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
				{features.map((f, i) => (
					<Feature key={i} title={f.title} desc={f.desc} icon={f.icon} />
				))}
			</div>


		</section>
	);
}


