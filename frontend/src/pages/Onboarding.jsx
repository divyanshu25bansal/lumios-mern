import { Link } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0d0a33] via-[#8332b1] to-[#0d0a33] text-white">
      <Header />
      {/* Navbar */}

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 mt-6">
        <img src="/icon.png" alt="Lumios" className="w-60 sm:w-72 mb-8" />

        <h2 className="text-4xl md:text-6xl font-bold max-w-3xl">
          Understand yourself better every day
        </h2>

        <p className="mt-6 max-w-xl text-lg opacity-80">
          Your personal health companion for a healthier, happier, and more
          balanced life.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link className="btn btn-primary rounded-full px-8" to={"/signup"}>
            Get Started
          </Link>

          <Link className="btn btn-ghost text-white rounded-full" to={"/login"}>
            I already have an account
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-32">
          {/* Card 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="https://picsum.photos/800/500?random=1"
              alt="Feature"
              className="rounded-3xl shadow-2xl w-full"
            />

            <h3 className="text-4xl font-bold mb-4">
              Meet your personal health companion.
            </h3>
          </div>

          {/* Card 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-4">AI Powered Insights</h3>

              <p className="text-l leading-relaxed">
                Get personalized recommendations and actionable insights
                generated from your daily habits and health patterns.
              </p>
            </div>

            <img
              src="https://picsum.photos/800/500?random=2"
              alt="Feature"
              className="rounded-3xl shadow-2xl w-full"
            />
          </div>

          {/* Card 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="https://picsum.photos/800/500?random=3"
              alt="Feature"
              className="rounded-3xl shadow-2xl w-full"
            />

            <div>
              <h3 className="text-4xl font-bold mb-4">Build Better Habits</h3>

              <p className="text-lg  leading-relaxed">
                Create routines, track progress, and stay motivated with smart
                reminders and goal-based achievements.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-4">
                Understand Yourself Better
              </h3>

              <p className="text-lg  leading-relaxed">
                Discover trends in your mood, energy, and lifestyle to make
                informed decisions and improve your overall well-being.
              </p>

              <Link
                className="btn btn-primary mt-8 rounded-full px-8"
                to={"/signup"}
              >
                Create Account
              </Link>
            </div>

            <img
              src="https://picsum.photos/800/500?random=4"
              alt="Feature"
              className="rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
