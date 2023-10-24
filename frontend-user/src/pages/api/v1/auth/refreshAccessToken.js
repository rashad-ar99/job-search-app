import cookie from "cookie";

export default async function refreshAccessToken(req, res) {
	const cookies = cookie.parse(req.headers.cookie || "");
	const { JWTRefreshToken } = cookies;

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

			res.status(200).json({
				status: "success",
				message: null,
			});
		})
		.catch((error) => {
			res.setHeader("Set-Cookie", [
				cookie.serialize("JWTAccessToken", "", {
					maxAge: -1,
					path: "/",
				}),
				cookie.serialize("JWTAccessTokenExpiresAt", "", {
					maxAge: -1,
					path: "/",
				}),
				cookie.serialize("JWTRefreshTokenExpiresAt", "", {
					maxAge: -1,
					path: "/",
				}),
				cookie.serialize("JWTRefreshToken", "", {
					maxAge: -1,
					path: "/",
				}),
			]);
			console.error("jwtRefresh error", error);

			res.status(500).json({
				code: 500,
				status: "error",
				message: error,
			});
		});
}
