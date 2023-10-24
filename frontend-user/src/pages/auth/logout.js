import Layout from "../../components/Layout/AllLayout";
import LoadingCentered from "../../components/Loading/LoadingCentered";
import cookie from "cookie";

export async function getServerSideProps({ req, res, query }) {
	const cookies = cookie.parse(req.headers.cookie || "");
	const { JWTAccessToken, JWTAccessTokenExpiresAt, JWTRefreshToken, JWTRefreshTokenExpiresAt } = cookies;

	if (JWTAccessToken || JWTAccessTokenExpiresAt || JWTRefreshToken || JWTRefreshTokenExpiresAt) {
		res.setHeader("Set-Cookie", [
			cookie.serialize("JWTAccessToken", "", {
				maxAge: -1,
				path: "/",
			}),
			cookie.serialize("JWTAccessTokenExpiresAt", "", {
				maxAge: -1,
				path: "/",
			}),
			cookie.serialize("JWTRefreshToken", "", {
				maxAge: -1,
				path: "/",
			}),
			cookie.serialize("JWTRefreshTokenExpiresAt", "", {
				maxAge: -1,
				path: "/",
			}),
		]);

		fetch(`${process.env.APP_URL}/api/v1/private/User/auth/logout`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ JWTRefreshToken }),
		});
	}

	const { from = "", reLogin } = query;
	return {
		redirect: {
			permanent: false,
			destination: reLogin ? `/auth/login${from ? `?${new URLSearchParams({ from })}` : ""}` : "/" + from,
		},
	};
}

export default function Logout() {
	return <LoadingCentered />;
}

Logout.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
