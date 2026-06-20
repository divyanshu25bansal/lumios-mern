import { Link } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Onboarding() {
  return (
    <div className="relative scrollbar-gutter-stable min-h-screen bg-base-200 text-base-content transition-colors duration-200">
      <Header />

      {/* Hero Container Section */}
      <main className="relative flex flex-col items-center justify-center px-4 sm:pt-8 pt-20 pb-28 text-center overflow-hidden">
        {/* Semantic Theme Background Glow Elements */}
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        <img
          src="/icon.png"
          alt="Lumios"
          className="relative z-10 w-44 drop-shadow-[0_0_35px_rgba(var(--p),0.3)] sm:w-56 object-contain"
        />

        <h2 className="relative z-10 sm:mt-8 mt-10 max-w-5xl text-5xl font-extrabold leading-tight md:text-7xl tracking-tight">
          Understand yourself{" "}
          <span className="bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent">
            better every day
          </span>
        </h2>

        <p className="relative z-10 sm:mt-6 mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-base-content/80 font-medium">
          Your AI-powered wellness companion helping you build healthier habits,
          understand your body, and stay consistent every day.
        </p>

        <div className="relative z-10 mt-16 sm:mt-10 flex flex-col gap-4 sm:flex-row w-full sm:w-auto px-4">
          <Link
            className="btn btn-primary btn-lg rounded-2xl px-10 shadow-lg shadow-primary/20 text-primary-content border-none"
            to="/signup"
          >
            Get Started Free
          </Link>

          <Link
            className="btn btn-outline btn-lg rounded-2xl border-base-300 hover:bg-base-300 text-base-content"
            to="/login"
          >
            I already have an account
          </Link>
        </div>
      </main>

      {/* Feature Split Showcases */}
      <section className="pb-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6">
          {/* Feature 1 */}
          <div className="grid items-center gap-12 rounded-4xl border border-base-300 bg-base-100 p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 md:grid-cols-2">
            <img
              src="https://picsum.photos/800/500?random=1"
              alt="Dashboard visualization"
              className="rounded-3xl shadow-xl shadow-base-300/30 w-full object-cover"
            />

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Feature 01
              </p>

              <h3 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                Meet your personal{" "}
                <span className="text-primary">health companion</span>
              </h3>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-base-content/70">
                Track hydration, sleep, nutrition, habits, and wellness metrics
                from one beautiful dashboard built to help you stay consistent.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid items-center gap-12 rounded-4xl border border-base-300 bg-base-100 p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Feature 02
              </p>

              <h3 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                AI Powered <span className="text-secondary">Insights</span>
              </h3>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-base-content/70">
                Receive personalized recommendations generated from your daily
                health patterns, habits, and wellness activities.
              </p>
            </div>

            <img
              src="https://picsum.photos/800/500?random=2"
              alt="AI analytics view"
              className="rounded-3xl shadow-xl shadow-base-300/30 w-full object-cover order-1 md:order-2"
            />
          </div>

          {/* Feature 3 */}
          <div className="grid items-center gap-12 rounded-4xl border border-base-300 bg-base-100 p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 md:grid-cols-2">
            <img
              src="https://picsum.photos/800/500?random=3"
              alt="Habit tracking module"
              className="rounded-3xl shadow-xl shadow-base-300/30 w-full object-cover"
            />

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Feature 03
              </p>

              <h3 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                Build Better <span className="text-primary">Habits</span>
              </h3>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-base-content/70">
                Create routines, track progress, stay accountable, and celebrate
                milestones with smart reminders and achievements.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid items-center gap-12 rounded-4xl border border-base-300 bg-base-100 p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Feature 04
              </p>

              <h3 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                Understand Yourself{" "}
                <span className="text-secondary">Better</span>
              </h3>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-base-content/70 mb-6">
                Discover trends in your energy, sleep, mood, and lifestyle to
                make smarter decisions and improve your well-being.
              </p>

              <Link
                className="btn btn-primary rounded-2xl px-8 border-none text-primary-content shadow-md shadow-primary/10"
                to="/signup"
              >
                Create Account
              </Link>
            </div>

            <img
              src="https://picsum.photos/800/500?random=4"
              alt="Data trends graph"
              className="rounded-3xl shadow-xl shadow-base-300/30 w-full object-cover order-1 md:order-2"
            />
          </div>
        </div>
      </section>

      {/* Conversion Bottom CTA Section */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-base-300 bg-base-100 p-8 sm:p-16 text-center shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary/5 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight relative z-10">
            Start building a healthier life today
          </h2>

          <p className="mt-4 text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Join Lumios and unlock personalized wellness insights, habit
            tracking, AI-powered recommendations, and much more.
          </p>

          <Link
            to="/signup"
            className="btn btn-primary btn-lg mt-8 rounded-2xl px-10 border-none text-primary-content shadow-lg shadow-primary/10 relative z-10"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
