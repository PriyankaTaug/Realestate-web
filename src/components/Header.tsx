"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2">
						<span className="inline-block rounded-md bg-emerald-600 px-2.5 py-1 text-sm font-bold leading-none text-white">KH</span>
						<span className="text-lg font-semibold tracking-tight">KeralaHomz</span>
					</Link>
				</div>

				<nav className="hidden items-center gap-8 md:flex">
					<Link href="#home" className="text-sm font-medium text-neutral-700 hover:text-emerald-700">Home</Link>
					<Link href="#about" className="text-sm font-medium text-neutral-700 hover:text-emerald-700">About Us</Link>
					<Link href="#properties" className="text-sm font-medium text-neutral-700 hover:text-emerald-700">Properties</Link>
					<Link href="#agents" className="text-sm font-medium text-neutral-700 hover:text-emerald-700">Agents</Link>
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					<Link href="/login" className="rounded-md px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-emerald-700">Login</Link>
					<Link href="/signup" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Sign Up</Link>
				</div>

				<button
					aria-label="Toggle Menu"
					className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
					onClick={() => setMobileOpen((v) => !v)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="h-6 w-6"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				</button>
			</div>

			{/* Mobile menu */}
			<div className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
				<div className="space-y-1 border-t border-neutral-200/60 px-4 pb-4 pt-2">
					<Link onClick={() => setMobileOpen(false)} href="#home" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Home</Link>
					<Link onClick={() => setMobileOpen(false)} href="#about" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">About Us</Link>
					<Link onClick={() => setMobileOpen(false)} href="#properties" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Properties</Link>
					<Link onClick={() => setMobileOpen(false)} href="#agents" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Agents</Link>
					<div className="mt-2 flex gap-2">
						<Link href="/login" className="flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-100">Login</Link>
						<Link href="/signup" className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700">Sign Up</Link>
					</div>
				</div>
			</div>
		</header>
	);
}


