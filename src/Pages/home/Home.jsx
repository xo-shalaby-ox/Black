// import { BackgroundBeams } from "@/Components/ui/background-beams";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Link
        to="/login"
        onClick={() => {
          console.log("clicked signin");
        }}
      >
        Login
      </Link>
      <Link
        to="/signup"
        onClick={() => {
          console.log("clicked signup");
        }}
      >
        Signup
      </Link>

      {/* <BackgroundBeams /> */}
    </>
  );
}
