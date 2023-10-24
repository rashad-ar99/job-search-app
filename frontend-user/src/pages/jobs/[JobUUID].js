import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import Layout from "@/components/Layout/AllLayout";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React from "react";
import useSWR, { mutate, useSWRConfig } from "swr";
import cookie from "cookie";

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

export default function Job() {
	const router = useRouter();
	const { fetcher } = useSWRConfig();

	const { JobUUID } = router.query;

	const { data: JobData, error: JobError } = useSWR(`/api/v1/private/User/Job/${JobUUID}`, fetcher);

	const handleApply = async () => {
		if (JobData.data.Job.UserJobs.length > 0) return;

		await fetch("/api/v1/private/User/UserJob/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ JobUUID }),
		})
			.then(async (response) => {
				if (!response.ok) throw new Error(await response.text());

				router.push("/");

				mutate("/api/v1/private/User/Job");
			})
			.catch((error) => {
				const errorObject = JSON.parse(error.message);

				console.log(errorObject);
			});
	};

	if (JobError) return <CustomErrorCentered code={JobError.status} message={JobError.info.message} />;

	return (
		<Layout>
			{JobData ? (
				<div className="">
					<div className="flex items-center space-x-6">
						<div className="">
							<div className="font-medium text-3xl">{JobData.data.Job.Name}</div>
							<div className="font-light text-stone-700 text-2xl">
								<span className="font-semibold">Company:</span> {JobData.data.Job.CompanyName}
							</div>
							<div className="font-light text-xl mt-2 flex flex-col">
								<span className="font-semibold">Job Description: </span>
								<span>{JobData.data.Job.Description}</span>
							</div>
						</div>
					</div>
					<div className="mt-4">
						<div className="flex w-full justify-between items-center space-y-3">
							<div className="text-2xl">${JobData.data.Job.Salary}/year</div>
							<div className="text-center rounded-md bg-[#82c4fa] hover:bg-[#82c4fa]/80 px-4 py-1 font-light items-center">
								<div className="text-center flex py-1 px-4 justify-center" onClick={handleApply}>
									<span>{JobData.data.Job.UserJobs.length > 0 ? "Application sent" : "Apply"}</span>
									{JobData.data.Job.UserJobs.length === 0 && <ChevronRightIcon width={15} />}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<LoadingCentered />
			)}
		</Layout>
	);
}
