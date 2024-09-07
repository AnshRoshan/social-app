import { zodResolver } from "@hookform/resolvers/zod";
import { type Control, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type * as z from "zod";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { SigninValidation } from "@/lib/validation";

interface FormFieldComponentProps {
	control: Control<z.infer<typeof SigninValidation>>;
	name: "email" | "password";
	label: string;
	type: string;
}

const FormFieldComponent = ({
	control,
	name,
	label,
	type,
}: FormFieldComponentProps) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel>{label}</FormLabel>
				<FormControl>
					<Input type={type} className="shad-input rounded-[4px]" {...field} />
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

const SigninForm = () => {
	const { toast } = useToast();
	const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
	const navigate = useNavigate();

	// Query
	const { mutateAsync: signInAccount, isPending } = useSignInAccount();

	const form = useForm<z.infer<typeof SigninValidation>>({
		resolver: zodResolver(SigninValidation),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
		try {
			const session = await signInAccount(user);

			if (!session) {
				toast({ title: "Sign in failed. Please try again." });
				return;
			}

			const isLoggedIn = await checkAuthUser();

			if (isLoggedIn) {
				form.reset();
				navigate("/");
			} else {
				toast({ title: "Sign up failed. Please try again." });
			}
		} catch (error) {
			toast({ title: "An error occurred. Please try again." });
		}
	};

	return (
		<Form {...form}>
			<div className="flex-center flex-col md:w-1/2">
				<img src="/assets/images/logo.svg" alt="logo" />

				<h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
					Log in to your Account
				</h2>
				<p className="small-medium md:base-regular mt-2 text-light-3">
					Welcome back! Please enter your details.
				</p>
				<form
					onSubmit={form.handleSubmit(handleSignin)}
					className="mt-4 flex w-full flex-col gap-5"
				>
					<FormFieldComponent
						control={form.control}
						name="email"
						label="Email"
						type="email"
					/>
					<FormFieldComponent
						control={form.control}
						name="password"
						label="Password"
						type="password"
					/>

					<Button type="submit" className="shad-button_primary rounded-full">
						{isPending || isUserLoading ? (
							<div className="flex-center gap-2">
								<Loader /> Loading...
							</div>
						) : (
							"Log in"
						)}
					</Button>

					<p className="mt-2 text-center text-light-2 text-small-regular">
						Don't have an account?
						<Link
							to="/sign-up"
							className="ml-1 text-primary-500 text-small-semibold hover:text-primary-600 hover:underline hover:underline-offset-2"
						>
							Sign up
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SigninForm;
