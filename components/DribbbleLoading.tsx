'use client'

import { motion, AnimatePresence } from 'framer-motion'

export type DribbbleLoadingPhase = 'spinning' | 'success'

interface DribbbleLoadingProps {
  phase: DribbbleLoadingPhase
  label?: string
  sublabel?: string
}

export default function DribbbleLoading({
  phase,
  label,
  sublabel,
}: DribbbleLoadingProps) {
  return (
    <motion.div
      key="dribbble-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030637] px-6 select-none"
    >
      <div className="relative flex items-center justify-center w-28 h-28">
        <AnimatePresence mode="wait">
          {phase === 'spinning' ? (
            <motion.div
              key="spinner-ring"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="relative w-24 h-24 flex items-center justify-center"
            >
              {/* Static Muted Track Circle */}
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeWidth="6.5"
                />
              </svg>

              {/* Rotating White Rounded Arc */}
              <motion.svg
                className="w-24 h-24 absolute inset-0"
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.95,
                  ease: 'linear',
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  strokeDasharray="72 200"
                />
              </motion.svg>
            </motion.div>
          ) : (
            <motion.div
              key="success-check"
              initial={{ scale: 0.55, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 340,
                damping: 22,
              }}
              className="relative w-24 h-24 flex items-center justify-center"
            >
              {/* Outer Subtle Track Ring Fading Out (Dribbble 00:02 morph effect) */}
              <motion.svg
                className="w-24 h-24 absolute inset-0"
                viewBox="0 0 100 100"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 1.15 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeWidth="5"
                />
              </motion.svg>

              {/* Bright Blue Circle + Animated White Checkmark */}
              <div className="w-24 h-24 rounded-full bg-[#1CA0FF] flex items-center justify-center shadow-[0_0_40px_rgba(28,160,255,0.45)]">
                <svg className="w-12 h-12" viewBox="0 0 52 52" fill="none">
                  <motion.path
                    d="M14 27 L22.5 35.5 L38.5 17.5"
                    stroke="#FFFFFF"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0.4 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.08,
                      ease: 'easeOut',
                    }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(label || sublabel) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-7 text-center"
        >
          {label && (
            <p className="text-sm font-semibold text-white/90 tracking-tight">
              {label}
            </p>
          )}
          {sublabel && (
            <p className="mt-1 text-xs text-white/45 max-w-[240px]">
              {sublabel}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
