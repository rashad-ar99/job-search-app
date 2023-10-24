import cookie from "cookie";

export default async function Login(req, res) {
	const { Email, Password } = req.body;

	await fetch(`${process.env.API_URL}/v1/User/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ Email, Password }),
	})
		.then(async (response) => {
			try {
				const responsejson = await response.json();

				if (!response.ok) {
					res.status(responsejson.code).json({
						code: responsejson.code,
						status: responsejson.status,
						message: responsejson.message,
					});
				} else {
					const { JWTAccessToken, JWTAccessTokenExpiresAt, JWTRefreshToken, JWTRefreshTokenExpiresAt } = responsejson.data;

					res.setHeader("Set-Cookie", [
						cookie.serialize("JWTAccessToken", JWTAccessToken, {
							httpOnly: true,
							secure: true,
							maxAge: (new Date(JWTAccessTokenExpiresAt) - new Date()) / 1000,
							sameSite: "strict",
							path: "/",
						}),
						cookie.serialize("JWTAccessTokenExpiresAt", JWTAccessTokenExpiresAt, {
							secure: true,
							maxAge: (new Date(JWTAccessTokenExpiresAt) - new Date()) / 1000,
							sameSite: "strict",
							path: "/",
						}),
						cookie.serialize("JWTRefreshToken", JWTRefreshToken, {
							httpOnly: true,
							secure: true,
							maxAge: (new Date(JWTRefreshTokenExpiresAt) - new Date()) / 1000,
							sameSite: "strict",
							path: "/",
						}),
						cookie.serialize("JWTRefreshTokenExpiresAt", JWTRefreshTokenExpiresAt, {
							secure: true,
							maxAge: (new Date(JWTRefreshTokenExpiresAt) - new Date()) / 1000,
							sameSite: "strict",
							path: "/",
						}),
					]);

					res.status(200).json({
						status: "success",
						data: responsejson.data.User,
					});
				}
			} catch (error) {
				throw new Error(error);
			}
		})
		.catch((error) => {
			res.status(500).json({
				code: 500,
				status: "error",
				message: error,
			});
		});
}
