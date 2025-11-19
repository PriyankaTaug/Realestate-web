import Link from "next/link";
import Image from "next/image";

const propertyTypes = [
	
	{
		id: 2,
		name: "Townhouse",
		image: "/images/house.png",
		icon: (
			<svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
				<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
			</svg>
		),
		count: "152 Properties"
	},
	{
		id: 3,
		name: "Villa",
		image: "/images/villa.png",
		icon: (
			<svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
				<path d="M19 9.3V4h-3v2.6L12 3L2 12h3v8h5v-6h4v6h5v-8h3L19 9.3z"/>
				<path d="M7 10h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
			</svg>
		),
		count: "89 Properties"
	},
	{
		id: 4,
		name: "Apartments",
		image: "/images/apartment.png",
		icon: (
			<svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
				<path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
			</svg>
		),
		count: "142 Properties"
	},
	
	
];

export default function TrySearchingFor() {
	return (
		<section className="bg-gray-50 py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Try Searching For
					</h2>
					<p className="mt-4 text-lg text-gray-600">
						Thousands of luxury home enthusiasts just like you have found their dream home
					</p>
				</div>

				<div className="mt-12 flex justify-center">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl">
					{propertyTypes.map((type) => (
						<Link
							key={type.id}
							href={`/properties?type=${type.name.toLowerCase()}`}
							className="group flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105 aspect-square"
						>
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-600">
								{type.image ? (
									<Image
										src={type.image}
										alt={type.name}
										width={32}
										height={32}
										className="h-8 w-8 object-contain"
									/>
								) : (
									type.icon
								)}
							</div>
							<h3 className="mt-4 text-sm font-semibold text-gray-900 group-hover:text-emerald-600">
								{type.name}
							</h3>
							<p className="mt-1 text-xs text-gray-500">
								{type.count}
							</p>
						</Link>
					))}
					</div>
				</div>
			</div>
		</section>
	);
}
