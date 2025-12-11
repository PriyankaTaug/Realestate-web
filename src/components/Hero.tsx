import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Hero() {
	return (
		<section id="home" className="relative overflow-hidden min-h-[520px]">
			<div className="absolute inset-0 -z-10 bg-neutral-200 dark:bg-neutral-800">
				<Image
					src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2400&auto=format&fit=crop"
					alt="Modern house"
					fill
					priority
					sizes="100vw"
					className="object-cover dark:opacity-80"
					unoptimized={false}
				/>
				<div className="absolute inset-0 bg-neutral-900/35 dark:bg-neutral-900/60" />
			</div>

			<div className="mx-auto max-w-7xl px-4 py-24 sm:py-28 md:py-32 lg:py-40">
				<div className="mx-auto max-w-3xl text-center">
					<h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Find A House That Suits You</h1>
					<p className="mx-auto mt-5 max-w-xl text-base text-neutral-100 sm:text-lg">
						Discover curated homes across Kerala with transparent pricing, expert guidance, and a seamless buying experience.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
						<Link href="#search" className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">Get Started</Link>
						<Link href="#properties" className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/20">Browse Properties</Link>
					</div>

					{/* Search section placed below heading */}
					<div className="mx-auto mt-8 max-w-6xl">
						<SearchBar />
					</div>
				</div>

			</div>
		</section>
	);
}


