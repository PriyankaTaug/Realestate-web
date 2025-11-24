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

function RoleCard({
	index,
	title,
	desc,
	img,
}: {
	index: string;
	title: string;
	desc: string;
	img: string;
}) {
	return (
		<div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70 transition hover:-translate-y-0.5 hover:shadow-md">
			<div className="relative h-44 w-full bg-neutral-100 sm:h-56">
				<img src={img} alt={title} className="h-full w-full object-cover" />
			</div>
			<div className="p-5">
				<div className="flex items-center justify-between">
					<span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{index}</span>
				</div>
				<h3 className="mt-3 text-base font-semibold text-neutral-900">{title}</h3>
				<p className="mt-1 text-sm text-neutral-600">{desc}</p>
			</div>
		</div>
	);
}

export default function About() {
	return (
		<section id="about" className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl text-center">
				<h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">About Us</h2>
				<p className="mt-2 text-sm text-neutral-600">KeralaHomez at a glance</p>
			</div>

			{/* Animated stats */}
			<div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-3">
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
			<div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
				<RoleCard
					index="01"
					title="Buyer"
					desc="Discover verified properties, compare options, and get guided support from search to closing."
					img="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80&auto=format&fit=crop"
				/>
				<RoleCard
					index="02"
					title="Agent"
					desc="Grow your business with qualified leads, seamless listings, and modern marketing tools."
					img="https://images.unsplash.com/photo-1524504388940-1e8b8423a00e?w=900&q=80&auto=format&fit=crop"
				/>
				<RoleCard
					index="03"
					title="Seller"
					desc="List your property with confidence, get expert pricing, and close faster with vetted buyers."
					img="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=900&q=80&auto=format&fit=crop"
				/>
			</div>


		</section>
	);
}


