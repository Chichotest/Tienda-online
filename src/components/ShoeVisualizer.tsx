import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface ShoeVisualizerProps {
  lacesColor: string; // hex or descriptive name
  lacesType: "organza" | "algodon" | "hemp" | "satin";
  embroideryTheme: "girasoles" | "mar" | "gotico" | "estrellas" | "ninguno";
  customLettering: string;
  className?: string;
}

export default function ShoeVisualizer({
  lacesColor,
  lacesType,
  embroideryTheme,
  customLettering,
  className = "",
}: ShoeVisualizerProps) {
  const [viewMode, setViewMode] = useState<"vector" | "real">("real");

  useEffect(() => {
    if (embroideryTheme === "girasoles") {
      setViewMode("real");
    } else {
      setViewMode("vector");
    }
  }, [embroideryTheme]);

  // Map lace colors to beautiful hex values for rendering
  const getLaceHex = (color: string) => {
    const col = color.toLowerCase();
    if (col.includes("rojo") || col.includes("carmesí") || col.includes("red")) return "#dc2626"; // red
    if (col.includes("verde") || col.includes("salvia") || col.includes("green")) return "#15803d"; // green
    if (col.includes("azul") || col.includes("mar") || col.includes("blue")) return "#1d4ed8"; // blue
    if (col.includes("amarillo") || col.includes("sol") || col.includes("yellow")) return "#eab308"; // yellow
    if (col.includes("negro") || col.includes("black")) return "#171717"; // black
    if (col.includes("oro") || col.includes("dorado") || col.includes("gold")) return "#d97706"; // gold
    if (col.includes("plata") || col.includes("silver")) return "#94a3b8"; // silver
    if (col.includes("cáñamo") || col.includes("hemp") || col.includes("yute")) return "#d6c3b0"; // hemp tan
    if (col.includes("crema") || col.includes("beige")) return "#f5f5f4"; // cream

    // If it's already a hex code, use it
    if (color.startsWith("#")) return color;

    return "#fca5a5"; // default organza red-pink
  };

  const laceHex = getLaceHex(lacesColor);

  return (
    <div id="shoe-visualizer-container" className={`relative flex items-center justify-center bg-stone-50 border border-stone-200 rounded-3xl p-6 overflow-hidden shadow-sm ${className}`}>
      {/* Background Subtle Sparkle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />

      {/* Floating Status Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <span className="text-[10px] tracking-widest uppercase bg-stone-950 text-white font-medium px-2 py-0.5 rounded-full shadow-sm">
          Vista previa {viewMode === "real" ? "Foto Real" : "Boceto 3D"}
        </span>
        {embroideryTheme !== "ninguno" && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] tracking-widest uppercase bg-amber-50 text-amber-800 border border-amber-200 font-medium px-2 py-0.5 rounded-full"
          >
            Bordado: {embroideryTheme}
          </motion.span>
        )}
      </div>

      {/* View Mode Toggle */}
      {embroideryTheme === "girasoles" && (
        <div className="absolute top-4 right-4 z-20 flex bg-white/90 backdrop-blur-xs p-1 rounded-full border border-stone-200 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("real")}
            className={`px-3 py-1.5 text-[10px] font-sans font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer ${
              viewMode === "real"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Foto Real
          </button>
          <button
            type="button"
            onClick={() => setViewMode("vector")}
            className={`px-3 py-1.5 text-[10px] font-sans font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer ${
              viewMode === "vector"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Boceto 3D
          </button>
        </div>
      )}

      <div className="w-full max-w-sm md:max-w-md aspect-square flex items-center justify-center relative">
        {viewMode === "real" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full relative flex items-center justify-center p-2"
          >
            <img
              src="/images/zapatillas_girasoles.jpeg"
              alt="Zapatillas de Girasoles"
              className="w-full h-full object-cover rounded-[24px] shadow-sm transition-transform duration-500 hover:scale-[1.02]"
              onError={(e) => {
                const img = e.currentTarget;
                const currentSrc = img.src;
                try {
                  const urlPath = new URL(currentSrc, window.location.origin).pathname;
                  if (urlPath.startsWith("/images/")) {
                    const extensions = ["jpeg", "jpg", "png", "webp"];
                    const attemptAttr = img.getAttribute("data-attempt");
                    const attempt = attemptAttr ? parseInt(attemptAttr) : 0;
                    
                    if (attempt < extensions.length) {
                      img.setAttribute("data-attempt", (attempt + 1).toString());
                      const baseName = urlPath.substring(0, urlPath.lastIndexOf("."));
                      const extMatch = urlPath.match(/\.([a-zA-Z]+)$/);
                      const currentExt = extMatch ? extMatch[1].toLowerCase() : "";
                      
                      let targetExt = extensions[attempt];
                      if (targetExt === currentExt) {
                        const nextIdx = (attempt + 1) % extensions.length;
                        targetExt = extensions[nextIdx];
                        img.setAttribute("data-attempt", (attempt + 2).toString());
                      }
                      
                      img.src = `${baseName}.${targetExt}`;
                      return;
                    }
                  }
                } catch (err) {
                  console.warn("Error resolving image fallback extension:", err);
                }
                img.onerror = null;
                img.src = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&h=450&q=80";
              }}
            />
            {customLettering && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-stone-200/60 shadow-md px-4 py-2 rounded-full text-[10px] font-mono tracking-widest text-stone-700 font-bold uppercase whitespace-nowrap">
                Personalizado: "{customLettering}"
              </div>
            )}
          </motion.div>
        ) : (
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          {/* DEFINITIONS FOR GRADIENTS AND PATTERNS */}
          <defs>
            <linearGradient id="soleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#faf9f6" />
              <stop offset="90%" stopColor="#e7e5e4" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </linearGradient>
            <linearGradient id="canvasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#fafaf9" />
              <stop offset="100%" stopColor="#f3f4f6" />
            </linearGradient>
            <linearGradient id="embroideryGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
            <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* SNEAKER SOLE shadow */}
          <path
            d="M50,420 C100,430 400,430 450,420 C420,440 80,440 50,420"
            fill="#d6d3d1"
            opacity="0.6"
          />

          {/* SNEAKER MAIN BODY - CANVAS HIGHTOP */}
          <g filter="url(#shadow)">
            {/* Inner Tongue backing */}
            <path
              d="M300,140 L345,160 L320,300 L270,290 Z"
              fill="#e5e5e5"
              stroke="#cccccc"
              strokeWidth="2"
            />

            {/* Main Boot Body Canvas */}
            <path
              d="M90,390 
                 C80,310 90,190 120,160 
                 C130,150 170,165 190,175 
                 C200,180 215,220 220,240 
                 L295,290 
                 C335,310 395,350 435,390
                 C425,405 390,410 350,410
                 C240,410 120,405 90,390 Z"
              fill="url(#canvasGrad)"
              stroke="#e4e4e7"
              strokeWidth="3"
            />

            {/* Inner lining / Piping trim around top */}
            <path
              d="M120,160 C130,150 170,165 190,175"
              stroke="#d4d4d8"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Heel patch reinforcement stripe (back of shoe) */}
            <path
              d="M90,390 C85,340 92,230 115,165"
              stroke="#e4e7eb"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* White Ankle Circle Patch (Converse Style) */}
            <circle cx="150" cy="230" r="34" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2" />
            <circle cx="150" cy="230" r="30" fill="none" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
            
            {/* Custom Lettering inside Ankle Patch */}
            <g>
              {customLettering ? (
                <text
                  x="150"
                  y="235"
                  textAnchor="middle"
                  fill="#1c1917"
                  className="font-serif font-bold text-lg tracking-widest"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                >
                  {customLettering.substring(0, 4).toUpperCase()}
                </text>
              ) : (
                <>
                  {/* Decorative Celtic Emblem or Star */}
                  <path
                    d="M150,212 L153,223 L164,223 L155,230 L158,241 L150,234 L142,241 L145,230 L136,223 L147,223 Z"
                    fill="#d97706"
                  />
                  <text
                    x="150"
                    y="253"
                    textAnchor="middle"
                    fill="#78716c"
                    className="text-[7px] font-mono tracking-wider font-bold"
                  >
                    ALMA & HEBRA
                  </text>
                </>
              )}
            </g>

            {/* Stitching lines details along panel seams */}
            <path
              d="M125,185 C145,195 190,205 210,245"
              stroke="#d4d4d8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              fill="none"
            />
            <path
              d="M210,255 C230,270 270,290 295,290"
              stroke="#d4d4d8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              fill="none"
            />
            <path
              d="M295,295 C335,320 375,345 425,392"
              stroke="#d4d4d8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              fill="none"
            />
          </g>

          {/* DYNAMIC EMBROIDERY LAYER */}
          <g id="embroidery-artwork">
            {embroideryTheme === "girasoles" && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Large Sunflower Base center-right of the sneaker */}
                {/* Green Leaves first */}
                <path d="M220,290 C200,280 180,300 200,315 Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
                <path d="M280,310 C300,300 320,320 300,335 Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
                <path d="M240,330 C220,350 210,380 240,385 Z" fill="#16a34a" stroke="#166534" strokeWidth="1" />
                
                {/* Petals layer 1 */}
                <g fill="#f59e0b" stroke="#d97706" strokeWidth="1">
                  <path d="M250,320 C235,290 265,290 250,320" />
                  <path d="M250,320 C280,305 280,335 250,320" />
                  <path d="M250,320 C265,350 235,350 250,320" />
                  <path d="M250,320 C220,335 220,305 250,320" />
                  
                  {/* Diagonal petals */}
                  <path d="M250,320 C225,300 245,280 250,320" />
                  <path d="M250,320 C275,300 295,320 250,320" />
                  <path d="M250,320 C275,340 255,360 250,320" />
                  <path d="M250,320 C225,340 205,320 250,320" />
                </g>

                {/* Sunflower Center Seed Mound (textured French knots look) */}
                <circle cx="250" cy="320" r="14" fill="#451a03" stroke="#270e01" strokeWidth="1.5" />
                <circle cx="250" cy="320" r="11" fill="none" stroke="#78350f" strokeWidth="2" strokeDasharray="2,2" />
                
                {/* Secondary Wildflowers & Lavender (Tall stems) */}
                {/* Lavender stems */}
                <path d="M190,360 C180,310 175,280 185,270" stroke="#166534" strokeWidth="1.5" fill="none" />
                <ellipse cx="185" cy="270" rx="3" ry="5" fill="#a855f7" />
                <ellipse cx="183" cy="278" rx="3" ry="5" fill="#c084fc" />
                <ellipse cx="186" cy="286" rx="3" ry="5" fill="#a855f7" />
                <ellipse cx="184" cy="294" rx="3" ry="5" fill="#c084fc" />

                <path d="M210,370 C205,330 200,310 205,295" stroke="#166534" strokeWidth="1.5" fill="none" />
                <ellipse cx="205" cy="295" rx="3" ry="5" fill="#a855f7" />
                <ellipse cx="203" cy="301" rx="3" ry="5" fill="#c084fc" />
                <ellipse cx="206" cy="308" rx="3" ry="5" fill="#a855f7" />

                {/* Blue Daisy */}
                <circle cx="310" cy="350" r="4" fill="#3b82f6" />
                <g fill="#60a5fa">
                  <circle cx="310" cy="342" r="3" />
                  <circle cx="318" cy="350" r="3" />
                  <circle cx="310" cy="358" r="3" />
                  <circle cx="302" cy="350" r="3" />
                  <circle cx="315" cy="344" r="3" />
                  <circle cx="315" cy="356" r="3" />
                  <circle cx="305" cy="356" r="3" />
                  <circle cx="305" cy="344" r="3" />
                </g>
                <circle cx="310" cy="350" r="2.5" fill="#f59e0b" />
                <path d="M310,358 C312,380 305,385 300,390" stroke="#166534" strokeWidth="1.2" fill="none" />

                {/* Little red buds */}
                <circle cx="280" cy="365" r="3" fill="#ef4444" />
                <path d="M280,365 L285,385" stroke="#166534" strokeWidth="1" />
                <circle cx="285" cy="360" r="2" fill="#f43f5e" />
              </motion.g>
            )}

            {embroideryTheme === "mar" && (
              <motion.g
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Deep sea waves in stitch style */}
                <path
                  d="M100,380 Q140,340 180,370 T260,350 T340,370 T420,340"
                  stroke="#1d4ed8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M110,385 Q150,355 190,380 T270,360 T350,380 T415,355"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M125,390 Q160,370 200,390 T280,375 T360,390 T410,370"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="4,2"
                />
                {/* Spiral crest wave under the ankle patch */}
                <path
                  d="M240,300 C220,270 180,270 180,300 C180,320 200,330 215,315 C220,310 215,300 205,305 C200,310 205,315 210,312"
                  stroke="#1d4ed8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Small silver star sparkles representing light on water */}
                <path d="M140,280 L142,284 L146,284 L143,286 L144,290 L140,287 L136,290 L137,286 L134,284 L138,284 Z" fill="#cbd5e1" />
                <path d="M290,260 L291,263 L294,263 L292,265 L293,268 L290,266 L287,268 L288,265 L286,263 L289,263 Z" fill="#e2e8f0" />
                <path d="M340,310 L341,313 L344,313 L342,315 L343,318 L340,316 L337,318 L338,315 L336,313 L339,313 Z" fill="#94a3b8" />
              </motion.g>
            )}

            {embroideryTheme === "gotico" && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Thorny vines wrapped around */}
                <path
                  d="M100,360 C140,310 220,280 270,310 C310,330 380,330 420,375"
                  stroke="#171717"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Thorns */}
                <path d="M130,325 L125,315" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                <path d="M170,305 L175,295" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                <path d="M220,295 L223,285" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                <path d="M255,305 L263,298" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                <path d="M300,318 L296,328" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                <path d="M340,325 L346,317" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                <path d="M380,340 L388,332" stroke="#171717" strokeWidth="3" strokeLinecap="round" />

                {/* Gothic Black and Dark Red Roses */}
                {/* Rose 1 at center */}
                <circle cx="200" cy="300" r="10" fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />
                <path d="M195,295 C198,290 202,290 205,295" stroke="#fca5a5" strokeWidth="1" fill="none" />
                <path d="M193,300 C197,305 203,305 207,300" stroke="#fca5a5" strokeWidth="1" fill="none" />
                
                {/* Rose 2 on right */}
                <circle cx="310" cy="325" r="12" fill="#7f1d1d" stroke="#171717" strokeWidth="2" />
                <path d="M305,320 C310,315 315,318 315,322" stroke="#ef4444" strokeWidth="1" fill="none" />

                {/* Little metal droplets / silver beads */}
                <circle cx="240" cy="330" r="2.5" fill="#94a3b8" />
                <circle cx="280" cy="345" r="2.5" fill="#e2e8f0" />
                <circle cx="160" cy="320" r="2" fill="#cbd5e1" />
              </motion.g>
            )}

            {embroideryTheme === "estrellas" && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Sparkling constellation motifs in gold thread */}
                <g fill="#d97706" stroke="#b45309" strokeWidth="1">
                  {/* Constellation lines */}
                  <line x1="220" y1="280" x2="260" y2="330" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="260" y1="330" x2="310" y2="300" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="310" y1="300" x2="360" y2="350" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="180" y1="340" x2="220" y2="280" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" />

                  {/* Star 1 - Huge gold star */}
                  <path d="M220,268 L223,277 L232,277 L225,283 L227,292 L220,286 L213,292 L215,283 L208,277 L217,277 Z" fill="#fbbf24" />
                  {/* Star 2 */}
                  <path d="M260,320 L262,326 L268,326 L263,330 L265,336 L260,332 L255,336 L257,330 L252,326 L258,326 Z" fill="#fbbf24" />
                  {/* Star 3 */}
                  <path d="M310,290 L311.5,294.5 L316,294.5 L312.5,297.5 L314,302 L310,299 L306,302 L307.5,297.5 L304,294.5 L308.5,294.5 Z" fill="#f59e0b" />
                  {/* Star 4 */}
                  <path d="M360,340 L361.5,344.5 L366,344.5 L362.5,347.5 L364,352 L360,349 L356,352 L357.5,347.5 L354,344.5 L358.5,344.5 Z" fill="#fbbf24" />
                  {/* Star 5 */}
                  <path d="M180,330 L181.5,334.5 L186,334.5 L182.5,337.5 L184,342 L180,339 L176,342 L177.5,337.5 L174,334.5 L178.5,334.5 Z" fill="#f59e0b" />
                  
                  {/* Scattered stardust dots */}
                  <circle cx="210" cy="310" r="1.5" fill="#fef08a" />
                  <circle cx="240" cy="300" r="2.5" fill="#fef08a" />
                  <circle cx="290" cy="320" r="2" fill="#fbbf24" />
                  <circle cx="340" cy="280" r="1.5" fill="#fef08a" />
                  <circle cx="320" cy="340" r="2.5" fill="#fef08a" />
                  <circle cx="280" cy="270" r="1.5" fill="#fbbf24" />
                </g>
                {/* Crescent Golden Moon near top heel */}
                <path
                  d="M120,290 A 20,20 0 1,0 145,310 A 15,15 0 1,1 120,290"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="1"
                />
              </motion.g>
            )}
          </g>

          {/* SNEAKER FRONT RUBBER TOE CAP */}
          <g>
            <path
              d="M405,380 
                 C410,360 440,360 455,375
                 C465,385 465,395 460,405
                 C445,410 425,410 405,390"
              fill="#faf9f6"
              stroke="#e4e4e7"
              strokeWidth="2"
            />
            {/* Thread ribs on rubber toe */}
            <path d="M430,368 C432,375 435,395 435,406" stroke="#e4e4e7" strokeWidth="1" />
            <path d="M440,371 C443,378 447,395 445,408" stroke="#e4e4e7" strokeWidth="1" />
          </g>

          {/* FRONT SOLE LAYER */}
          <path
            d="M90,390 
               C110,405 240,410 350,410
               C395,410 435,405 460,405
               C465,412 450,422 415,422
               C315,422 170,422 90,412
               C85,402 85,395 90,390 Z"
            fill="url(#soleGrad)"
            stroke="#d4d4d8"
            strokeWidth="2.5"
          />
          {/* Black horizontal rubber stripe in the sole */}
          <path
            d="M93,401 C140,411 260,413 360,413 C410,413 445,409 456,409"
            stroke="#1c1917"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Red horizontal accent stripe below the black stripe */}
          <path
            d="M95,407 C140,416 260,418 360,418 C400,418 430,415 445,415"
            stroke="#991b1b"
            strokeWidth="1.5"
            fill="none"
          />

          {/* SNEAKER GROMMETS / EYELETS */}
          <g fill="#e4e4e7" stroke="#a1a1aa" strokeWidth="1.5">
            <circle cx="245" cy="285" r="5" />
            <circle cx="265" cy="305" r="5" />
            <circle cx="285" cy="325" r="5" />
            <circle cx="305" cy="345" r="5" />
            <circle cx="325" cy="365" r="5" />
            <circle cx="345" cy="385" r="5" />
          </g>

          {/* SNEAKER LACES AND LARGE BOW (DYNAMIC COLORS) */}
          <g>
            {/* Laces weaved between eyelets */}
            <g stroke={laceHex} strokeWidth={lacesType === "organza" ? "6" : "4.5"} strokeLinecap="round" opacity="0.95">
              {/* Back weaving laces */}
              <line x1="245" y1="285" x2="265" y2="305" />
              <line x1="265" y1="305" x2="285" y2="325" />
              <line x1="285" y1="325" x2="305" y2="345" />
              <line x1="305" y1="345" x2="325" y2="365" />
              <line x1="325" y1="365" x2="345" y2="385" />
              
              {/* Criss-crossing front laces */}
              <line x1="265" y1="282" x2="245" y2="285" opacity="0.8" />
              <line x1="285" y1="302" x2="265" y2="305" opacity="0.8" />
              <line x1="305" y1="322" x2="285" y2="325" opacity="0.8" />
              <line x1="325" y1="342" x2="305" y2="345" opacity="0.8" />
              <line x1="345" y1="362" x2="325" y2="365" opacity="0.8" />
            </g>

            {/* ORGANZA RIBBON SPECIALLY SHAPED BOW (Wide, translucent) */}
            {lacesType === "organza" ? (
              <motion.g
                key={`bow-organza-${laceHex}`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                {/* Large translucent bow loops */}
                {/* Left loop */}
                <path
                  d="M240,285 C170,220 180,310 240,285"
                  fill={laceHex}
                  fillOpacity="0.45"
                  stroke={laceHex}
                  strokeWidth="2"
                />
                <path
                  d="M240,285 C185,240 195,295 240,285"
                  fill="#ffffff"
                  fillOpacity="0.2"
                />
                
                {/* Right loop */}
                <path
                  d="M240,285 C310,220 300,310 240,285"
                  fill={laceHex}
                  fillOpacity="0.45"
                  stroke={laceHex}
                  strokeWidth="2"
                />
                <path
                  d="M240,285 C295,240 285,295 240,285"
                  fill="#ffffff"
                  fillOpacity="0.2"
                />

                {/* Bow knot center */}
                <rect x="233" y="278" width="14" height="14" rx="7" fill={laceHex} stroke="#ffffff" strokeWidth="1" />

                {/* Hanging ribbon tails */}
                <path
                  d="M238,285 C220,320 180,340 190,360"
                  stroke={laceHex}
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M242,285 C250,320 290,330 285,365"
                  stroke={laceHex}
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />
              </motion.g>
            ) : (
              /* STANDARD COMPACT COTTON KNOT LACES */
              <motion.g
                key={`bow-cotton-${laceHex}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                {/* Small loops */}
                <path d="M245,285 C220,260 220,295 245,285" stroke={laceHex} strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M245,285 C270,260 270,295 245,285" stroke={laceHex} strokeWidth="4" fill="none" strokeLinecap="round" />
                {/* Small knot */}
                <circle cx="245" cy="285" r="4.5" fill={laceHex} />
                {/* Small hanging ends */}
                <path d="M243,285 C235,305 220,310 225,320" stroke={laceHex} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M247,285 C252,305 265,310 260,320" stroke={laceHex} strokeWidth="3" fill="none" strokeLinecap="round" />
              </motion.g>
            )}
          </g>
        </svg>
        )}
      </div>
    </div>
  );
}
