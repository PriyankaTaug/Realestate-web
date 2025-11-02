import Image from "next/image";
import Link from "next/link";

const partners = [
	"https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
	"https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
	"https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
	"https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png",
];

export default function PartnersCTA() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
			<div className="rounded-3xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-10">
				<p className="text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Trusted by industry leaders</p>
				<div className="mt-6 grid grid-cols-2 items-center gap-6 sm:grid-cols-4">
					{partners.map((src, idx) => (
						<div key={idx} className="flex items-center justify-center opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
							<Image src={src} alt="Partner logo" width={140} height={40} className="h-8 w-auto object-contain" />
						</div>
					))}
				</div>

				<div className="mt-10 grid items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 sm:grid-cols-2 sm:gap-6 sm:p-10">
					<div>
						<h3 className="text-xl font-bold text-white sm:text-2xl">Become a real estate agent</h3>
						<p className="mt-2 text-sm text-emerald-50">Join KeralaHomz and grow your business with verified leads and modern tools.</p>
					</div>
					<div className="flex justify-start sm:justify-end">
						<Link href="#register" className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow hover:bg-neutral-50">Register Now</Link>
					</div>
				</div>
			</div>
		</section>
	);
}


