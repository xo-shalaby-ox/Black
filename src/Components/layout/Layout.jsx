import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Link to="/" className="cursor-pointer">
        home
      </Link>

      <Outlet />
    </>
  );
}
