import httpProxyMiddleware from "next-http-proxy-middleware";

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};

export default function Public(req, res) {
	httpProxyMiddleware(req, res, {
		target: process.env.API_URL,
		pathRewrite: [
			{
				patternStr: "^/api/v1/public",
				replaceStr: "/v1",
			},
		],
		headers: {
			Accept: "application/json",
		},
	});
}
