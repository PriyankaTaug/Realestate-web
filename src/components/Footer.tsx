import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-neutral-200/60 bg-white" aria-labelledby="footer-heading">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-12">
					<div className="sm:col-span-5">
						<div className="flex items-center gap-2">
							<span className="inline-block rounded-md bg-emerald-600 px-2.5 py-1 text-sm font-bold leading-none text-white">KH</span>
							<span className="text-lg font-semibold tracking-tight">KeralaHomz</span>
						</div>
						<p className="mt-4 text-sm text-neutral-600">
							Premium real estate marketplace for Kerala. Discover homes, explore neighborhoods, and close deals with confidence.
						</p>
						<div className="mt-4 flex items-center gap-3">
							<Link href="#" aria-label="Twitter" className="rounded-full p-2 text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50 hover:text-emerald-700">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.177 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.606.996A4.106 4.106 0 0 0 16.616 4c-2.266 0-4.103 1.837-4.103 4.102 0 .322.036.637.106.938-3.41-.171-6.437-1.803-8.46-4.286a4.087 4.087 0 0 0-.556 2.064 4.102 4.102 0 0 0 1.826 3.417 4.073 4.073 0 0 1-1.858-.513v.052c0 2.042 1.452 3.747 3.379 4.135a4.095 4.095 0 0 1-1.853.07 4.106 4.106 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407 11.616 11.616 0 0 0 8.29 20"/></svg>
							</Link>
							<Link href="#" aria-label="LinkedIn" className="rounded-full p-2 text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50 hover:text-emerald-700">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.98H4.76V24H.24V8.98ZM8.32 8.98h4.32v2.05h.06c.6-1.14 2.06-2.35 4.24-2.35 4.54 0 5.38 2.98 5.38 6.85V24h-4.52v-6.66c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.52V24H8.32V8.98Z"/></svg>
							</Link>
							<Link href="#" aria-label="Facebook" className="rounded-full p-2 text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50 hover:text-emerald-700">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07C1.86 17.1 5.52 21.21 10.26 22v-7.02H7.9v-2.9h2.36V9.89c0-2.34 1.39-3.63 3.52-3.63 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.17 0-1.53.73-1.53 1.48v1.78h2.6l-.41 2.9h-2.19V22c4.74-.79 8.4-4.9 8.4-9.93Z"/></svg>
							</Link>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-8 sm:col-span-7 sm:grid-cols-3">
						<div>
							<h4 className="text-sm font-semibold text-neutral-800">Quick Links</h4>
							<ul className="mt-3 space-y-2 text-sm text-neutral-600">
								<li><Link href="#home" className="hover:text-emerald-700">Home</Link></li>
								<li><Link href="#about" className="hover:text-emerald-700">About Us</Link></li>
								<li><Link href="#properties" className="hover:text-emerald-700">Properties</Link></li>
								<li><Link href="#agents" className="hover:text-emerald-700">Agents</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-neutral-800">Locations</h4>
							<ul className="mt-3 space-y-2 text-sm text-neutral-600">
								<li><Link href="#" className="hover:text-emerald-700">Kochi</Link></li>
								<li><Link href="#" className="hover:text-emerald-700">Trivandrum</Link></li>
								<li><Link href="#" className="hover:text-emerald-700">Kozhikode</Link></li>
								<li><Link href="#" className="hover:text-emerald-700">Kannur</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-neutral-800">Legal</h4>
							<ul className="mt-3 space-y-2 text-sm text-neutral-600">
								<li><Link href="#" className="hover:text-emerald-700">Terms</Link></li>
								<li><Link href="#" className="hover:text-emerald-700">Privacy</Link></li>
								<li><Link href="#" className="hover:text-emerald-700">Cookies</Link></li>
							</ul>
						</div>
					</div>
				</div>
				<div className="mt-10 border-t border-neutral-200/60 pt-6">
					<p className="text-xs text-neutral-500">© {new Date().getFullYear()} KeralaHomz. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}


