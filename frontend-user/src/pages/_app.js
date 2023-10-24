import { SWRConfig } from "swr";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "../../contexts/Auth";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export default function App({ Component, pageProps }) {
	return (
		<>
			<SWRConfig
				value={{
					fetcher: async (...args) => {
						const res = await fetch(...args);

						if (!res.ok) {
							const error = new Error("An error occurred while fetching the data.");
							error.info = await res.json();
							error.status = res.status;
							throw error;
						}

						return res.json();
					},
				}}
			>
				<AuthProvider>
					<main className={`${inter.variable} font-sans`}>
						<Component {...pageProps} />
					</main>
				</AuthProvider>
			</SWRConfig>
		</>
	);
}
