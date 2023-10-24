import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

export default function JobItem({ userJob }) {
	return (
		<Link href={`jobs/${userJob.Job.UUID}`}>
			<div className="mt-4 bg-[#8D9EFF] rounded-lg p-5 flex flex-col sm:flex-row  justify-between space-y-4">
				<div className="flex items-center space-x-6">
					<div className="">
						<div className="font-medium text-xl">{userJob.Job.Name}</div>
						<div className="font-light text-stone-700">{userJob.Job.CompanyName}</div>
						<div className="font-light text-stone-700">
							<span>Applied on: </span>
							<span className="font-semibold">{new Date(userJob.CreatedAt).toLocaleString()}</span>
						</div>
						<div className="font-light mt-2">{userJob.Job.Description}</div>
					</div>
				</div>
				<div className="flex sm:justify-between sm:w-44">
					<div className="flex flex-col items-start sm:items-end space-y-1 sm:space-y-2 w-full">
						<div className="text-2xl">${userJob.Job.Salary}/year</div>
						<div className="text-center rounded-md bg-[#B9E0FF] hover:bg-[#B9E0FF]/80 px-4 py-1 font-light items-center">
							<div className="col-span-8 text-center flex items-center">
								<span>See more</span>
								<ChevronRightIcon width={15} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
