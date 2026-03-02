"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  priority?: boolean;
  overlay?: string;
  children?: ReactNode;
}

export default function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.3,
  priority = false,
  overlay,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}px`, `${speed * 100}px`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-[-80px]">
        <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
      </motion.div>
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      {children}
    </div>
  );
}
