import Image from "next/image";
import Link from "next/link";

const properties = [
	{
		id: 1,
		title: "Waterfront Luxury Villa",
		city: "Kochi",
		image:
			"https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2069&auto=format&fit=crop",
		beds: 4,
		size: "3,200 sqft",
		area: "Marine Drive",
		price: "₹2.1 Cr",
	},
	{
		id: 2,
		title: "Modern High-Rise Apartment",
		city: "Trivandrum",
		image:
			"https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2069&auto=format&fit=crop",
		beds: 3,
		size: "1,650 sqft",
		area: "Kowdiar",
		price: "₹95 Lakh",
	},
	{
		id: 3,
		title: "Premium Gated Villa",
		city: "Kannur",
		image:
			"https://images.unsplash.com/photo-1594495894542-74cd39f06e90?q=80&w=2069&auto=format&fit=crop",
		beds: 4,
		size: "2,850 sqft",
		area: "Thottada",
		price: "₹1.45 Cr",
	},
	{
		id: 4,
		title: "Boutique Smart Home",
		city: "Kozhikode",
		image:
			"https://images.unsplash.com/photo-1560448075-bb4caa6c0f11?q=80&w=2069&auto=format&fit=crop",
		beds: 3,
		size: "1,900 sqft",
		area: "Vellayil",
		price: "₹1.1 Cr",
	},
];

export default function PopularProperties() {
	return (
		<section id="properties" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
			<div className="mb-8 flex items-end justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">Our Popular Projects</h2>
					<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Handpicked properties loved by our customers</p>
				</div>
				<Link href="#" className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-500">View all</Link>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{properties.map((p) => (
					<div key={p.id} className="group overflow-hidden rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-800 shadow-sm transition hover:shadow-md">
						<div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-700">
							<Image 
								src={p.image} 
								alt={p.title} 
								fill 
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
								className="object-cover transition duration-300 group-hover:scale-105" 
								loading="lazy"
								unoptimized={false}
							/>
							<div className="absolute left-3 top-3 rounded-md bg-white/90 dark:bg-neutral-800/90 px-2 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-100 shadow">{p.city}</div>
						</div>
						<div className="p-4">
							<h3 className="line-clamp-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">{p.title}</h3>
							<p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{p.area}</p>
							<div className="mt-3 flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
								<span className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 11.25A2.25 2.25 0 0 1 9.75 9h4.5a2.25 2.25 0 0 1 2.25 2.25v6a.75.75 0 0 1-1.5 0V18H9v-.75a.75.75 0 0 0-1.5 0v.75H6.75a.75.75 0 0 1-.75-.75v-6Z"/><path d="M9 6.75A2.25 2.25 0 0 1 11.25 4.5h1.5A2.25 2.25 0 0 1 15 6.75V9H9V6.75Z"/></svg>{p.beds} Beds</span>
								<span className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25Z"/></svg>{p.size}</span>
							</div>
							<div className="mt-4 flex items-center justify-between">
								<p className="text-base font-bold text-neutral-900 dark:text-neutral-100">{p.price}</p>
								<Link href={`/property/${p.id}`} className="rounded-md bg-emerald-600 dark:bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 dark:hover:bg-emerald-600">View Details</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}


