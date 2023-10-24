import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import UserJobItem from "@/components/UserJobs/UserJobItem";
import Layout from "@/components/Layout/AllLayout";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import React from "react";
import cookie from "cookie";
import useSWR, { useSWRConfig } from "swr";

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

function MyJobs() {
	const { fetcher } = useSWRConfig();

	const { data: UserJobData, error: UserJobError } = useSWR("/api/v1/private/User/UserJob", fetcher);

	if (UserJobError) return <CustomErrorCentered code={UserJobError.status} message={UserJobError.info.message} />;

	return (
		<Layout>
			<div className="flex flex-col sm:flex-row justify-between">
				<h1 className="text-3xl font-light m-3">My applications</h1>
			</div>
			{!UserJobData ? (
				<LoadingCentered />
			) : UserJobData.data.UserJobs.length > 0 ? (
				<div className="grid grid-cols-1 sm:flex sm:flex-col">
					{UserJobData.data.UserJobs.map((userJob) => (
						<UserJobItem key={userJob.UUID} userJob={userJob} />
					))}
				</div>
			) : (
				<div className="flex justify-center">
					<span className="font-light text-3xl">You haven&apos;t applied to any jobs yet.</span>
				</div>
			)}
		</Layout>
	);
}

export default MyJobs;
