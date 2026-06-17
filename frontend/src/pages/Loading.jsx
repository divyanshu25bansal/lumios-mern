import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-linear-to-b from-[#05031A] via-[#271783] to-[#41057ea7]">
      {/* Background Glow */}
      <motion.div
        className="absolute w-175 h-175 rounded-full bg-violet-500/20 blur-[140px]"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary Glow */}
      <motion.div
        className="absolute w-125 h-125 rounded-full bg-blue-500/20 blur-[120px]"
        animate={{
          scale: [1.1, 1.4, 1.1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Artwork */}
      <motion.div
        animate={{
          filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.img
          src="/lumios_loader.png"
          alt="Lumios"
          className="relative z-20 w-137.5 md:w-187.5 select-none"
          draggable={false}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-violet-300"
          style={{
            left: `${20 + i * 8}%`,
            top: `${40 + (i % 3) * 10}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Brand Text */}
      <div className="absolute bottom-24 text-center">
        <motion.h1
          className="text-5xl font-bold text-white"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Lumios
        </motion.h1>

        <motion.p
          className="mt-3 text-violet-200 text-lg"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Preparing your wellness journey...
        </motion.p>

        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-3 h-3 rounded-full bg-violet-400"
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
