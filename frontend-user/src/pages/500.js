import Head from "next/head";
import Layout from "../components/Layout/AllLayout";
import CustomErrorCentered from "../components/Errors/CustomErrorCentered";

export default function ServerError() {
	return (
		<>
			<Head>
				<title>500 - ShopStop</title>
				<meta name="description" content="500 - ShopStop" />
			</Head>

			<CustomErrorCentered code={500} />
		</>
	);
}
