import Link from "next/link";

export default function PartnersCTA() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
			<div className="rounded-3xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-10">
				
				<div className="mt-10 grid items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 sm:grid-cols-2 sm:gap-6 sm:p-10">
					<div>
						<h3 className="text-xl font-bold text-white sm:text-2xl">Become a real estate agent</h3>
						<p className="mt-2 text-sm text-emerald-50">Join KeralaHomez and grow your business with verified leads and modern tools.</p>
					</div>
					<div className="flex justify-start sm:justify-end">
						<Link href="#register" className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow hover:bg-neutral-50">Register Now</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

