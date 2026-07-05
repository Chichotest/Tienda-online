import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RotateCcw, ShoppingBag, Eye, HelpCircle } from "lucide-react";
import { AICreatedDesign } from "../types";

interface AICoCreatorProps {
  onApplyDesign: (design: AICreatedDesign, themeType: "girasoles" | "mar" | "gotico" | "estrellas" | "ninguno") => void;
  onAddToCart: (customization: any, price: number) => void;
  currentLettering: string;
}

const SAMPLE_PROMPTS = [
  { label: "🌻 Girasoles de Otoño", text: "Girasoles grandes y florecientes con mariposas de color naranja cálido y pequeños brotes de lavanda." },
  { label: "🌊 Brisa del Océano", text: "Olas marinas artísticas con espirales, conchas de mar en tonos azul turquesa, marino y detalles de espuma plateada." },
  { label: "🥀 Rosas de Espinas Góticas", text: "Rosas rojas profundas, enredaderas de espinas negras y una luna creciente de plata mística." },
  { label: "✨ Constelación Estelar", text: "Un cielo de constelaciones doradas con hilos brillantes, pequeñas lunas y estrellas fugaces." },
];

export default function AICoCreator({ onApplyDesign, onAddToCart, currentLettering }: AICoCreatorProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [design, setDesign] = useState<AICreatedDesign | null>(null);
  const [applied, setApplied] = useState(false);

  // Loading animation message sequence
  const loadingMessages = [
    "Enhebrando aguja de sastre con hilos de algodón y seda natural...",
    "Dibujando los primeros trazos de tiza sobre la lona blanca...",
    "Seleccionando la paleta de tintes para las madejas de hilo...",
    "El maestro artesano está perfeccionando las puntadas tridimensionales...",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setDesign(null);
    setApplied(false);
    setLoadingStep(0);

    // Animate loading stages
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await fetch("/api/design-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Error generating design");
      const data: AICreatedDesign = await response.json();
      setDesign(data);
      
      // Determine the visual theme mapping for the SVG visualizer
      let visualTheme: "girasoles" | "mar" | "gotico" | "estrellas" | "ninguno" = "ninguno";
      const promptLower = prompt.toLowerCase();
      const conceptLower = data.conceptName.toLowerCase();
      
      if (promptLower.includes("girasol") || promptLower.includes("flor") || promptLower.includes("sol") || conceptLower.includes("girasol") || conceptLower.includes("otoño")) {
        visualTheme = "girasoles";
      } else if (promptLower.includes("mar") || promptLower.includes("ola") || promptLower.includes("azul") || promptLower.includes("agua") || conceptLower.includes("brisa") || conceptLower.includes("mar")) {
        visualTheme = "mar";
      } else if (promptLower.includes("gotic") || promptLower.includes("gotico") || promptLower.includes("rosa") || promptLower.includes("negro") || conceptLower.includes("eterna") || conceptLower.includes("gótico")) {
        visualTheme = "gotico";
      } else if (promptLower.includes("estrella") || promptLower.includes("constelación") || promptLower.includes("místico") || promptLower.includes("cielo") || conceptLower.includes("estelar") || conceptLower.includes("misticismo")) {
        visualTheme = "estrellas";
      } else {
        // Fallback to random theme for visual richness
        const themes: ("girasoles" | "mar" | "gotico" | "estrellas")[] = ["girasoles", "mar", "gotico", "estrellas"];
        visualTheme = themes[Math.floor(Math.random() * themes.length)];
      }

      // Automatically apply design to the visualizer
      onApplyDesign(data, visualTheme);
      setApplied(true);
    } catch (error) {
      console.error(error);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!design) return;
    onAddToCart({
      isAICreated: true,
      conceptName: design.conceptName,
      description: design.description,
      lacesColor: design.recommendedLaces,
      lacesType: design.recommendedLaces.toLowerCase().includes("organza") ? "organza" : "algodon",
      embroideryName: design.conceptName,
      customLettering: currentLettering || "A&H",
      embellishments: design.suggestedEmbellishments,
      priceAdjustment: design.customizationPrice - 65, // base price adjustment
    }, design.customizationPrice + 45); // customization + base shoe price (45€)
  };

  return (
    <div id="ai-co-creator-panel" className="bg-white border border-natural-border rounded-[32px] p-6 shadow-sm font-serif">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-natural-accent rounded-2xl text-[#f5f5f0]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-natural-dark">Co-creador de Diseños IA</h3>
          <p className="font-sans text-xs text-[#8a8a7a]">Describe tu idea y Gemini ideará un bordado de costura único</p>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Bordado de margaritas de colores pastel con hilos de seda, unas abejitas en relieve y cordón de cáñamo natural..."
          rows={3}
          className="w-full text-sm text-natural-dark p-4 border border-natural-border rounded-2xl focus:outline-none focus:ring-1 focus:ring-natural-accent transition-all placeholder:text-stone-400 bg-natural-card-bg/40 font-sans leading-relaxed"
        />

        {/* Quick helpers */}
        <div className="font-sans">
          <span className="text-[10px] uppercase tracking-widest text-[#8a8a7a] block mb-2 font-bold">Ideas de inicio rápido</span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(sample.text)}
                className="text-xs text-[#7a7a6a] bg-natural-card-bg/50 hover:bg-[#e2e2d5]/60 border border-natural-border rounded-xl px-3 py-1.5 transition-all text-left cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-natural-accent hover:bg-natural-accent-hover disabled:bg-natural-border disabled:text-natural-text/40 text-[#f5f5f0] font-bold font-sans text-xs uppercase tracking-widest rounded-full py-4 px-6 shadow-sm transition-all cursor-pointer"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-4 h-4 border-2 border-[#f5f5f0] border-t-transparent rounded-full"
            />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
          {loading ? "Diseñando tu boceto..." : "Crear Diseño por IA"}
        </button>
      </div>

      {/* Loading animation box */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-natural-card-bg border border-natural-border rounded-2xl p-4 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-0.5 h-6 bg-natural-accent rounded"
                />
                <div className="absolute w-2 h-2 rounded-full bg-natural-accent top-1 animate-pulse" />
              </div>
              <p className="font-sans text-xs text-natural-text font-semibold italic animate-pulse">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Design result box */}
      <AnimatePresence>
        {design && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 border-t border-[#ecece4] pt-5 space-y-4"
          >
            <div className="bg-natural-card-bg/60 border border-natural-border rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-serif font-bold text-natural-dark text-md">
                  ✨ {design.conceptName}
                </h4>
                <span className="text-sm font-semibold text-natural-accent font-sans">
                  {design.customizationPrice + 45}€
                </span>
              </div>
              <p className="font-sans text-xs text-[#7a7a6a] leading-relaxed">
                {design.description}
              </p>

              {design.isMock && (
                <span className="text-[9px] bg-natural-border text-natural-accent px-2.5 py-0.5 rounded-full mt-2 inline-block font-sans font-bold">
                  Boceto del Taller
                </span>
              )}
            </div>

            {/* Curated color palette */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8a8a7a] font-sans block mb-2 font-bold">
                Madejas de hilo seleccionadas
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {design.colorPalette.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white p-2 rounded-xl border border-natural-border"
                  >
                    <span
                      className="w-5 h-5 rounded-lg shrink-0 border border-stone-200"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-[#4a4a3a] font-semibold truncate leading-tight font-sans">
                        {color.name}
                      </p>
                      <p className="text-[8px] text-[#8a8a7a] font-mono truncate uppercase leading-none">
                        {color.hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-natural-card-bg border border-natural-border p-4 rounded-2xl">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#8a8a7a] block font-bold mb-0.5 font-sans">
                  Lazada Recomendada
                </span>
                <p className="text-[#4a4a3a] font-medium font-sans">
                  {design.recommendedLaces}
                </p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#8a8a7a] block font-bold mb-0.5 font-sans">
                  Adornos de Costura
                </span>
                <p className="text-[#4a4a3a] font-medium font-sans truncate">
                  {design.suggestedEmbellishments.join(", ")}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-natural-accent hover:bg-natural-accent-hover text-white font-bold font-sans text-xs uppercase tracking-widest rounded-full py-3.5 px-4 shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Añadir al carrito
              </button>
              <button
                onClick={() => {
                  setDesign(null);
                  setPrompt("");
                }}
                className="flex items-center justify-center p-3 text-stone-500 hover:text-stone-800 bg-natural-card-bg hover:bg-natural-border/30 border border-natural-border rounded-full transition-all cursor-pointer"
                title="Comenzar boceto de nuevo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
