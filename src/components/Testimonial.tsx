import Image from "next/image";

export default function Testimonial() {
	return (
		<section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="overflow-hidden rounded-3xl border border-neutral-200/70 bg-gradient-to-br from-emerald-50 to-white p-8 sm:p-12">
				<div className="mx-auto max-w-3xl text-center">
					<Image
						src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop"
						alt="Founder avatar"
						width={72}
						height={72}
						className="mx-auto h-18 w-18 rounded-full object-cover"
					/>
					<blockquote className="mt-6 text-xl font-medium leading-8 text-neutral-800">
						“KeralaHomz was built to simplify property decisions. We combine local expertise with transparent processes so you can find the right home with confidence.”
					</blockquote>
					<p className="mt-4 text-sm font-semibold text-neutral-700">Anjana Varma</p>
					<p className="text-xs text-neutral-500">Founder, KeralaHomz</p>
				</div>
			</div>
		</section>
	);
}


