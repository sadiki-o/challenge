import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, ReactElement, useContext, useEffect } from "react";
import { getProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { ETLContext } from "../context/context";

interface PrivateRouteProps {
  children: ReactElement;
}

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ children }) => {
  const { setAuth } = useContext(ETLContext)!;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getProfile,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      setAuth(data);
    } else if (isError) {
      navigate("signin"); // redirect to signin if user is not logged in
    }
  }, [data, isError, isLoading, setAuth]);

  if (isLoading) return <Loader />;

  return data && children;
};

export default PrivateRoute;
