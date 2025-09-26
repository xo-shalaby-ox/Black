import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <ul className="relative flex justify-center items-center gap-4 p-4 z-40">
        <Link to="/" className="cursor-pointer">
          home
        </Link>
        <li className="cursor-pointer">about</li>
        <li>brands</li>
        <li>contacts</li>
      </ul>
      <Outlet />
    </>
  );
}
