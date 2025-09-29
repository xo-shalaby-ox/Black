import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Link to="/" className="relative cursor-pointer z-40">
        home
      </Link>

      <Outlet />
    </>
  );
}
