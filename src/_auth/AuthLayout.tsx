import { useUserContext } from "@/context/AuthContext";

import { Outlet, Navigate } from "react-router-dom";

export default function AuthLayout() {
	const { isAuthenticated } = useUserContext();
	console.log(isAuthenticated, "isAuthenticated");

	return (
		<>
			{isAuthenticated ? (
				<Navigate to="/" />
			) : (
				<>
					<section className="flex flex-1 flex-col items-center justify-center py-10">
						<Outlet />
						{/* The auth layout is rendered first and according to if the user is authenticated or not the user is navigated to different urls.
          The <Outlet> component is used in parent route components to render their child route components (sign in or sign up). */}
					</section>
					<img
						src="/assets/images/side-img.svg"
						alt="logo"
						className="hidden h-screen w-1/2 bg-no-repeat object-cover xl:block"
					/>
				</>
			)}
		</>
	);
}
