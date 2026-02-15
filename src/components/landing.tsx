import React, { useState, useEffect } from "react";

// --- Configuration ---
const STROKE_COLOR = "#e8dcc8";
const BG_COLOR = "black";
const BASE_CELL_SIZE = 120; // Target pixel size for grid cells
const DEPTH_STEPS = 6;     // How deep the room goes
const PERSPECTIVE = 0.5;  // Size of back wall relative to screen (0.25 = 25%)
const PADDINGX = 60;
const PADDINGY = 60;

// --- Types ---
type Rect = { x: number; y: number; w: number; h: number };

type TileDef = {
  surface: "back" | "left" | "right" | "top" | "bottom";
  col: number; 
  row: number; 
  color: string;
  w?: number; 
  h?: number; 
};

// --- Math Helpers ---
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const getScreenPoint = (u: number, v: number, d: number, back: Rect, outer: Rect) => {
  const currentRect = {
    x: lerp(outer.x, back.x, d),
    y: lerp(outer.y, back.y, d),
    w: lerp(outer.w, back.w, d),
    h: lerp(outer.h, back.h, d),
  };
  return {
    x: currentRect.x + currentRect.w * u,
    y: currentRect.y + currentRect.h * v,
  };
};

export default function WireframeRoom() {
  const [dimensions, setDimensions] = useState({ 
    width: 1200, 
    height: 800,
    cols: 12,
    rows: 8
  });

  // Handle Resize & Recalculate Grid
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth - PADDINGX;
      const h = window.innerHeight - PADDINGY;
      
      // Calculate cols/rows to keep cells roughly square
      const cols = Math.round(w / BASE_CELL_SIZE);
      const rows = Math.round(h / BASE_CELL_SIZE);

      setDimensions({ width: w, height: h, cols, rows });
    };

    // Initial call
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height, cols, rows } = dimensions;

  // --- Dynamic Geometry ---
  const outer: Rect = { x: PADDINGX/2, y: PADDINGY/2, w: width, h: height };
  
  // Calculate back wall centered
  const backW = width * PERSPECTIVE;
  const backH = height * PERSPECTIVE;
  const back: Rect = {
    x: (width - backW) / 2,
    y: (height - backH) / 2,
    w: backW,
    h: backH,
  };

  // --- Dynamic Tiles ---
  // Since grid size changes, we must safely map tiles to valid coordinates
  // or clamp them so they don't disappear off-grid.
  const TILES: TileDef[] = [
    // Ceiling (Top)
    { surface: "top", col: Math.floor(cols * 0.3), row: 2, color: "#00FFFF", w: 2 },
    { surface: "top", col: Math.floor(cols * 0.6), row: 4, color: "#FF8800", w: 1 },
    
    // Floor (Bottom)
    { surface: "bottom", col: Math.floor(cols * 0.2), row: 1, color: "#FF0088", w: 2 },
    { surface: "bottom", col: Math.floor(cols * 0.8), row: 3, color: "#6600FF", w: 1 },

    // Left Wall (Row is vertical position)
    { surface: "left", col: 1, row: Math.floor(rows * 0.2), color: "#44FF00", h: 2 },
    
    // Right Wall
    { surface: "right", col: 2, row: Math.floor(rows * 0.5), color: "#0088FF", h: 2 },
    
    // Back Wall
    { surface: "back", col: Math.floor(cols * 0.5), row: Math.floor(rows * 0.5), color: "#FFFFFF", w: 1, h: 1},
  ];

  // --- Render Helpers ---
  const renderTile = (tile: TileDef, i: number) => {
    let p1, p2, p3, p4;
    const w = tile.w || 1;
    const h = tile.h || 1;

    // Safety check: ensure tile is within current grid bounds
    if (tile.col >= cols && tile.surface !== "left" && tile.surface !== "right") return null;
    if (tile.row >= rows && tile.surface !== "top" && tile.surface !== "bottom") return null;

    if (tile.surface === "back") {
      const u1 = tile.col / cols;
      const v1 = tile.row / rows;
      const u2 = (tile.col + w) / cols;
      const v2 = (tile.row + h) / rows;
      p1 = getScreenPoint(u1, v1, 1, back, outer);
      p2 = getScreenPoint(u2, v1, 1, back, outer);
      p3 = getScreenPoint(u2, v2, 1, back, outer);
      p4 = getScreenPoint(u1, v2, 1, back, outer);
    } else if (tile.surface === "top") {
      const u1 = tile.col / cols;
      const u2 = (tile.col + w) / cols;
      const d1 = tile.row / DEPTH_STEPS;
      const d2 = (tile.row + (tile.h || 1)) / DEPTH_STEPS;
      p1 = getScreenPoint(u1, 0, d1, back, outer);
      p2 = getScreenPoint(u2, 0, d1, back, outer);
      p3 = getScreenPoint(u2, 0, d2, back, outer);
      p4 = getScreenPoint(u1, 0, d2, back, outer);
    } else if (tile.surface === "bottom") {
      const u1 = tile.col / cols;
      const u2 = (tile.col + w) / cols;
      const d1 = tile.row / DEPTH_STEPS;
      const d2 = (tile.row + (tile.h || 1)) / DEPTH_STEPS;
      p1 = getScreenPoint(u1, 1, d1, back, outer);
      p2 = getScreenPoint(u2, 1, d1, back, outer);
      p3 = getScreenPoint(u2, 1, d2, back, outer);
      p4 = getScreenPoint(u1, 1, d2, back, outer);
    } else if (tile.surface === "left") {
      const d1 = tile.col / DEPTH_STEPS;
      const d2 = (tile.col + w) / DEPTH_STEPS;
      const v1 = tile.row / rows;
      const v2 = (tile.row + h) / rows;
      p1 = getScreenPoint(0, v1, d1, back, outer);
      p2 = getScreenPoint(0, v1, d2, back, outer);
      p3 = getScreenPoint(0, v2, d2, back, outer);
      p4 = getScreenPoint(0, v2, d1, back, outer);
    } else { // right
      const d1 = tile.col / DEPTH_STEPS;
      const d2 = (tile.col + w) / DEPTH_STEPS;
      const v1 = tile.row / rows;
      const v2 = (tile.row + h) / rows;
      p1 = getScreenPoint(1, v1, d1, back, outer);
      p2 = getScreenPoint(1, v1, d2, back, outer);
      p3 = getScreenPoint(1, v2, d2, back, outer);
      p4 = getScreenPoint(1, v2, d1, back, outer);
    }

    const points = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;
    return <polygon key={`tile-${i}`} points={points} fill={tile.color} />;
  };

  return (
    <div className="absolute -z-10 inset-0 w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <svg className="block w-full h-full">
        <rect width="100%" height="100%" fill={BG_COLOR} />

        {/* 1. TILES */}
        {TILES.map((t, i) => renderTile(t, i))}

        {/* 2. DEPTH RINGS */}
        {Array.from({ length: DEPTH_STEPS + 1 }).map((_, i) => {
          const d = i / DEPTH_STEPS;
          const p1 = getScreenPoint(0, 0, d, back, outer);
          const p2 = getScreenPoint(1, 1, d, back, outer);
          return (
            <rect
              key={`ring-${i}`}
              x={p1.x}
              y={p1.y}
              width={p2.x - p1.x}
              height={p2.y - p1.y}
              fill="none"
              stroke={STROKE_COLOR}
              strokeWidth="1"
            />
          );
        })}

        {/* 3. VERTICAL RAYS (Ceiling/Floor lines) */}
        {Array.from({ length: cols + 1 }).map((_, i) => {
          const u = i / cols;
          const t1 = getScreenPoint(u, 0, 0, back, outer);
          const t2 = getScreenPoint(u, 0, 1, back, outer);
          const b1 = getScreenPoint(u, 1, 0, back, outer);
          const b2 = getScreenPoint(u, 1, 1, back, outer);
          const v1 = getScreenPoint(u, 0, 1, back, outer);
          const v2 = getScreenPoint(u, 1, 1, back, outer);

          return (
            <React.Fragment key={`v-ray-${i}`}>
              <line x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke={STROKE_COLOR} />
              <line x1={b1.x} y1={b1.y} x2={b2.x} y2={b2.y} stroke={STROKE_COLOR} />
              <line x1={v1.x} y1={v1.y} x2={v2.x} y2={v2.y} stroke={STROKE_COLOR} />
            </React.Fragment>
          );
        })}

        {/* 4. HORIZONTAL RAYS (Wall lines) */}
        {Array.from({ length: rows + 1 }).map((_, i) => {
          const v = i / rows;
          const l1 = getScreenPoint(0, v, 0, back, outer);
          const l2 = getScreenPoint(0, v, 1, back, outer);
          const r1 = getScreenPoint(1, v, 0, back, outer);
          const r2 = getScreenPoint(1, v, 1, back, outer);
          const h1 = getScreenPoint(0, v, 1, back, outer);
          const h2 = getScreenPoint(1, v, 1, back, outer);

          return (
            <React.Fragment key={`h-ray-${i}`}>
              <line x1={l1.x} y1={l1.y} x2={l2.x} y2={l2.y} stroke={STROKE_COLOR} />
              <line x1={r1.x} y1={r1.y} x2={r2.x} y2={r2.y} stroke={STROKE_COLOR} />
              <line x1={h1.x} y1={h1.y} x2={h2.x} y2={h2.y} stroke={STROKE_COLOR} />
            </React.Fragment>
          );
        })}

        {/* 5. CORNER LINES */}
        <line x1={outer.x} y1={outer.y} x2={back.x} y2={back.y} stroke={STROKE_COLOR} />
        <line x1={outer.x + outer.w} y1={outer.y} x2={back.x + back.w} y2={back.y} stroke={STROKE_COLOR} />
        <line x1={outer.x} y1={outer.y + outer.h} x2={back.x} y2={back.y + back.h} stroke={STROKE_COLOR} />
        <line x1={outer.x + outer.w} y1={outer.y + outer.h} x2={back.x + back.w} y2={back.y + back.h} stroke={STROKE_COLOR} />
      </svg>
    </div>
  );
}