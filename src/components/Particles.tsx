"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

export default function Particles({ count = 24 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 15,
        opacity: 0.2 + Math.random() * 0.5,
      }))
    );
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            background:
              p.id % 3 === 0
                ? "rgba(56, 189, 248, 0.6)"
                : p.id % 3 === 1
                  ? "rgba(51, 153, 255, 0.5)"
                  : "rgba(147, 197, 253, 0.4)",
          }}
        />
      ))}
    </div>
  );
}
