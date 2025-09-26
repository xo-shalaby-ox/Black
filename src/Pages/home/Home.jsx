// import { BackgroundBeams } from "@/Components/ui/background-beams";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center z-40 bg-transparent text-white gap-4">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <h1 className="text-3xl font-bold text-red-400">
          Welcome Alaa i love you ^_^
        </h1>
      </div>
      {/* <BackgroundBeams /> */}
    </>
  );
}
