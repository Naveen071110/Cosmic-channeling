import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add styles for star background and custom elements
const style = document.createElement('style');
style.innerHTML = `
  body {
    min-height: 100vh;
    background-color: #0F172A;
    font-family: 'Inter', sans-serif;
  }
  
  .star-bg {
    background-image: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  
  .cosmic-gradient {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes orbit {
    0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .cosmic-orbiter {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center;
    width: 240px;
    height: 240px;
  }
  
  .orbit-dot {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #EC4899;
    border-radius: 50%;
    box-shadow: 0 0 10px #EC4899;
    animation: orbit 20s linear infinite;
  }
  
  .font-space {
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .audio-progress {
    -webkit-appearance: none;
    height: 4px;
    background: #334155;
    outline: none;
    border-radius: 2px;
  }
  
  .audio-progress::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #EC4899;
    cursor: pointer;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1E293B;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }
`;
document.head.appendChild(style);

// Add tailwind custom colors
const tailwindStyle = document.createElement('style');
tailwindStyle.innerHTML = `
  :root {
    --space-950: #0F172A;
    --space-900: #1E293B;
    --space-800: #334155;
    --space-700: #475569;
    --space-600: #64748B;
    --space-100: #F1F5F9;
    --space-50: #F8FAFC;
    
    --cosmic-purple: #7E22CE;
    --cosmic-pink: #EC4899;
    --cosmic-blue: #0EA5E9;
    --cosmic-green: #10B981;
    --cosmic-red: #EF4444;
  }
`;
document.head.appendChild(tailwindStyle);

createRoot(document.getElementById("root")!).render(<App />);
