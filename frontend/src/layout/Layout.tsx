import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useContext } from "react";
import { ETLContext } from "../context/context";
import { signout } from "../api/auth";
import { toast } from "react-hot-toast";

const Layout = () => {
  const { auth } = useContext(ETLContext)!;

  const handleSignout = () => {
    signout()
      .then((res) => {
        toast.success("successfuly signed out");
        setTimeout(() => {
          window.location.href = "/signin";
        }, 1500);
      })
      .catch((err) => {
        toast.error("Error occured");
      });
  };

  return (
    <div>
      <Header userEmail={auth.email} onSignOut={handleSignout} />
      {/* main */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
