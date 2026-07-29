"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { useEffect, useRef, useState } from "react";

type LiquidMetalButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

// Adapted from the liquid-metal interaction supplied by Labish.
// The shader is decorative; the native button remains the accessible click target.
export function LiquidMetalButton({ label, onClick, className = "" }: LiquidMetalButtonProps) {
  const shaderRef = useRef<HTMLSpanElement>(null);
  const shaderMount = useRef<ShaderMount | null>(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!shaderRef.current) return;

    try {
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.55,
          u_shiftRed: 0.22,
          u_shiftBlue: 0.3,
          u_distortion: 0.08,
          u_contour: 0.1,
          u_angle: 42,
          u_scale: 1.1,
          u_shape: 1,
          u_offsetX: 0,
          u_offsetY: 0,
          u_isImage: false,
          u_colorBack: [0.05, 0.11, 0.1, 1],
          u_colorTint: [0.82, 0.98, 0.46, 0.82],
        },
        undefined,
        0.45,
        undefined,
        1,
        140_000,
      );
    } catch {
      // WebGL can be unavailable in a reduced-motion or privacy-focused browser.
      // The CSS surface behind the shader keeps the button fully functional.
    }

    return () => shaderMount.current?.dispose();
  }, []);

  return (
    <button
      type="button"
      className={`liquid-metal-button ${className}`}
      onClick={onClick}
      onMouseEnter={() => shaderMount.current?.setSpeed(1.05)}
      onMouseLeave={() => {
        setPressed(false);
        shaderMount.current?.setSpeed(0.45);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      data-pressed={pressed}
    >
      <span ref={shaderRef} className="liquid-metal-shader" aria-hidden="true" />
      <span className="liquid-metal-label">{label}</span>
    </button>
  );
}
