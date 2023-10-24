import Head from "next/head";
import Layout from "../components/Layout/AllLayout";
import CustomErrorCentered from "../components/Errors/CustomErrorCentered";

export default function PageNotFound() {
	return (
		<>
			<Head>
				<title>404 - ShopStop</title>
				<meta name="description" content="404 - ShopStop" />
			</Head>

			<CustomErrorCentered code={404} />
		</>
	);
}
