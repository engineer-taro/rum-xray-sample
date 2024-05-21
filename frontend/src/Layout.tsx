import { Outlet } from "react-router-dom";
import PageLink from "./components/PageLink";

const Layout = () => {
  return (
    <>
      <PageLink />
      <Outlet />
    </>
  );
};

export default Layout;
