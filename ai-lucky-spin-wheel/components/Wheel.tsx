import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Prize } from '../types';

interface WheelProps {
  prizes: Prize[];
  onSpinEnd: (winner: Prize) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const Wheel: React.FC<WheelProps> = ({ prizes, onSpinEnd, isSpinning, setIsSpinning }) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Math helpers
  const numSegments = prizes.length;
  const segmentAngle = 360 / numSegments;
  const radius = 200; // SVG coordinate system
  const center = 200;

  // Describe arc path for SVG
  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", center, center,
      "L", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
      "L", center, center, // Close path to center
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (r * Math.cos(angleInRadians)),
      y: centerY + (r * Math.sin(angleInRadians))
    };
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // --- Weighted Random Selection Logic ---
    let winnerIndex = -1;

    // Define weights based on text content
    // Target: 好运奖(33%), 神秘大礼(33%), 现金大奖(33%), Others(1% split)
    const getWeight = (text: string) => {
        if (text.includes('好运')) return 33;
        if (text.includes('神秘')) return 33;
        if (text.includes('现金')) return 33;
        return 0; // Will be calculated from remainder
    };

    const assignedWeights = prizes.map(p => getWeight(p.text));
    const totalAssigned = assignedWeights.reduce((sum, w) => sum + w, 0);
    const othersCount = assignedWeights.filter(w => w === 0).length;

    // Calculate distribution
    // If no special items found (totalAssigned == 0), use equal probability.
    let finalWeights: number[] = [];
    
    if (totalAssigned > 0) {
        // We have special items.
        // Remainder for the 'others' (e.g., 100 - 99 = 1%)
        const remainder = Math.max(0, 100 - totalAssigned);
        
        finalWeights = assignedWeights.map(w => {
            if (w > 0) return w;
            return othersCount > 0 ? remainder / othersCount : 0;
        });
    } else {
        // Fallback to equal distribution if specific prizes aren't found
        finalWeights = prizes.map(() => 1);
    }

    // Select based on weights
    const totalWeight = finalWeights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < finalWeights.length; i++) {
        if (random < finalWeights[i]) {
            winnerIndex = i;
            break;
        }
        random -= finalWeights[i];
    }
    
    // Safety check
    if (winnerIndex === -1) winnerIndex = Math.floor(Math.random() * numSegments);
    // --- End Weighted Logic ---
    
    
    // --- Rotation Calculation ---
    const extraSpins = 8; // Exactly 8 full spins requested
    
    // Randomized landing spot within the segment
    const jitter = (Math.random() - 0.5) * 0.8 * segmentAngle;
    
    // The visual angle where the winner segment center is located (0-360 relative to start)
    const targetAngleInWheelSpace = (winnerIndex * segmentAngle) + (segmentAngle / 2) + jitter;
    
    // Calculate the absolute rotation value needed.
    // We strictly accumulate rotation to ensure smooth transitions and exact spin counts.
    // 1. Where are we now visually? (0-360)
    const currentVisualAngle = rotation % 360;
    
    // 2. Where do we want to be visually? (0-360)
    // We need the target segment to be at the top (0 degrees).
    // If the segment is at angle `targetAngleInWheelSpace`, we need to rotate `360 - angle` to bring it to top.
    // We add 360 before modulo to handle any negative jitter edge cases.
    const targetVisualAngle = (360 - targetAngleInWheelSpace + 360) % 360;
    
    // 3. How much do we need to rotate forward to get there?
    let distanceToTarget = targetVisualAngle - currentVisualAngle;
    if (distanceToTarget < 0) {
        distanceToTarget += 360;
    }
    
    // 4. Total spin = 8 full rotations (2880 deg) + distance to target
    const totalRotationDelta = (360 * extraSpins) + distanceToTarget;
    const finalRotation = rotation + totalRotationDelta;

    await controls.start({
      rotate: finalRotation,
      transition: {
        duration: 8, // Smooth deceleration over 8 seconds to match 8 spins
        ease: [0.15, 0.85, 0.35, 1.0], // Custom cubic-bezier for realistic friction
        type: "tween"
      }
    });

    setRotation(finalRotation); // Accumulate rotation state (do not modulo)
    setIsSpinning(false);
    onSpinEnd(prizes[winnerIndex]);
  };

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-10 drop-shadow-xl">
        <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 40L0 0H30L15 40Z" fill="#F43F5E" stroke="white" strokeWidth="2"/>
        </svg>
      </div>

      {/* Wheel */}
      <motion.div
        className="w-full h-full"
        animate={controls}
        initial={{ rotate: 0 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-2xl"
        >
          <circle cx="200" cy="200" r="195" fill="#1F2937" stroke="#374151" strokeWidth="10" />
          
          {prizes.map((prize, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            const midAngle = startAngle + (segmentAngle / 2);
            
            // Calculate text position
            const textRadius = radius * 0.65; 
            const textPos = polarToCartesian(center, center, textRadius, midAngle);
            
            return (
              <g key={prize.id}>
                <path
                  d={describeArc(center, center, 190, startAngle, endAngle)}
                  fill={prize.color}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={Math.min(18, 120/numSegments + 10)} 
                  fontWeight="bold"
                  transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y}) rotate(90, ${textPos.x}, ${textPos.y})`}
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)", fontFamily: "sans-serif" }}
                >
                  {prize.text.length > 8 ? prize.text.substring(0, 6) + '..' : prize.text}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Center Button (Spin Trigger) */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 hover:scale-105 active:scale-95 transition-all disabled:opacity-80 disabled:cursor-not-allowed border-4 border-slate-200"
      >
        <span className="font-bold text-slate-900 text-sm md:text-lg uppercase">
            {isSpinning ? '...' : '开始'}
        </span>
      </button>
    </div>
  );
};

export default Wheel;