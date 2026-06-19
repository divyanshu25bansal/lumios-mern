import { Link } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Onboarding() {
  return (
    <div className="relative scrollbar-gutter-stable min-h-screen bg-linear-to-b from-[#0d0a33] via-[#6d28d9] to-[#0d0a33] text-white">
      <Header />

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center px-4 pt-12 pb-24 text-center">
        {/* Background Glow */}
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <img
          src="/icon.png"
          alt="Lumios"
          className="relative z-10 w-44 drop-shadow-[0_0_40px_rgba(168,85,247,0.6)] sm:w-56"
        />

        <h2 className="relative z-10 mt-8 max-w-5xl text-5xl font-extrabold leading-tight md:text-7xl">
          Understand yourself
          <span className="bg-linear-to-b from-violet-300 to-pink-300 bg-clip-text text-transparent">
            {" "}
            better every day
          </span>
        </h2>

        <p className="relative z-10 mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
          Your AI-powered wellness companion helping you build healthier habits,
          understand your body, and stay consistent every day.
        </p>

        <div className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            className="btn btn-primary btn-lg rounded-2xl px-10 shadow-xl shadow-violet-500/30"
            to="/signup"
          >
            Get Started Free
          </Link>

          <Link
            className="btn btn-outline btn-lg rounded-2xl border-white/20 text-white hover:bg-white/10"
            to="/login"
          >
            I already have an account
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="pb-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6">
          {/* Feature 1 */}
          <div className="grid items-center gap-12 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 md:grid-cols-2">
            <img
              src="https://picsum.photos/800/500?random=1"
              alt=""
              className="rounded-3xl shadow-2xl shadow-black/30"
            />

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
                Feature 01
              </p>

              <h3 className="text-4xl font-bold leading-tight">
                Meet your personal
                <span className="text-violet-300">
                  {" "}
                  health companion
                </span>
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Track hydration, sleep, nutrition, habits, and wellness metrics
                from one beautiful dashboard built to help you stay consistent.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid items-center gap-12 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
                Feature 02
              </p>

              <h3 className="text-4xl font-bold leading-tight">
                AI Powered
                <span className="text-pink-300"> Insights</span>
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Receive personalized recommendations generated from your daily
                health patterns, habits, and wellness activities.
              </p>
            </div>

            <img
              src="https://picsum.photos/800/500?random=2"
              alt=""
              className="rounded-3xl shadow-2xl shadow-black/30"
            />
          </div>

          {/* Feature 3 */}
          <div className="grid items-center gap-12 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 md:grid-cols-2">
            <img
              src="https://picsum.photos/800/500?random=3"
              alt=""
              className="rounded-3xl shadow-2xl shadow-black/30"
            />

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
                Feature 03
              </p>

              <h3 className="text-4xl font-bold leading-tight">
                Build Better
                <span className="text-violet-300"> Habits</span>
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Create routines, track progress, stay accountable, and celebrate
                milestones with smart reminders and achievements.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid items-center gap-12 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
                Feature 04
              </p>

              <h3 className="text-4xl font-bold leading-tight">
                Understand Yourself
                <span className="text-pink-300"> Better</span>
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Discover trends in your energy, sleep, mood, and lifestyle to
                make smarter decisions and improve your well-being.
              </p>

              <Link
                className="btn btn-primary mt-8 rounded-2xl px-8"
                to="/signup"
              >
                Create Account
              </Link>
            </div>

            <img
              src="https://picsum.photos/800/500?random=4"
              alt=""
              className="rounded-3xl shadow-2xl shadow-black/30"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
          <h2 className="text-4xl font-bold md:text-5xl">
            Start building a healthier life today
          </h2>

          <p className="mt-4 text-lg text-white/70">
            Join Lumios and unlock personalized wellness insights, habit
            tracking, AI-powered recommendations, and much more.
          </p>

          <Link
            to="/signup"
            className="btn btn-primary btn-lg mt-8 rounded-2xl px-10"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}