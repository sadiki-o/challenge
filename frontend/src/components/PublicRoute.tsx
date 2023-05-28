import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, ReactElement, useEffect } from "react";
import { getProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

interface PublicRouteProps {
  children: ReactElement;
}

const PublicRoute: FunctionComponent<PublicRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getProfile,
    retry: 1
  });

  useEffect(() => {
    if (data) {
      navigate("/"); // redirect to home is user is logged in
    } else if (isError) {
      localStorage.removeItem("token");
    }
  }, [data, isError, isLoading]);

  if (isLoading) return <Loader />;

  return children;
};

export default PublicRoute;
