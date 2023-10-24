import { useRouter } from "next/router";
import Layout from "../Layout/AllLayout";

export default function CustomErrorCentered({ code = 500, message = "" }) {
	const textGradient = code < 500 ? "from-[#8D72E1] to-[#8D72E1]" : "from-[#6C4AB6] to-[#8D9EFF]";
	const errorMessage = message ? message : code === 404 ? <>The requested URL was not found</> : code === 500 ? "Something went wrong on our end. Sorry :(" : null;

	return (
		<Layout>
			<div className="w-full h-full flex flex-col space-y-5 justify-center items-center">
				<h1 className="text-center text-7xl sm:text-9xl font-extrabold pb-5">
					<span className={`text-transparent bg-clip-text bg-gradient-to-br ${textGradient}`}>{code}!</span>
				</h1>

				<p className="font-light text-2xl">{errorMessage}</p>
			</div>
		</Layout>
	);
}
