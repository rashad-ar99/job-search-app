import { createContext, useContext, useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
	const { fetcher } = useSWRConfig();
	const [User, setUser] = useState();

	const { data: UserData, error: UserError } = useSWR("/api/v1/private/User", fetcher);

	useEffect(() => {
		if (!UserError && UserData && UserData.status === "success") {
			setUser(UserData.data.User);
		} else {
			setUser();
		}
	}, [UserData, UserError]);

	return <AuthContext.Provider value={{ User }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	return useContext(AuthContext);
}
