import Image from "next/image";
import Link from "next/link";

const cities = [
	{
		name: "Kochi",
		desc: "Smart city with waterfront living and growing IT hubs.",
		image:
			"https://images.unsplash.com/photo-1601582585289-1ec24490f9c9?q=80&w=1974&auto=format&fit=crop",
		slug: "kochi",
	},
	{
		name: "Kannur",
		desc: "Calm coastal life with excellent connectivity and beaches.",
		image:
			"https://images.unsplash.com/photo-1543248939-ff40856f65d4?q=80&w=2070&auto=format&fit=crop",
		slug: "kannur",
	},
	{
		name: "Trivandrum",
		desc: "Kerala's capital with premium neighborhoods and amenities.",
		image:
			"https://images.unsplash.com/photo-1542190891-2093d38760f2?q=80&w=2069&auto=format&fit=crop",
		slug: "trivandrum",
	},
	{
		name: "Kozhikode",
		desc: "Historic city with vibrant markets and coastal charm.",
		image:
			"https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=2069&auto=format&fit=crop",
		slug: "kozhikode",
	},
];

export default function Cities() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
			<div className="mb-8 flex items-end justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Explore Properties by Cities</h2>
					<p className="mt-2 text-sm text-neutral-600">Find homes where you love to live</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{cities.map((c) => (
					<div key={c.slug} className="group relative overflow-hidden rounded-2xl">
						<div className="relative h-56 w-full">
							<Image src={c.image} alt={c.name} fill className="object-cover transition duration-300 group-hover:scale-105" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
						</div>
						<div className="absolute inset-0 flex flex-col justify-end p-5">
							<h3 className="text-lg font-semibold text-white">{c.name}</h3>
							<p className="mt-1 line-clamp-2 text-sm text-white/85">{c.desc}</p>
							<div className="mt-3">
								<Link href={`/cities/${c.slug}`} className="inline-flex items-center rounded-md bg-white/95 px-3 py-2 text-xs font-semibold text-neutral-900 shadow hover:bg-white">
									Explore
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}


