import React from "react";
import Layout from "@/components/Layout/Layout";
import cookie from "cookie";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { LockClosedIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { mutate } from "swr";
import { useAuthContext } from "../../../contexts/Auth";

export async function getServerSideProps({ req, query }) {
	const { from = "" } = query;

	const cookies = cookie.parse(req.headers.cookie || "");
	if (cookies.JWTRefreshToken)
		return {
			redirect: {
				permanent: false,
				destination: `/${from}`,
			},
		};
	else return { props: { from } };
}

export default function Login({ from }) {
	const router = useRouter();

	const { setUser } = useAuthContext();

	const handleSubmit = async (values, { setSubmitting, setFieldError, setFieldValue }) => {
		setFieldValue("SubmissionError", "");
		setFieldValue("SubmissionDisabled", true);

		await fetch("/api/v1/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Email: values.Email, Password: values.Password }),
		})
			.then(async (response) => {
				if (!response.ok) throw new Error(await response.text());

				mutate("/api/v1/private/User");

				router.push(`/${from}`);
			})
			.catch((error) => {
				const errorObject = JSON.parse(error.message);

				setFieldValue("SubmissionError", errorObject.code + ": " + errorObject.message);

				setFieldValue("SubmissionDisabled", false);
			});

		setSubmitting(false);
	};

	return (
		<>
			<Head>
				<title>Login - JobSearch</title>
				<meta name="description" content="Login - JobSearch" />
			</Head>
			<Layout>
				<div className="min-h-full flex items-center justify-center">
					<div className="w-full max-w-xl">
						<div>
							<h1 className="text-center text-4xl font-semibold text-[#6C4AB6]">Sign in</h1>
							<div className="mt-3 text-center text-sm text-stone-600">
								Or{" "}
								<Link href="/auth/register">
									<div className="font-medium text-[#6C4AB6] hover:text-[#6C4AB6]/80 underline underline-offset-2">create account</div>
								</Link>
							</div>
						</div>

						<Formik
							initialValues={{ Email: "asd@asd.com", Password: "qweqweqwe" }}
							validationSchema={Yup.object({
								Email: Yup.string().email("Email not valid"),
								Password: Yup.string(),
							})}
							onSubmit={handleSubmit}
						>
							{({ isSubmitting, values }) => (
								<Form className="mt-6 px-6 sm:px-24 py-6 sm:py-16 -mx-6 rounded-3xl bg-[#8D72E1]/70">
									<div className="relative group">
										<Field
											disabled={isSubmitting}
											id="Email"
											name="Email"
											type="email"
											autoComplete="email"
											required
											placeholder="Email address"
											className="peer appearance-none relative block w-full pt-6 pb-1 border-b border-stone-300 focus:border-[#6C4AB6] bg-transparent text-lg placeholder-transparent disabled:text-stone-400 focus:outline-none"
										/>
										<label
											htmlFor="Email"
											className="pointer-events-none peer-focus:font-medium absolute duration-150 transform top-4 origin-left text-stone-500 peer-focus:text-[#6C4AB6] text-sm peer-placeholder-shown:text-lg peer-focus:text-sm -translate-y-4 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4"
										>
											Email address
										</label>
										<ErrorMessage name="Email" component="div" className="mt-2 text-red-500 font-medium text-sm" />
									</div>

									<div className="mt-4 relative group">
										<Field
											disabled={isSubmitting}
											id="Password"
											name="Password"
											type="password"
											autoComplete="current-password"
											required
											placeholder="Password"
											className="peer appearance-none relative block w-full pt-6 pb-1 border-b border-stone-300 focus:border-[#6C4AB6] bg-transparent text-lg placeholder-transparent disabled:text-stone-400 focus:outline-none"
										/>
										<label
											htmlFor="Password"
											className="pointer-events-none peer-focus:font-medium absolute duration-150 transform top-4 origin-left text-stone-500 peer-focus:text-[#6C4AB6] text-sm peer-placeholder-shown:text-lg peer-focus:text-sm -translate-y-4 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4"
										>
											Password
										</label>
										<ErrorMessage name="Password" component="div" className="mt-2 text-red-500 font-medium text-sm" />
									</div>

									{values.SubmissionError && <div className="mt-2 text-red-700 font-medium text-md">{values.SubmissionError}</div>}

									<button
										disabled={values.SubmissionDisabled || isSubmitting}
										type="submit"
										className="mt-8 group relative w-full flex justify-center py-2 px-6 rounded-full text-lg text-white disabled:text-stone-400 bg-[#6C4AB6] hover:bg-[#6C4AB6]/80 disabled:bg-stone-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
									>
										<span className="absolute left-6 inset-y-0 flex items-center">
											<LockClosedIcon className="h-5 w-5 text-[#6C4AB6] group-hover:text-[#6C4AB6]" aria-hidden="true" />
										</span>
										{values.SubmissionDisabled || isSubmitting ? <ArrowPathIcon className="h-5 w-5 text-stone-400 animate-spin" aria-hidden="true" /> : "Sign in"}
									</button>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</Layout>
		</>
	);
}
