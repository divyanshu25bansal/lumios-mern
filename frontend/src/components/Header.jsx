import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Header() {
  const [showNavButtons, setShowNavButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavButtons(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`navbar sticky top-0 z-50 bg-[#0d0a33]/80 backdrop-blur-md px-6`}
    >
      <Link to={"/"} className="flex items-center">
        <img src="/icon.png" alt="Lumios" className="w-12" />

        <h2 className="ml-2 text-3xl font-semibold flex-1">Lumios</h2>
      </Link>

      <div
        className={`flex gap-3 transition-all duration-300 ${
          showNavButtons
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          className="btn btn-sm btn-outline text-white rounded-full"
          to={"/login"}
        >
          Log In
        </Link>

        <Link className="btn btn-sm btn-primary rounded-full" to={"/signup"}>
          Create Account
        </Link>
      </div>
    </div>
  );
}
