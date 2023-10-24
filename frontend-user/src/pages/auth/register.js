import React from "react";
import Layout from "@/components/Layout/Layout";
import cookie from "cookie";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { LockClosedIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

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

export default function Register({ from }) {
	const router = useRouter();

	const handleSubmit = async (values, { setSubmitting, setFieldError, setFieldValue }) => {
		setFieldValue("SubmissionError", "");
		setFieldValue("SubmissionDisabled", true);

		await fetch(`/api/v1/public/User/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Name: values.Name, Email: values.Email, Password: values.Password }),
		})
			.then(async (response) => {
				if (!response.ok) throw new Error(await response.text());

				router.push("/auth/login");
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
				<title>Register - ShopStop</title>
				<meta name="description" content="Register - ShopStop" />
			</Head>
			<Layout>
				<div className="min-h-full flex items-center justify-center">
					<div className="w-full max-w-xl">
						<div>
							<h1 className="text-center text-4xl font-semibold text-[#6C4AB6]">Create an account</h1>
							<div className="mt-3 text-center text-sm text-stone-600">
								Or{" "}
								<Link href="/auth/login">
									<div className="font-medium text-[#6C4AB6] hover:text-[#6C4AB6]/80 underline underline-offset-2">sign in</div>
								</Link>
							</div>
						</div>

						<Formik
							initialValues={{ Name: "", Email: "", Password: "", RePassword: "" }}
							validationSchema={Yup.object({
								Name: Yup.string().required("Name is required"),
								Email: Yup.string().email("Email not valid").required("Email is required"),
								Password: Yup.string().min(8, "Password must be atleast 8 characters long").required("Password is required"),
								RePassword: Yup.string().oneOf([Yup.ref("Password"), null], "Passwords must match"),
							})}
							onSubmit={handleSubmit}
						>
							{({ isSubmitting, values }) => (
								<Form className="mt-6 px-6 sm:px-24 py-6 sm:py-16 -mx-6 rounded-3xl bg-[#8D72E1]/70">
									<div className="relative group">
										<Field
											disabled={isSubmitting}
											id="Name"
											name="Name"
											type="text"
											required
											placeholder="Name"
											className="peer appearance-none relative block w-full pt-6 pb-1 border-b border-stone-300 focus:border-[#6C4AB6] bg-transparent text-lg placeholder-transparent disabled:text-stone-400 focus:outline-none"
										/>
										<label
											htmlFor="Name"
											className="pointer-events-none peer-focus:font-medium absolute duration-150 transform top-4 origin-left text-stone-500 peer-focus:text-[#6C4AB6] text-sm peer-placeholder-shown:text-lg peer-focus:text-sm -translate-y-4 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4"
										>
											Name
										</label>
										<ErrorMessage name="Name" component="div" className="mt-2 text-red-500 font-medium text-sm" />
									</div>

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

									<div className="relative group">
										<Field
											disabled={isSubmitting}
											id="Password"
											name="Password"
											type="password"
											autoComplete="current-password"
											required
											placeholder="Password"
											className="peer appearance-none relative block w-full pt-6 pb-1 border-b border-stone-300 focus:border-[#6C4AB6]  bg-transparent text-lg placeholder-transparent disabled:text-stone-400 focus:outline-none"
										/>
										<label
											htmlFor="Password"
											className="pointer-events-none peer-focus:font-medium absolute duration-150 transform top-4 origin-left text-stone-500 peer-focus:text-[#6C4AB6] text-sm peer-placeholder-shown:text-lg peer-focus:text-sm -translate-y-4 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4"
										>
											Password
										</label>
										<ErrorMessage name="Password" component="div" className="mt-2 text-red-500 font-medium text-sm" />
									</div>

									<div className="relative group">
										<Field
											disabled={isSubmitting}
											id="RePassword"
											name="RePassword"
											type="password"
											autoComplete="current-password"
											required
											placeholder="Re-enter Password"
											className="peer appearance-none relative block w-full pt-6 pb-1 border-b border-stone-300 focus:border-[#6C4AB6] bg-transparent text-lg placeholder-transparent disabled:text-stone-400 focus:outline-none"
										/>
										<label
											htmlFor="RePassword"
											className="pointer-events-none peer-focus:font-medium absolute duration-150 transform top-4 origin-left text-stone-500 peer-focus:text-[#6C4AB6] text-sm peer-placeholder-shown:text-lg peer-focus:text-sm -translate-y-4 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4"
										>
											Re-enter Password
										</label>
										<ErrorMessage name="RePassword" component="div" className="mt-2 text-red-500 font-medium text-sm" />
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
										{values.SubmissionDisabled || isSubmitting ? <ArrowPathIcon className="h-5 w-5 text-stone-400 animate-spin" aria-hidden="true" /> : "Create account"}
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
