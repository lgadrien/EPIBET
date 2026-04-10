"use client";

import { useEffect, useRef } from "react";

export default function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fire = () => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: any[] = [];
    const colors = ["#00B6ED", "#FFFFFF", "#FFD700", "#FF4C4C"];

    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: Math.random() * 5 + 2,
        oscillation: Math.random() * 2,
      });
    }

    let start: number | null = null;
    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;

      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      let active = false;
      pieces.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.y / 30) * p.oscillation;
        p.rotation += 5;

        if (p.y < canvas.height) {
          active = true;
          ctx!.save();
          ctx!.translate(p.x, p.y);
          ctx!.rotate((p.rotation * Math.PI) / 180);
          ctx!.fillStyle = p.color;
          ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx!.restore();
        }
      });

      if (active && progress < 4000) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    }

    requestAnimationFrame(animate);
  };

  return { fire };
}
