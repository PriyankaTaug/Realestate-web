import Image from "next/image";

export default function Testimonial() {
	return (
		<section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="overflow-hidden rounded-3xl border border-neutral-200/70 dark:border-neutral-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-neutral-800 p-8 sm:p-12">
				<div className="mx-auto max-w-3xl text-center">
					<Image
						src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop"
						alt="Founder avatar"
						width={72}
						height={72}
						sizes="72px"
						className="mx-auto h-18 w-18 rounded-full object-cover"
						loading="lazy"
						unoptimized={false}
					/>
					<blockquote className="mt-6 text-xl font-medium leading-8 text-neutral-800 dark:text-neutral-200">
						"KeralaHomez was built to simplify property decisions. We combine local expertise with transparent processes so you can find the right home with confidence."
					</blockquote>
					<p className="mt-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Anjana Varma</p>
					<p className="text-xs text-neutral-500 dark:text-neutral-400">Founder, KeralaHomez</p>
				</div>
			</div>
		</section>
	);
}


