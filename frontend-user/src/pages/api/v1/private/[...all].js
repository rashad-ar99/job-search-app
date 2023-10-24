import httpProxyMiddleware from "next-http-proxy-middleware";
import cookie from "cookie";

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};

export default async function Private(req, res) {
	const cookies = cookie.parse(req.headers.cookie || "");
	let { JWTAccessToken, JWTRefreshToken } = cookies;

	if (!JWTAccessToken && JWTRefreshToken) {
		await fetch(`${process.env.API_URL}/v1/User/auth/refreshAccessToken`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ JWTRefreshToken }),
		})
			.then(async (response) => {
				const isJson = response.headers.get("content-type")?.includes("application/json");
				const data = isJson ? await response.json() : null;

				if (!response.ok) {
					const error = (data && data.message) || response.status;
					return Promise.reject(error);
				}

				res.setHeader("Set-Cookie", [
					cookie.serialize("JWTAccessToken", data.data.JWTAccessToken, {
						httpOnly: true,
						secure: true,
						maxAge: (new Date(data.data.JWTAccessTokenExpiresAt) - new Date()) / 1000,
						sameSite: "strict",
						path: "/",
					}),
					cookie.serialize("JWTAccessTokenExpiresAt", data.data.JWTAccessTokenExpiresAt, {
						secure: true,
						maxAge: (new Date(data.data.JWTAccessTokenExpiresAt) - new Date()) / 1000,
						sameSite: "strict",
						path: "/",
					}),
					cookie.serialize("JWTRefreshToken", data.data.JWTRefreshToken, {
						httpOnly: true,
						secure: true,
						maxAge: (new Date(data.data.JWTRefreshTokenExpiresAt) - new Date()) / 1000,
						sameSite: "strict",
						path: "/",
					}),
					cookie.serialize("JWTRefreshTokenExpiresAt", data.data.JWTRefreshTokenExpiresAt, {
						secure: true,
						maxAge: (new Date(data.data.JWTRefreshTokenExpiresAt) - new Date()) / 1000,
						sameSite: "strict",
						path: "/",
					}),
				]);

				JWTAccessToken = data.data.JWTAccessToken;
			})
			.catch((jwtError) => {
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
					cookie.serialize("JWTRefreshing", "", {
						maxAge: -1,
						path: "/",
					}),
				]);
				console.log("jwtError", jwtError);
			});
	}

	httpProxyMiddleware(req, res, {
		target: process.env.API_URL,
		pathRewrite: [
			{
				patternStr: "^/api/v1/private",
				replaceStr: "/v1",
			},
		],
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${JWTAccessToken}`,
		},
	});
}
