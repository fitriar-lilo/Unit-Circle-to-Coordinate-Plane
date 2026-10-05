import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ThemeConfig, MilestoneAngle, QuadrantId, TrigFunction } from '../types';
import { MILESTONES, getQuadrant } from '../utils/mathConstants';
import { soundFx } from '../utils/audio';

interface MainVisualizerProps {
  currentTheme: ThemeConfig;
  theta: number; // in radians, 0 to 2pi
  onThetaChange: (newTheta: number) => void;
  sliceCountPerQuadrant: number;
  showRightTriangle: boolean;
  showCosineBase: boolean;
  showProjectionRay: boolean;
  showDiscreteSlices: boolean;
  showSmoothCurve: boolean;
  showCoordinatesHUD: boolean;
  showAngleArc: boolean;
  activeQuadrant: QuadrantId | 'all';
  activeFunction: TrigFunction;
  onSelectFunction?: (fn: TrigFunction) => void;
}

export const MainVisualizer: React.FC<MainVisualizerProps> = ({
  currentTheme,
  theta,
  onThetaChange,
  sliceCountPerQuadrant,
  showRightTriangle,
  showCosineBase,
  showProjectionRay,
  showDiscreteSlices,
  showSmoothCurve,
  showCoordinatesHUD,
  showAngleArc,
  activeQuadrant,
  activeFunction,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const [hoveredMilestone, setHoveredMilestone] = useState<MilestoneAngle | null>(null);

  // Math values
  const sinVal = Math.sin(theta);
  const cosVal = Math.cos(theta);
  const degVal = ((theta * 180) / Math.PI) % 360;
  const currentQ = getQuadrant(theta);

  // Render on canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Layout configuration: Split into Left (Unit Circle) and Right (Wave Plane)
    const isMobile = width < 768;
    const circleCenterX = isMobile ? width * 0.5 : width * 0.22;
    const circleCenterY = isMobile ? height * 0.32 : height * 0.5;
    const circleRadius = isMobile ? Math.min(width * 0.32, height * 0.24) : Math.min(width * 0.16, height * 0.36);

    const waveStartX = isMobile ? width * 0.1 : width * 0.44;
    const waveEndX = isMobile ? width * 0.92 : width * 0.96;
    const waveWidth = waveEndX - waveStartX;
    const waveCenterY = isMobile ? height * 0.74 : height * 0.5;
    const waveAmp = circleRadius; // 1:1 scale for sine/cosine height!

    // Helper functions for coordinates
    const toCircleCoords = (x: number, y: number) => ({
      cx: circleCenterX + x * circleRadius,
      cy: circleCenterY - y * circleRadius,
    });

    const toWaveCoords = (t: number, y: number) => ({
      wx: waveStartX + (t / (2 * Math.PI)) * waveWidth,
      wy: waveCenterY - y * waveAmp,
    });

    // -------------------------------------------------------------
    // 1. DRAW BACKGROUND GRIDS & AXES
    // -------------------------------------------------------------
    ctx.lineWidth = 1;

    // Sub-grid for unit circle area
    ctx.strokeStyle = currentTheme.accentGrid;
    const gridStep = circleRadius * 0.5;
    for (let g = -circleRadius * 1.5; g <= circleRadius * 1.5; g += gridStep) {
      ctx.beginPath();
      ctx.moveTo(circleCenterX + g, circleCenterY - circleRadius * 1.4);
      ctx.lineTo(circleCenterX + g, circleCenterY + circleRadius * 1.4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(circleCenterX - circleRadius * 1.4, circleCenterY + g);
      ctx.lineTo(circleCenterX + circleRadius * 1.4, circleCenterY + g);
      ctx.stroke();
    }

    // Sub-grid for wave area
    for (let yStep = -1; yStep <= 1; yStep += 0.5) {
      if (yStep === 0) continue;
      ctx.beginPath();
      ctx.moveTo(waveStartX, waveCenterY - yStep * waveAmp);
      ctx.lineTo(waveEndX, waveCenterY - yStep * waveAmp);
      ctx.stroke();
    }

    // Quadrant vertical division lines on the wave (0, pi/2, pi, 3pi/2, 2pi)
    const quadAngles = [
      { rad: Math.PI / 2, label: 'π/2 (90°)' },
      { rad: Math.PI, label: 'π (180°)' },
      { rad: (3 * Math.PI) / 2, label: '3π/2 (270°)' },
      { rad: 2 * Math.PI, label: '2π (360°)' },
    ];

    quadAngles.forEach((qa) => {
      const { wx } = toWaveCoords(qa.rad, 0);
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = currentTheme.accentGrid;
      ctx.beginPath();
      ctx.moveTo(wx, waveCenterY - waveAmp * 1.25);
      ctx.lineTo(wx, waveCenterY + waveAmp * 1.25);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // -------------------------------------------------------------
    // 2. MAIN AXES (X & Y)
    // -------------------------------------------------------------
    ctx.strokeStyle = currentTheme.accentAxis;
    ctx.lineWidth = 1.5;

    // Unit circle axes
    ctx.beginPath();
    ctx.moveTo(circleCenterX - circleRadius * 1.25, circleCenterY);
    ctx.lineTo(circleCenterX + circleRadius * 1.25, circleCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(circleCenterX, circleCenterY + circleRadius * 1.25);
    ctx.lineTo(circleCenterX, circleCenterY - circleRadius * 1.25);
    ctx.stroke();

    // Wave axes
    ctx.beginPath();
    ctx.moveTo(waveStartX, waveCenterY);
    ctx.lineTo(waveEndX, waveCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(waveStartX, waveCenterY + waveAmp * 1.25);
    ctx.lineTo(waveStartX, waveCenterY - waveAmp * 1.25);
    ctx.stroke();

    // Axis Labels & Ticks
    ctx.fillStyle = currentTheme.accentAxis;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Unit Circle tick markers (+1, -1)
    ctx.fillText('1', circleCenterX + circleRadius, circleCenterY + 14);
    ctx.fillText('-1', circleCenterX - circleRadius, circleCenterY + 14);
    ctx.fillText('1', circleCenterX - 14, circleCenterY - circleRadius);
    ctx.fillText('-1', circleCenterX - 14, circleCenterY + circleRadius);
    ctx.fillText('x (cos)', circleCenterX + circleRadius * 1.3, circleCenterY - 10);
    ctx.fillText('y (sin)', circleCenterX + 10, circleCenterY - circleRadius * 1.3);

    // Wave axis tick marks
    ctx.textAlign = 'right';
    ctx.fillText('+1', waveStartX - 6, waveCenterY - waveAmp);
    ctx.fillText('0', waveStartX - 6, waveCenterY);
    ctx.fillText('-1', waveStartX - 6, waveCenterY + waveAmp);

    // Theta tick marks along wave
    ctx.textAlign = 'center';
    ctx.fillText('0', waveStartX, waveCenterY + 16);
    ctx.fillText('π/2', toWaveCoords(Math.PI / 2, 0).wx, waveCenterY + 16);
    ctx.fillText('π', toWaveCoords(Math.PI, 0).wx, waveCenterY + 16);
    ctx.fillText('3π/2', toWaveCoords((3 * Math.PI) / 2, 0).wx, waveCenterY + 16);
    ctx.fillText('2π', toWaveCoords(2 * Math.PI, 0).wx, waveCenterY + 16);
    ctx.fillText('θ (radians)', waveEndX - 20, waveCenterY + 28);

    // -------------------------------------------------------------
    // 3. DRAW THE UNIT CIRCLE (Radius = 1)
    // -------------------------------------------------------------
    ctx.beginPath();
    ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = currentTheme.accentCircle;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Quadrant labels inside circle
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.fillText('QI (0→π/2)', circleCenterX + circleRadius * 0.55, circleCenterY - circleRadius * 0.55);
    ctx.fillText('QII (π/2→π)', circleCenterX - circleRadius * 0.55, circleCenterY - circleRadius * 0.55);
    ctx.fillText('QIII (π→3π/2)', circleCenterX - circleRadius * 0.55, circleCenterY + circleRadius * 0.55);
    ctx.fillText('QIV (3π/2→2π)', circleCenterX + circleRadius * 0.55, circleCenterY + circleRadius * 0.55);

    // -------------------------------------------------------------
    // 4. DISCRETE SLICES (VERTICAL for SINE, HORIZONTAL for COSINE)
    // -------------------------------------------------------------
    if (showDiscreteSlices) {
      const totalSlices = sliceCountPerQuadrant * 4;
      const dTheta = (2 * Math.PI) / totalSlices;

      for (let i = 0; i <= totalSlices; i++) {
        const sliceTheta = i * dTheta;
        if (sliceTheta > 2 * Math.PI + 0.001) break;

        if (activeQuadrant !== 'all') {
          const qOfSlice = getQuadrant(sliceTheta);
          if (qOfSlice !== activeQuadrant) continue;
        }

        const sliceSin = Math.sin(sliceTheta);
        const sliceCos = Math.cos(sliceTheta);
        const isPastOrCurrent = sliceTheta <= theta + 0.0001;

        // Color coding by quadrant
        let sliceColor = currentTheme.accentSlice;
        if (sliceTheta < Math.PI / 2) sliceColor = '#10b981';
        else if (sliceTheta < Math.PI) sliceColor = '#f59e0b';
        else if (sliceTheta < (3 * Math.PI) / 2) sliceColor = '#f43f5e';
        else sliceColor = '#38bdf8';

        // 4A. If Sine or Both: Draw Vertical Slices
        if (activeFunction === 'sine' || activeFunction === 'both') {
          const circlePos = toCircleCoords(sliceCos, sliceSin);
          const circleBase = toCircleCoords(sliceCos, 0);
          const wavePos = toWaveCoords(sliceTheta, sliceSin);
          const waveBase = toWaveCoords(sliceTheta, 0);

          ctx.strokeStyle = isPastOrCurrent ? (activeFunction === 'both' ? '#ef4444' : sliceColor) : 'rgba(148, 163, 184, 0.2)';
          ctx.lineWidth = isPastOrCurrent ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(circleBase.cx, circleBase.cy);
          ctx.lineTo(circlePos.cx, circlePos.cy);
          ctx.stroke();

          if (isPastOrCurrent) {
            ctx.fillStyle = activeFunction === 'both' ? '#ef4444' : sliceColor;
            ctx.beginPath();
            ctx.arc(circlePos.cx, circlePos.cy, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // On wave plane
            ctx.strokeStyle = activeFunction === 'both' ? 'rgba(239, 68, 68, 0.65)' : sliceColor;
            ctx.lineWidth = Math.max(1.5, Math.min(4, waveWidth / totalSlices - 1));
            ctx.beginPath();
            ctx.moveTo(waveBase.wx, waveBase.wy);
            ctx.lineTo(wavePos.wx, wavePos.wy);
            ctx.stroke();
          }
        }

        // 4B. If Cosine or Both: Draw Horizontal Slices
        // "unit circle divided horizontally into many parts, then arrange each part in order in coordinate plane"
        if (activeFunction === 'cosine' || activeFunction === 'both') {
          const horizYAxis = toCircleCoords(0, sliceSin);
          const horizPt = toCircleCoords(sliceCos, sliceSin);

          const wavePosCos = toWaveCoords(sliceTheta, sliceCos);
          const waveBaseCos = toWaveCoords(sliceTheta, 0);

          const cosSliceColor = activeFunction === 'both' ? '#0ea5e9' : sliceColor;

          ctx.strokeStyle = isPastOrCurrent ? cosSliceColor : 'rgba(148, 163, 184, 0.2)';
          ctx.lineWidth = isPastOrCurrent ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(horizYAxis.cx, horizYAxis.cy);
          ctx.lineTo(horizPt.cx, horizPt.cy);
          ctx.stroke();

          if (isPastOrCurrent) {
            ctx.fillStyle = cosSliceColor;
            ctx.beginPath();
            ctx.arc(horizPt.cx, horizPt.cy, 2, 0, Math.PI * 2);
            ctx.fill();

            // Slices arranged in order on the Coordinate Plane!
            // In Q1: from highest part (+1 at theta=0) down to smallest (0 at 90°)
            ctx.strokeStyle = activeFunction === 'both' ? 'rgba(14, 165, 233, 0.65)' : cosSliceColor;
            ctx.lineWidth = Math.max(1.5, Math.min(4, waveWidth / totalSlices - 1));
            ctx.beginPath();
            ctx.moveTo(waveBaseCos.wx, waveBaseCos.wy);
            ctx.lineTo(wavePosCos.wx, wavePosCos.wy);
            ctx.stroke();

            ctx.fillStyle = cosSliceColor;
            ctx.beginPath();
            ctx.arc(wavePosCos.wx, wavePosCos.wy, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // -------------------------------------------------------------
    // 5. DRAW SINE AND/OR COSINE CURVES
    // -------------------------------------------------------------
    if (showSmoothCurve) {
      // 5A. Sine Curve
      if (activeFunction === 'sine' || activeFunction === 'both') {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.lineWidth = 1.5;
        for (let t = 0; t <= Math.PI * 2; t += 0.02) {
          const pt = toWaveCoords(t, Math.sin(t));
          if (t === 0) ctx.moveTo(pt.wx, pt.wy);
          else ctx.lineTo(pt.wx, pt.wy);
        }
        ctx.stroke();

        // Shaded active sine curve
        if (theta > 0.01) {
          ctx.beginPath();
          const startBase = toWaveCoords(0, 0);
          ctx.moveTo(startBase.wx, startBase.wy);
          for (let t = 0; t <= theta; t += 0.02) {
            const pt = toWaveCoords(t, Math.sin(t));
            ctx.lineTo(pt.wx, pt.wy);
          }
          const endPt = toWaveCoords(theta, Math.sin(theta));
          const endBase = toWaveCoords(theta, 0);
          ctx.lineTo(endPt.wx, endPt.wy);
          ctx.lineTo(endBase.wx, endBase.wy);
          ctx.closePath();
          ctx.fillStyle = currentTheme.accentSineFill;
          ctx.fill();

          ctx.beginPath();
          ctx.strokeStyle = currentTheme.accentSine;
          ctx.lineWidth = 3.5;
          for (let t = 0; t <= theta; t += 0.02) {
            const pt = toWaveCoords(t, Math.sin(t));
            if (t === 0) ctx.moveTo(pt.wx, pt.wy);
            else ctx.lineTo(pt.wx, pt.wy);
          }
          const finalPt = toWaveCoords(theta, Math.sin(theta));
          ctx.lineTo(finalPt.wx, finalPt.wy);
          ctx.stroke();
        }
      }

      // 5B. Cosine Curve
      if (activeFunction === 'cosine' || activeFunction === 'both') {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
        ctx.lineWidth = 1.5;
        for (let t = 0; t <= Math.PI * 2; t += 0.02) {
          const pt = toWaveCoords(t, Math.cos(t));
          if (t === 0) ctx.moveTo(pt.wx, pt.wy);
          else ctx.lineTo(pt.wx, pt.wy);
        }
        ctx.stroke();

        // Shaded active cosine curve
        if (theta > 0.001) {
          ctx.beginPath();
          const startBase = toWaveCoords(0, 0);
          ctx.moveTo(startBase.wx, startBase.wy);
          for (let t = 0; t <= theta; t += 0.02) {
            const pt = toWaveCoords(t, Math.cos(t));
            ctx.lineTo(pt.wx, pt.wy);
          }
          const endPt = toWaveCoords(theta, Math.cos(theta));
          const endBase = toWaveCoords(theta, 0);
          ctx.lineTo(endPt.wx, endPt.wy);
          ctx.lineTo(endBase.wx, endBase.wy);
          ctx.closePath();
          ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
          ctx.fill();

          ctx.beginPath();
          ctx.strokeStyle = '#0ea5e9'; // Bright azure cyan for Cosine
          ctx.lineWidth = 3.5;
          for (let t = 0; t <= theta; t += 0.02) {
            const pt = toWaveCoords(t, Math.cos(t));
            if (t === 0) ctx.moveTo(pt.wx, pt.wy);
            else ctx.lineTo(pt.wx, pt.wy);
          }
          const finalPt = toWaveCoords(theta, Math.cos(theta));
          ctx.lineTo(finalPt.wx, finalPt.wy);
          ctx.stroke();
        }
      }
    }

    // -------------------------------------------------------------
    // 6. DRAW RIGHT TRIANGLE IN THE UNIT CIRCLE
    // -------------------------------------------------------------
    const currentCircleP = toCircleCoords(cosVal, sinVal);
    const triangleBaseP = toCircleCoords(cosVal, 0);
    const circleOriginP = toCircleCoords(0, 0);

    if (showRightTriangle) {
      // Hypotenuse (Radius = 1)
      ctx.strokeStyle = currentTheme.accentTriangle;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(circleOriginP.cx, circleOriginP.cy);
      ctx.lineTo(currentCircleP.cx, currentCircleP.cy);
      ctx.stroke();

      // Hypotenuse "r = 1" label
      ctx.fillStyle = currentTheme.accentTriangle;
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      const midHypX = (circleOriginP.cx + currentCircleP.cx) / 2;
      const midHypY = (circleOriginP.cy + currentCircleP.cy) / 2;
      const perpX = -sinVal * 10;
      const perpY = -cosVal * 10;
      ctx.fillText('r = 1', midHypX + perpX, midHypY + perpY);

      // Cosine Base (Adjacent horizontal side)
      if (showCosineBase || activeFunction === 'cosine' || activeFunction === 'both') {
        ctx.strokeStyle = activeFunction === 'cosine' ? '#0ea5e9' : currentTheme.accentCosine;
        ctx.lineWidth = 3.5;
        if (activeFunction === 'cosine') {
          ctx.shadowColor = '#0ea5e9';
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.moveTo(circleOriginP.cx, circleOriginP.cy);
        ctx.lineTo(triangleBaseP.cx, triangleBaseP.cy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Cosine label
        ctx.fillStyle = '#0ea5e9';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`cos(θ) = ${cosVal.toFixed(2)}`, (circleOriginP.cx + triangleBaseP.cx) / 2, circleCenterY + (sinVal >= 0 ? 15 : -10));
      }

      // Right angle square indicator
      const sqSize = 8;
      const sqDirX = cosVal >= 0 ? -1 : 1;
      const sqDirY = sinVal >= 0 ? -1 : 1;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(triangleBaseP.cx + sqDirX * sqSize, triangleBaseP.cy);
      ctx.lineTo(triangleBaseP.cx + sqDirX * sqSize, triangleBaseP.cy + sqDirY * sqSize);
      ctx.lineTo(triangleBaseP.cx, triangleBaseP.cy + sqDirY * sqSize);
      ctx.stroke();
    }

    // Angle Arc in Unit Circle
    if (showAngleArc && theta > 0.05) {
      const arcRadius = Math.min(32, circleRadius * 0.35);
      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, arcRadius, 0, -theta, true);
      ctx.strokeStyle = currentTheme.accentSine;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.lineTo(circleCenterX, circleCenterY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.fill();

      const midTheta = theta / 2;
      const labelRad = arcRadius + 14;
      const labelX = circleCenterX + Math.cos(midTheta) * labelRad;
      const labelY = circleCenterY - Math.sin(midTheta) * labelRad;
      ctx.fillStyle = currentTheme.accentSine;
      ctx.font = 'bold 12px "Fraunces", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('θ', labelX, labelY);
    }

    // -------------------------------------------------------------
    // 7. HIGHLIGHT ACTIVE SINE / COSINE SEGMENTS & PROJECTIONS
    // -------------------------------------------------------------
    // Active Vertical Sine Leg in Circle
    if (activeFunction === 'sine' || activeFunction === 'both') {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(triangleBaseP.cx, triangleBaseP.cy);
      ctx.lineTo(currentCircleP.cx, currentCircleP.cy);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Active Sine Bar on Wave
      const currentWaveSinP = toWaveCoords(theta, sinVal);
      const currentWaveBaseP = toWaveCoords(theta, 0);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(currentWaveBaseP.wx, currentWaveBaseP.wy);
      ctx.lineTo(currentWaveSinP.wx, currentWaveSinP.wy);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Horizontal Projection Ray for Sine
      if (showProjectionRay) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(currentCircleP.cx, currentCircleP.cy);
        ctx.lineTo(currentWaveSinP.wx, currentWaveSinP.wy);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Point on Sine Wave
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(currentWaveSinP.wx, currentWaveSinP.wy, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Active Horizontal Cosine Leg & Wave Projection
    if (activeFunction === 'cosine' || activeFunction === 'both') {
      const currentWaveCosP = toWaveCoords(theta, cosVal);
      const currentWaveBaseP = toWaveCoords(theta, 0);

      // Active Cosine Bar on Wave
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(currentWaveBaseP.wx, currentWaveBaseP.wy);
      ctx.lineTo(currentWaveCosP.wx, currentWaveCosP.wy);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Projection for Cosine: connects the horizontal leg to the wave height cos(theta)
      if (showProjectionRay) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(triangleBaseP.cx, triangleBaseP.cy);
        ctx.lineTo(triangleBaseP.cx, currentWaveCosP.wy);
        ctx.lineTo(currentWaveCosP.wx, currentWaveCosP.wy);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Point on Cosine Wave
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(currentWaveCosP.wx, currentWaveCosP.wy, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // -------------------------------------------------------------
    // 8. POINT P ON CIRCLE
    // -------------------------------------------------------------
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = activeFunction === 'cosine' ? '#0ea5e9' : currentTheme.accentSine;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(currentCircleP.cx, currentCircleP.cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Coordinates tooltip next to P
    if (showCoordinatesHUD) {
      const pLabel = `P(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      const textW = ctx.measureText(pLabel).width + 8;
      const padX = currentCircleP.cx + (cosVal >= 0 ? 12 : -textW - 12);
      const padY = currentCircleP.cy - 12;

      ctx.fillRect(padX, padY - 8, textW, 16);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(pLabel, padX + 4, padY + 3);
    }

    // Wave Curve Legend when in 'both' mode
    if (activeFunction === 'both') {
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('— sin(θ) [Vertical leg]', waveStartX + 10, waveCenterY - waveAmp * 1.1);
      ctx.fillStyle = '#0ea5e9';
      ctx.fillText('— cos(θ) [Horizontal leg]', waveStartX + 10, waveCenterY - waveAmp * 0.95);
    }

    ctx.restore();
  }, [
    currentTheme,
    theta,
    sinVal,
    cosVal,
    sliceCountPerQuadrant,
    showRightTriangle,
    showCosineBase,
    showProjectionRay,
    showDiscreteSlices,
    showSmoothCurve,
    showCoordinatesHUD,
    showAngleArc,
    activeQuadrant,
    activeFunction,
  ]);

  // Request Animation Frame loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      render();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [render]);

  // Pointer dragging handler
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const isMobile = width < 768;
    const circleCenterX = isMobile ? width * 0.5 : width * 0.22;
    const circleCenterY = isMobile ? height * 0.32 : height * 0.5;

    const dx = x - circleCenterX;
    const dy = y - circleCenterY;
    const distToCenter = Math.sqrt(dx * dx + dy * dy);
    const circleRadius = isMobile ? Math.min(width * 0.32, height * 0.24) : Math.min(width * 0.16, height * 0.36);

    if (distToCenter <= circleRadius * 1.5) {
      isDraggingRef.current = true;
      updateThetaFromCircle(dx, dy);
      canvas.setPointerCapture(e.pointerId);
      return;
    }

    const waveStartX = isMobile ? width * 0.1 : width * 0.44;
    const waveEndX = isMobile ? width * 0.92 : width * 0.96;
    if (x >= waveStartX && x <= waveEndX) {
      const frac = (x - waveStartX) / (waveEndX - waveStartX);
      const newTheta = Math.max(0, Math.min(2 * Math.PI, frac * (2 * Math.PI)));
      onThetaChange(newTheta);
      soundFx.checkAndPlayAngleSound((newTheta * 180) / Math.PI);
    }
  };

  const updateThetaFromCircle = (dx: number, dy: number) => {
    let rad = Math.atan2(-dy, dx);
    if (rad < 0) rad += 2 * Math.PI;
    onThetaChange(rad);
    soundFx.checkAndPlayAngleSound((rad * 180) / Math.PI);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const isMobile = width < 768;
    const circleCenterX = isMobile ? width * 0.5 : width * 0.22;
    const circleCenterY = isMobile ? height * 0.32 : height * 0.5;

    updateThetaFromCircle(x - circleCenterX, y - circleCenterY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Visual Canvas Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-2xl border ${currentTheme.borderClass} overflow-hidden shadow-2xl transition-all duration-300`}
        style={{ backgroundColor: currentTheme.canvasBg }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none select-none block"
        />

        {/* Live Mathematical Formula & Value Overlay */}
        <div className="absolute top-3 left-4 pointer-events-none flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
            <span className="text-slate-400">Angle θ:</span>
            <span className="font-mono-math font-semibold text-amber-400">
              {degVal.toFixed(1)}°
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-mono-math text-amber-300">
              {(theta / Math.PI).toFixed(2)}π rad
            </span>
          </div>

          {(activeFunction === 'cosine' || activeFunction === 'both') && (
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
              <span className="text-sky-400 font-semibold font-serif-math">Horizontal Cosine:</span>
              <span className="font-mono-math text-sky-300 font-bold">
                cos(θ) = {cosVal >= 0 ? `+${cosVal.toFixed(3)}` : cosVal.toFixed(3)}
              </span>
            </div>
          )}

          {(activeFunction === 'sine' || activeFunction === 'both') && (
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
              <span className="text-rose-400 font-semibold font-serif-math">Vertical Sine:</span>
              <span className="font-mono-math text-rose-300 font-bold">
                sin(θ) = {sinVal >= 0 ? `+${sinVal.toFixed(3)}` : sinVal.toFixed(3)}
              </span>
            </div>
          )}
        </div>

        {/* Drag Hint on Canvas */}
        <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] text-slate-400 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-800">
          💡 Drag point <strong className="text-amber-400">P</strong> on circle or click graph to set angle θ
        </div>

        {/* Quadrant Indicator Badge */}
        <div className="absolute top-3 right-4 flex items-center gap-1.5">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2 shadow-lg">
            <span className="text-slate-400">Current Phase:</span>
            <span className="font-bold text-emerald-400">
              Quadrant {currentQ} ({currentQ === 1 ? '0°–90°' : currentQ === 2 ? '90°–180°' : currentQ === 3 ? '180°–270°' : '270°–360°'})
            </span>
          </div>
        </div>
      </div>

      {/* Quick Landmark Angle Buttons */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
        <span className="text-xs text-slate-400 font-medium shrink-0 mr-1 hidden sm:inline">
          Special Angles:
        </span>
        {MILESTONES.map((m) => {
          const isActive = Math.abs(m.rad - theta) < 0.05;
          return (
            <button
              key={m.deg}
              onClick={() => {
                onThetaChange(m.rad);
                soundFx.playMilestoneChime(m.quadrant, m.deg % 90 === 0);
              }}
              onMouseEnter={() => setHoveredMilestone(m)}
              onMouseLeave={() => setHoveredMilestone(null)}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono-math transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              {m.radLabel} ({m.deg}°)
            </button>
          );
        })}
      </div>
    </div>
  );
};
