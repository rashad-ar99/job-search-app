import { CubeTransparentIcon } from "@heroicons/react/24/outline";

export default function Loading() {
	return (
		<div className="flex flex-col justify-center items-center">
			<CubeTransparentIcon className="animate-[spin_2s_linear_infinite] h-10 w-10 mb-4 text-orange-500 opacity-75" />

			<div className="text-center text-xl font-bold opacity-75">
				<span>Loading...</span>
			</div>
		</div>
	);
}
