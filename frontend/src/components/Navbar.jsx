import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  SignInButton,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div
      className="fixed z-5 w-full backdrop-blur-2xl flex justify-between 
    items-center py-2 px-4 sm:px-20 xl:px-32 "
    >
      <div className="h-16 flex items-center">
        <img
          src={assets.logo}
          alt="logo"
          className='w-40 sm:w-50 cursor-pointer'
          onClick={() => navigate("/")}
        />
      </div>
      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full 
        text-sm cursor-pointer bg-primary text-white px-4 py-2 sm:px-10 sm:py-2.5"
        >
          Get started
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
