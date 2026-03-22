'use client';

import React, { useEffect, useRef } from 'react';

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dots: { x: number; y: number }[] = [];
    const spacing = 50;
    const mouse = { x: -1000, y: -1000 };

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      dots = [];

      for (let x = 0; x < width + spacing; x += spacing) {
        for (let y = 0; y < height + spacing; y += spacing) {
          dots.push({ x, y });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    init();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Phase 1: Background Dots - Darker Blue
      ctx.fillStyle = 'rgba(30, 58, 138, 0.15)';
      dots.forEach(dot => {
        ctx.fillRect(dot.x, dot.y, 1.2, 1.2);
      });

      // Phase 2: Interative Glow Effect
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.05)');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Phase 3: Active Dots
      ctx.fillStyle = 'rgba(30, 58, 138, 0.4)';
      dots.forEach(dot => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const factor = (150 - dist) / 150;
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 1 + factor * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
