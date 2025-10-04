import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import api from "../utils/api";
import { clearUser, setUser } from "../store/auth/actions";
import { isAccess } from "../store/auth/hooks";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["check-auth-session"],
    queryFn: () => api.get("/auth/session"),
    refetchInterval: 1000 * 60 * 60 * 3,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isAccess()
  });

  useEffect(() => {
    if (data) 
      setUser(data.data.user);
    
    if (isError)
      clearUser();

  }, [isLoading, isError, data]);

  return <>{children}</>;
};

export default AuthGuard;
