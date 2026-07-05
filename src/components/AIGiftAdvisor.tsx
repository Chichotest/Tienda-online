import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Sparkles, Heart, ShoppingBag, Euro } from "lucide-react";
import { GiftAdvice, Product } from "../types";

interface AIGiftAdvisorProps {
  onAddCustomSuggested: (type: "pendientes" | "pulseras" | "zapatillas", name: string, customIdea: string) => void;
}

const STYLE_OPTIONS = [
  { label: "🌻 Cottagecore / Floral", val: "Cottagecore / Naturaleza y flores" },
  { label: "🔮 Místico / Celta / Gótico", val: "Místico, mitología celta y gótico" },
  { label: "🎨 Divertido / Retro / Quirky", val: "Divertido, retro y estilo alternativo" },
  { label: "🤍 Minimalista / Elegante", val: "Minimalista, sobrio y elegante" },
];

export default function AIGiftAdvisor({ onAddCustomSuggested }: AIGiftAdvisorProps) {
  const [recipient, setRecipient] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState(50);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<GiftAdvice | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !style) return;

    setLoading(true);
    setAdvice(null);

    try {
      const response = await fetch("/api/gift-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, style, budget }),
      });

      if (!response.ok) throw new Error("Error getting gift advice");
      const data: GiftAdvice = await response.json();
      setAdvice(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-gift-advisor-panel" className="bg-white border border-natural-border rounded-[32px] p-6 shadow-sm font-serif">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-natural-accent rounded-2xl text-[#f5f5f0]">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-natural-dark">Buscador de Regalos IA</h3>
          <p className="font-sans text-xs text-[#8a8a7a]">¿No sabes qué elegir? Déjate aconsejar por nuestra IA artesana</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Input */}
        <div>
          <label className="text-xs font-semibold text-[#8a8a7a] uppercase tracking-widest font-sans block mb-1.5">
            ¿Para quién es el regalo?
          </label>
          <input
            type="text"
            required
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Ej: Mi mejor amiga Elena, mi madre, mi pareja..."
            className="w-full text-sm text-natural-dark px-4 py-3 border border-natural-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-natural-accent transition-all placeholder:text-stone-400 font-sans"
          />
        </div>

        {/* Style Selection */}
        <div>
          <label className="text-xs font-semibold text-[#8a8a7a] uppercase tracking-widest font-sans block mb-1.5">
            ¿Cuál es su estilo de vestir o personalidad?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans">
            {STYLE_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStyle(opt.val)}
                className={`text-xs px-3 py-2.5 rounded-xl border text-left transition-all font-medium cursor-pointer ${
                  style === opt.val
                    ? "bg-natural-accent text-[#f5f5f0] border-natural-accent shadow-sm"
                    : "bg-white text-natural-text border-natural-border hover:bg-natural-bg"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Selection */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-[#8a8a7a] uppercase tracking-widest font-sans">
              Presupuesto Aproximado
            </label>
            <span className="text-xs font-bold text-natural-accent bg-natural-card-bg border border-natural-border rounded-full px-2.5 py-0.5 shadow-sm flex items-center gap-1 font-sans">
              {budget}€ <Euro className="w-3 h-3 text-natural-accent" />
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={180}
            step={5}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-natural-accent bg-natural-border h-1 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#8a8a7a] font-mono mt-1">
            <span>15€</span>
            <span>180€</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !recipient.trim() || !style}
          className="w-full flex items-center justify-center gap-2 bg-natural-accent hover:bg-natural-accent-hover disabled:bg-natural-border disabled:text-natural-text/40 text-[#f5f5f0] font-bold font-sans text-xs uppercase tracking-widest rounded-full py-4 px-6 shadow-sm transition-all cursor-pointer"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
          {loading ? "Pensando en el regalo ideal..." : "Buscar Regalos Especiales"}
        </button>
      </form>

      {/* Result Display */}
      <AnimatePresence>
        {advice && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-6 border-t border-natural-border pt-5 space-y-4"
          >
            {/* Title & Justification */}
            <div className="bg-natural-card-bg/60 border border-natural-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-natural-accent fill-natural-accent animate-pulse" />
                <h4 className="font-serif font-bold text-natural-dark text-md">
                  {advice.recommendationTitle}
                </h4>
              </div>
              <p className="font-sans text-xs text-natural-text leading-relaxed">
                {advice.explanation}
              </p>
              {advice.isMock && (
                <span className="text-[9px] bg-natural-border text-natural-accent px-2.5 py-0.5 rounded-full mt-2 inline-block font-sans font-bold">
                  Sugerencia de la Tienda
                </span>
              )}
            </div>

            {/* Suggestions list */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#8a8a7a] font-sans block font-bold">
                Piezas sugeridas para {recipient}
              </span>

              {advice.suggestedProducts.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white border border-natural-border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold bg-natural-card-bg text-natural-text px-2.5 py-0.5 border border-natural-border rounded-full font-sans">
                        {item.productType}
                      </span>
                      <h5 className="font-serif font-bold text-natural-dark text-sm mt-1.5">
                        {item.name}
                      </h5>
                    </div>
                  </div>

                  <div className="bg-natural-card-bg p-3 rounded-xl border border-natural-border text-[11px] text-natural-text leading-relaxed font-sans">
                    <span className="font-bold block text-[9px] uppercase tracking-widest text-natural-accent mb-0.5">
                      Detalle de Personalización
                    </span>
                    {item.customizationIdea}
                  </div>

                  <button
                    onClick={() => onAddCustomSuggested(item.productType, item.name, item.customizationIdea)}
                    className="flex items-center justify-center gap-1.5 text-xs font-bold font-sans uppercase tracking-widest text-white bg-natural-accent hover:bg-natural-accent-hover rounded-full py-2.5 px-4 self-end transition-all shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Regalar esta pieza
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
