import { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full size of parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    type Star = {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      color: string;
    };
    
    const colorPalette = [
      'rgba(255, 255, 255, {})',  // White
      'rgba(135, 206, 250, {})',  // Light Blue
      'rgba(147, 112, 219, {})',  // Medium Purple
      'rgba(238, 130, 238, {})',  // Violet
      'rgba(70, 130, 180, {})',   // Steel Blue
    ];
    
    const starCount = Math.floor((canvas.width * canvas.height) / 3000);
    let stars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const colorIndex = Math.floor(Math.random() * colorPalette.length);
      const opacity = Math.random() * 0.6 + 0.4;
      
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity,
        speed: Math.random() * 0.02 + 0.01,
        color: colorPalette[colorIndex].replace('{}', opacity.toString())
      });
    }
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        
        // Move star based on mouse position
        const distX = mouseX - star.x;
        const distY = mouseY - star.y;
        const dist = Math.sqrt(distX * distX + distY * distY);
        
        // Only move stars within a certain radius
        if (dist < 150) {
          const force = (150 - dist) / 10000;
          star.x -= distX * force;
          star.y -= distY * force;
          
          // Keep stars within canvas bounds
          if (star.x < 0) star.x = 0;
          if (star.x > canvas.width) star.x = canvas.width;
          if (star.y < 0) star.y = 0;
          if (star.y > canvas.height) star.y = canvas.height;
        }
        
        // Twinkle effect
        const opacityChange = (Math.random() - 0.5) * 0.02;
        const newOpacity = star.opacity + opacityChange;
        if (newOpacity > 0.3 && newOpacity < 1) {
          star.opacity = newOpacity;
          star.color = star.color.replace(/[\d.]+(?=\))/, newOpacity.toString());
        }
      });
      
      requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}