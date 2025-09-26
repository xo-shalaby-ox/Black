// import { BackgroundBeams } from "@/Components/ui/background-beams";
import React from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <>
      <NavLink
        to="login"
        onClick={() => {
          console.log("Clicked");
        }}
      >
        login
      </NavLink>
      <NavLink
        to="signup"
        onClick={() => {
          console.log("Clicked");
        }}
      >
        Signup
      </NavLink>
      <h1>Home Page</h1>
      {/* <BackgroundBeams /> */}
    </>
  );
}
