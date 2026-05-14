// components/AnimatedBackground.jsx
import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let time = 0;

    const clouds = [];
    const cloudCount = 5;
    
    // Mower colors
    const mowerColors = [
      { name: 'blue', body: '#3B82F6', dark: '#1D4ED8' },
      { name: 'green', body: '#16A34A', dark: '#166534' },
      { name: 'yellow', body: '#EAB308', dark: '#A16207' },
      { name: 'red', body: '#DC2626', dark: '#991B1B' },
    ];
    
    // Multiple mowers array
    let mowers = [];
    let mowerSpawnTimer = 0;
    
    const spawnMowers = () => {
      mowers = [];
      const count = Math.random() > 0.5 ? 2 : 1; // Random 1 or 2 mowers
      const shuffledColors = [...mowerColors].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < count; i++) {
        const baseSpeed = 1.5 + Math.random() * 1.5; // Speed between 1.5 and 3
        mowers.push({
          x: -200 - (i * 150), // Staggered start positions
          speed: baseSpeed + (i * 0.5), // If 2 mowers, second one is faster (racing effect)
          color: shuffledColors[i],
          scale: 0.5 + Math.random() * 0.2, // Random scale 0.5 to 0.7
        });
      }
    };
    
    // Initial spawn
    spawnMowers();

    // Create clouds
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        size: Math.random() * 100 + 50,
        speed: Math.random() * 0.5 + 0.2
      });
    }

    const drawBackground = () => {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, width, height);
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#60A5FA');
      gradient.addColorStop(1, '#3B82F6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const drawWaves = () => {
      drawBackground();
      
      // Draw cartoonish wavy cloud patterns in the background
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, height * (0.3 + layer * 0.15));

        for (let x = 0; x <= width; x += 30) {
          const y = height * (0.3 + layer * 0.15) + Math.sin((x * 0.01) + time + layer * 2) * 30 + Math.cos((x * 0.02) + time) * 15;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(147, 197, 253, ${0.4 - layer * 0.1})`;
        ctx.fill();
      }
    };

    const drawClouds = () => {
      clouds.forEach(cloud => {
        ctx.fillStyle = '#FFFFFF';
        
        ctx.beginPath();
        
        // Draw fluffy wavy cloud using bezier curves
        const s = cloud.size;
        const cx = cloud.x;
        const cy = cloud.y;
        
        // Start from left bottom
        ctx.moveTo(cx - s * 0.5, cy + s * 0.1);
        
        // Bottom left bump
        ctx.bezierCurveTo(
          cx - s * 0.6, cy + s * 0.3,
          cx - s * 0.3, cy + s * 0.35,
          cx, cy + s * 0.2
        );
        
        // Bottom middle bump
        ctx.bezierCurveTo(
          cx + s * 0.3, cy + s * 0.35,
          cx + s * 0.6, cy + s * 0.3,
          cx + s * 0.8, cy + s * 0.1
        );
        
        // Right side going up
        ctx.bezierCurveTo(
          cx + s * 0.9, cy - s * 0.1,
          cx + s * 0.85, cy - s * 0.25,
          cx + s * 0.7, cy - s * 0.3
        );
        
        // Right top bump
        ctx.bezierCurveTo(
          cx + s * 0.9, cy - s * 0.45,
          cx + s * 0.8, cy - s * 0.55,
          cx + s * 0.6, cy - s * 0.4
        );
        
        // Top middle bump
        ctx.bezierCurveTo(
          cx + s * 0.5, cy - s * 0.6,
          cx + s * 0.2, cy - s * 0.55,
          cx, cy - s * 0.45
        );
        
        // Top left bump
        ctx.bezierCurveTo(
          cx - s * 0.2, cy - s * 0.55,
          cx - s * 0.45, cy - s * 0.5,
          cx - s * 0.5, cy - s * 0.3
        );
        
        // Left side going down
        ctx.bezierCurveTo(
          cx - s * 0.65, cy - s * 0.2,
          cx - s * 0.7, cy,
          cx - s * 0.5, cy + s * 0.1
        );
        
        ctx.closePath();
        ctx.fill();
        
        // Add a subtle light blue shadow underneath for depth
        ctx.fillStyle = 'rgba(200, 230, 255, 0.5)';
        ctx.beginPath();
        ctx.ellipse(cx + s * 0.1, cy + s * 0.25, s * 0.4, s * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();

        // Move cloud
        cloud.x += cloud.speed;
        if (cloud.x - cloud.size * 1.5 > width) {
          cloud.x = -cloud.size * 1.5;
          cloud.y = Math.random() * height * 0.5;
        }
      });
    };

    const drawSun = () => {
      const sunX = width * 0.85;
      const sunY = height * 0.12;
      const sunRadius = 50;
      
      // Sun glow
      const glowGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2);
      glowGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
      glowGradient.addColorStop(0.5, 'rgba(255, 220, 100, 0.4)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun body
      const sunGradient = ctx.createRadialGradient(sunX - 10, sunY - 10, 0, sunX, sunY, sunRadius);
      sunGradient.addColorStop(0, '#FFFACD');
      sunGradient.addColorStop(0.7, '#FFD700');
      sunGradient.addColorStop(1, '#FFA500');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun rays
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 3;
      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + time * 0.5;
        const innerR = sunRadius + 10;
        const outerR = sunRadius + 25;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * innerR, sunY + Math.sin(angle) * innerR);
        ctx.lineTo(sunX + Math.cos(angle) * outerR, sunY + Math.sin(angle) * outerR);
        ctx.stroke();
      }
    };

    const drawMower = (mower, groundY) => {
      const scale = mower.scale;
      const mowerY = groundY - 10 * scale;
      const color = mower.color;
      
      const x = mower.x;
      const y = mowerY;
      
      // Draw trapezoid body with mower color
      ctx.fillStyle = color.body;
      ctx.beginPath();
      ctx.moveTo(x, y - 40 * scale);
      ctx.lineTo(x + 100 * scale, y - 25 * scale);
      ctx.lineTo(x + 100 * scale, y);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw engine (red box on right side)
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(x + 65 * scale, y - 35 * scale, 30 * scale, 20 * scale);
      ctx.strokeRect(x + 65 * scale, y - 35 * scale, 30 * scale, 20 * scale);
      
      // Draw blade (grey oval)
      ctx.fillStyle = '#6B7280';
      ctx.beginPath();
      ctx.ellipse(x + 50 * scale, y + 5 * scale, 25 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw wheels (4 wheels)
      const wheelColor = '#1F2937';
      const hubColor = '#DC2626';
      
      // Front wheels
      ctx.fillStyle = wheelColor;
      ctx.beginPath();
      ctx.arc(x + 15 * scale, y + 8 * scale, 10 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 85 * scale, y + 8 * scale, 10 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // Rear wheels (bigger)
      ctx.beginPath();
      ctx.arc(x - 5 * scale, y + 5 * scale, 14 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 105 * scale, y + 5 * scale, 14 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // Wheel hubs
      ctx.fillStyle = hubColor;
      ctx.beginPath();
      ctx.arc(x + 15 * scale, y + 8 * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 85 * scale, y + 8 * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - 5 * scale, y + 5 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 105 * scale, y + 5 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // Handle
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(x, y - 20 * scale);
      ctx.quadraticCurveTo(x - 30 * scale, y - 60 * scale, x - 20 * scale, y - 80 * scale);
      ctx.stroke();
      
      // Handle grip
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(x - 30 * scale, y - 85 * scale, 25 * scale, 8 * scale);
    };

    const updateAndDrawMowers = (groundY) => {
      let allOffScreen = true;
      
      mowers.forEach(mower => {
        // Update position
        mower.x += mower.speed;
        
        // Check if still on screen
        if (mower.x < width + 100) {
          allOffScreen = false;
        }
        
        // Draw the mower
        drawMower(mower, groundY);
      });
      
      // Spawn new mowers when all are off screen
      if (allOffScreen && mowers.length > 0) {
        mowerSpawnTimer++;
        if (mowerSpawnTimer > 60) { // Wait 1 second (60 frames) before spawning
          spawnMowers();
          mowerSpawnTimer = 0;
        }
      }
    };

    const drawGrassField = () => {
      const groundY = height * 0.85;
      
      // Draw ground base
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
      groundGradient.addColorStop(0, '#228B22');
      groundGradient.addColorStop(0.5, '#1a7a1a');
      groundGradient.addColorStop(1, '#0d5c0d');
      
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, groundY, width, height - groundY);
      
      // Draw grass blades
      const bladeCount = Math.floor(width / 8);
      for (let i = 0; i < bladeCount; i++) {
        const x = i * 8 + Math.random() * 4;
        const bladeHeight = 15 + Math.random() * 20;
        const bladeWidth = 3 + Math.random() * 3;
        const curve = (Math.random() - 0.5) * 10;
        
        ctx.fillStyle = Math.random() > 0.5 ? '#32CD32' : '#2E8B57';
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.quadraticCurveTo(x + curve, groundY - bladeHeight / 2, x + curve / 2, groundY - bladeHeight);
        ctx.quadraticCurveTo(x + bladeWidth / 2, groundY - bladeHeight / 2, x + bladeWidth, groundY);
        ctx.closePath();
        ctx.fill();
      }
      
      // Add some grass texture dots
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = groundY + Math.random() * (height - groundY);
        const size = 1 + Math.random() * 2;
        
        ctx.fillStyle = Math.random() > 0.5 ? '#3CB371' : '#228B22';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawWaves();
      drawSun();
      drawClouds();
      const groundY = height * 0.85;
      updateAndDrawMowers(groundY);
      drawGrassField();
      time += 0.05;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default AnimatedBackground;