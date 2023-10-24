import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
	return (
		<section className="flex flex-col min-h-screen overflow-hidden">
			<Header />
			<main className="flex-1 flex items-stretch px-6 sm:px-8 lg:px-12 py-2 pb-6 sm:py-6 lg:py-8 bg-[#8D72E1]/30">
				<section className="w-full">{children}</section>
			</main>

			<Footer />
		</section>
	);
}
