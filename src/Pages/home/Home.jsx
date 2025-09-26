// import { BackgroundBeams } from "@/Components/ui/background-beams";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>

      {/* <BackgroundBeams /> */}
    </>
  );
}
