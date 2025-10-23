import { ReactNode, useEffect } from "react";
import { clearUser, setUser } from "../store/auth/actions";
import { isAccess } from "../store/auth/hooks";
import { useCheckAuthSessionQuery } from "../services/hooks/queries/auth.query";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError } = useCheckAuthSessionQuery({
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
