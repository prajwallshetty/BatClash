'use client';

import { Emoji } from 'react-apple-emojis';
import { motion } from 'framer-motion';

export function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="flex items-center justify-center gap-4 mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              x: [0, -10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Emoji name="bat" width={64} height={64} />
          </motion.div>
          <motion.span
            className="text-4xl font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            CLASH
          </motion.span>
          <motion.div
            animate={{
              x: [0, 10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Emoji name="bat" width={64} height={64} />
          </motion.div>
        </motion.div>
        <motion.div
          className="text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          Loading...
        </motion.div>
      </div>
    </div>
  );
}

