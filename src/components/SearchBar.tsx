"use client";

import { useState } from "react";

const tabs = ["Buy", "Rent", "Commercial"] as const;
type Tab = typeof tabs[number];

export default function SearchBar() {
	const [activeTab, setActiveTab] = useState<Tab>("Buy");

    return (
        <section id="search" className="mt-6 mb-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl rounded-2xl bg-white/90 p-5 shadow-2xl ring-1 ring-neutral-200/70 backdrop-blur-sm sm:p-6">
				<div
					role="tablist"
					aria-label="Search categories"
					className="mx-auto flex w-full max-w-full snap-x gap-2 overflow-x-auto rounded-full bg-neutral-100 p-1.5 sm:justify-center"
				>
					{tabs.map((tab) => (
						<button
							key={tab}
							role="tab"
							aria-selected={activeTab === tab}
							onClick={() => setActiveTab(tab)}
							suppressHydrationWarning
							className={`min-w-[6rem] snap-center rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
								activeTab === tab
									? "bg-emerald-600 text-white shadow"
									: "bg-transparent text-neutral-700 hover:bg-white"
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				<form
					className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4"
					onSubmit={(e) => e.preventDefault()}
				>
					<div>
						<label className="mb-1 block text-xs font-medium text-neutral-700">Location</label>
						<div className="relative">
							<span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-neutral-400">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M21 21l-4.35-4.35"></path><circle cx="10" cy="10" r="7"></circle></svg>
							</span>
							<input
								type="text"
								placeholder="Search by city or area"
								suppressHydrationWarning
								className="w-full rounded-lg border border-neutral-300 bg-white px-10 py-2.5 text-sm shadow-sm placeholder:text-neutral-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
							/>
						</div>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-neutral-700">Property Type</label>
						<select 
						suppressHydrationWarning
						className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
					>
							<option>Apartment</option>
							<option>Villa</option>
							<option>Independent House</option>
							<option>Commercial</option>
						</select>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-neutral-700">Budget</label>
						<select 
						suppressHydrationWarning
						className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
					>
							<option>Below ₹50L</option>
							<option>₹50L - ₹1Cr</option>
							<option>₹1Cr - ₹2Cr</option>
							<option>Above ₹2Cr</option>
						</select>
					</div>
					<div className="flex items-end">
						<button
							type="submit"
							suppressHydrationWarning
							className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
						>
							Search Now
						</button>
					</div>
				</form>

				<p className="mt-2 text-xs text-neutral-600">Showing options for <span className="font-semibold text-neutral-800">{activeTab}</span></p>
			</div>
		</section>
	);
}


