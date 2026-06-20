import { Link } from "react-router";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <section className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative transition-colors duration-200">
      {/* Soft background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-105 h-105 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl text-center"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mb-6"
        >
          <span className="badge badge-primary badge-outline px-4 py-3.5 text-xs font-semibold uppercase tracking-wider">
            Error 404
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="text-[5rem] sm:text-[7rem] md:text-[8rem] lg:text-[9rem] font-black leading-none tracking-[-0.06em] text-primary select-none drop-shadow-xs"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-4 tracking-tight"
        >
          This page doesn’t exist.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="text-base sm:text-lg text-base-content/70 max-w-xl mx-auto leading-relaxed mb-8"
        >
          The page may have been moved, removed, or the link may be incorrect.
          Let’s get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.5 }}
        >
          <Link
            to="/profile"
            className="btn btn-primary px-8 rounded-2xl text-primary-content border-none shadow-md shadow-primary/10"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NotFound;
