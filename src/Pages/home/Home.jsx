import { BackgroundBeams } from "@/Components/ui/background-beams";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center z-40  bg-black text-white gap-4">
        list menu
        <Link to="signup">sign up</Link>
        <Link to="login">login</Link>
        <h1> Welcome Alaa i love you ^_^</h1>
      </div>
      <BackgroundBeams />
    </>
  );
}
