import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SkillsCarousel({
  children,
}: Props) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="overflow-hidden w-full">
      <motion.div
        onHoverStart={() => setPaused(true)}
        onHoverEnd={() => setPaused(false)}
        className="flex gap-4 w-max"
        animate={
          paused
            ? {}
            : {
                x: ["0%", "-50%"],
              }
        }
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
        drag="x"
        dragConstraints={{
          left: -500,
          right: 0,
        }}
        whileHover={{
          animationPlayState: "paused",
        }}
      >
        {children}

        {children}
      </motion.div>
    </div>
  );
}