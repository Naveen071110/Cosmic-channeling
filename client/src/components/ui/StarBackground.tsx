import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastMoved: 0 });
  const requestRef = useRef<number | null>(null);

  const createStar = (width: number, height: number): Star => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.05 + 0.02,
      twinkleSpeed: Math.random() * 0.01 + 0.003,
      twinklePhase: Math.random() * Math.PI * 2,
    };
  };

  const initStars = (width: number, height: number) => {
    // Number of stars based on screen size
    const starDensity = 0.0002; // Stars per pixel
    const starCount = Math.floor(width * height * starDensity);
    
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(createStar(width, height));
    }
    starsRef.current = stars;
  };

  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw stars
    starsRef.current.forEach((star, index) => {
      // Update star position with subtle movement
      star.x += star.speed * Math.sin(time * 0.001 + index);
      star.y += star.speed * Math.cos(time * 0.001 + index);
      
      // Wrap stars around edges
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;
      
      // Twinkle effect
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
      const opacity = star.opacity * twinkle;
      
      // Mouse interaction - make stars brighter near mouse
      if (time - mouseRef.current.lastMoved < 2000) {
        const dx = star.x - mouseRef.current.x;
        const dy = star.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;
        
        if (distance < maxDist) {
          const influence = 1 - distance / maxDist;
          const glowFactor = influence * 0.5;
          
          // Draw a glow around stars close to mouse
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3 * influence, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 180, 255, ${influence * 0.2})`;
          ctx.fill();
          
          // Increase opacity and size for mouse interaction
          ctx.globalAlpha = Math.min(opacity + glowFactor, 1);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * (1 + influence), 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          
          // Reset global alpha
          ctx.globalAlpha = 1;
        } else {
          // Regular star drawing
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      } else {
        // Regular star drawing
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
    
    // Occasionally add shooting stars
    if (Math.random() < 0.001) {
      createShootingStar(ctx, width, height);
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  const createShootingStar = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const x = Math.random() * width;
    const y = Math.random() * height / 3;
    const length = Math.random() * 80 + 50;
    const angle = Math.PI / 4 + (Math.random() * Math.PI / 4);
    const speed = Math.random() * 10 + 15;
    
    let progress = 0;
    
    const drawShootingStar = () => {
      progress += 0.02;
      
      if (progress >= 1) return;
      
      const currentX = x + Math.cos(angle) * length * progress;
      const currentY = y + Math.sin(angle) * length * progress;
      
      // Trail
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(currentX, currentY);
      
      // Create gradient for trail
      const gradient = ctx.createLinearGradient(x, y, currentX, currentY);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, `rgba(255, 255, 255, ${0.8 * (1 - progress)})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Head of shooting star
      ctx.beginPath();
      ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fill();
      
      setTimeout(drawShootingStar, 1000 / speed);
    };
    
    drawShootingStar();
  };

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        lastMoved: Date.now(),
      };
    };
    
    // Initial size
    handleResize();
    
    // Resize listener
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        initStars(dimensions.width, dimensions.height);
        
        requestRef.current = requestAnimationFrame(animate);
      }
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ backgroundColor: 'transparent' }}
    />
  );
}