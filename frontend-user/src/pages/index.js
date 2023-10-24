import Head from "next/head";
import Layout from "@/components/Layout/AllLayout";
import cookie from "cookie";
import useSWR, { useSWRConfig } from "swr";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import Link from "next/link";
import JobItem from "@/components/Jobs/JobItem";

export async function getServerSideProps({ req, resolvedUrl }) {
	const from = resolvedUrl.substring(1);

	const cookies = cookie.parse(req.headers.cookie || "");
	if (!cookies.JWTRefreshTokenExpiresAt || !cookies.JWTRefreshToken)
		return {
			redirect: {
				permanent: false,
				destination: "/auth/logout?" + new URLSearchParams({ reLogin: true, ...(Boolean(from) && { from }) }),
			},
		};
	return { props: {} };
}

export default function Home() {
	const { fetcher } = useSWRConfig();

	const { data: JobData, error: JobError } = useSWR("/api/v1/private/User/Job", fetcher);

	if (JobError) return <CustomErrorCentered code={JobError.status} message={JobError.info.message} />;

	return (
		<>
			<Head>
				<title>JobSearch</title>
				<meta name="description" content="Job Search website" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon-32x32.png" />
			</Head>
			<Layout>
				<div className="flex flex-col sm:flex-row justify-between">
					<h1 className="text-3xl font-light m-3">Explore jobs!</h1>
				</div>
				{!JobData ? (
					<LoadingCentered />
				) : (
					<div className="grid grid-cols-1 sm:flex sm:flex-col">
						{JobData.data.Jobs.map((job) => (
							<JobItem key={job.UUID} job={job} />
						))}
					</div>
				)}
			</Layout>
		</>
	);
}
