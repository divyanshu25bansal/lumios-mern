import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu } from "lucide-react";

export default function Header() {
  const [showNavButtons, setShowNavButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavButtons(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-transparent backdrop-blur-xl">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/icon.png"
            alt="Lumios"
            className="w-11 transition duration-300 group-hover:scale-105"
          />

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Lumios
            </h2>

            <p className="hidden text-xs text-white/50 sm:block">
              AI Wellness Companion
            </p>
          </div>
        </Link>

        {/* Center Nav */}
        <div className="hidden flex-1 justify-center lg:flex">
          <ul className="menu menu-horizontal gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl">
            <li>
              <a className="rounded-full text-white/70 hover:bg-white/10 hover:text-white">
                Features
              </a>
            </li>

            <li>
              <a className="rounded-full text-white/70 hover:bg-white/10 hover:text-white">
                AI Insights
              </a>
            </li>

            <li>
              <a className="rounded-full text-white/70 hover:bg-white/10 hover:text-white">
                Pricing
              </a>
            </li>

            <li>
              <a className="rounded-full text-white/70 hover:bg-white/10 hover:text-white">
                About
              </a>
            </li>
          </ul>
        </div>

        {/* Right Buttons */}
        <div
          className={`hidden sm:flex items-center gap-3 transition-all duration-500 ${
            showNavButtons
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <Link
            to="/login"
            className="btn btn-sm rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            Log In
          </Link>

          <Link
            to="/signup"
            className="btn btn-sm rounded-xl border-0 bg-linear-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
          >
            Create Account
          </Link>
        </div>

        {/* Mobile Menu */}
        {/* <div className="ml-auto lg:hidden">
          <button className="btn btn-circle btn-ghost text-white">
            <Menu size={22} />
          </button>
        </div> */}
      </div>
    </header>
  );
}
