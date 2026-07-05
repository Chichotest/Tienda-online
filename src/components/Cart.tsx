import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { CartItem } from "../types";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.product.price + (item.customization?.priceAdjustment || 0);
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-50"
          />

          {/* Sliding Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-[#fcfbf9] border-l border-natural-border shadow-2xl z-50 flex flex-col font-serif"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-natural-border flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-natural-accent" />
                <h3 className="font-serif font-bold text-natural-dark text-lg">Tu Cesta</h3>
                <span className="bg-natural-accent text-[#f5f5f0] text-xs font-bold font-sans px-2.5 py-0.5 rounded-full">
                  {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-natural-bg rounded-full text-[#8a8a7a] hover:text-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-natural-card-bg border border-natural-border flex items-center justify-center text-stone-300">
                    <ShoppingBag className="w-8 h-8 text-natural-accent" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-natural-dark text-md">Tu cesta está vacía</h4>
                    <p className="font-sans text-xs text-[#8a8a7a] max-w-xs mt-1">
                      Añade piezas de nuestro catálogo o diseña unas zapatillas personalizadas con ayuda de la IA.
                    </p>
                  </div>
                </div>
              ) : (
                cartItems.map((item) => {
                  const hasCustom = !!item.customization;
                  const itemPrice = item.product.price + (item.customization?.priceAdjustment || 0);

                  return (
                    <motion.div
                      layout
                      key={item.id}
                      className="bg-white border border-natural-border rounded-2xl p-4 flex gap-3 relative hover:border-natural-accent/30 transition-colors"
                    >
                      {/* Thumbnail Placeholder with color accents */}
                      <span className="w-12 h-12 rounded-xl border border-natural-border shrink-0 text-xl flex items-center justify-center" style={{ backgroundColor: item.product.colorAccent }}>
                        {item.product.category === "zapatillas" ? "👟" : item.product.category === "pulseras" ? "🤎" : "👄"}
                      </span>

                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif font-bold text-natural-dark text-sm leading-tight">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#8a8a7a] hover:text-red-500 transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price tag */}
                        <p className="text-xs font-bold text-natural-accent font-sans">
                          {itemPrice}€
                        </p>

                        {/* Customization indicators */}
                        {hasCustom && (
                          <div className="bg-natural-card-bg/60 border border-natural-border rounded-xl p-3 mt-1.5 space-y-1 text-[10px] text-natural-text leading-normal font-sans">
                            {item.customization?.isAICreated ? (
                              <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-natural-accent mb-1">
                                <Sparkles className="w-3 h-3" /> Diseñado por Co-Creador IA
                              </div>
                            ) : null}
                            
                            {item.customization?.conceptName && (
                              <p><span className="font-semibold text-natural-dark">Concepto:</span> {item.customization.conceptName}</p>
                            )}

                            {item.selectedSize && (
                              <p><span className="font-semibold text-natural-dark">Talla:</span> EU {item.selectedSize}</p>
                            )}
                            
                            {item.customization?.lacesColor && (
                              <p><span className="font-semibold text-natural-dark">Lazada:</span> {item.customization.lacesColor}</p>
                            )}

                            {item.customization?.customLettering && (
                              <p><span className="font-semibold text-natural-dark">Bordado talón:</span> "{item.customization.customLettering.toUpperCase()}"</p>
                            )}

                            {item.customization?.embroideryName && (
                              <p><span className="font-semibold text-natural-dark">Bordado lateral:</span> {item.customization.embroideryName}</p>
                            )}
                          </div>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-5 h-5 flex items-center justify-center bg-white border border-natural-border hover:bg-natural-bg disabled:opacity-50 text-natural-text rounded-md text-xs font-bold transition-all cursor-pointer font-sans"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-natural-dark font-sans">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center bg-white border border-natural-border hover:bg-natural-bg text-natural-text rounded-md text-xs font-bold transition-all cursor-pointer font-sans"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer with checkout details */}
            {cartItems.length > 0 && (
              <div className="px-6 py-5 border-t border-natural-border bg-white space-y-4">
                <div className="space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between text-[#7a7a6a]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-natural-dark">{subtotal}€</span>
                  </div>
                  <div className="flex justify-between text-[#7a7a6a]">
                    <span>Artesano en taller (Envío Asegurado)</span>
                    <span className="text-natural-accent font-bold">GRATIS</span>
                  </div>
                  <div className="flex justify-between text-natural-dark font-bold text-sm pt-2 border-t border-[#ecece4]">
                    <span>Total del Pedido</span>
                    <span className="text-natural-dark font-serif font-bold text-base">{subtotal}€</span>
                  </div>
                </div>

                <div className="bg-natural-card-bg border border-natural-border rounded-xl p-3 flex gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-natural-accent shrink-0 mt-0.5" />
                  <p className="font-sans text-[10px] text-[#7a7a6a] leading-normal">
                    <strong>Aviso de Taller:</strong> Al tratarse de artesanía y bordados a mano exclusivos, tu pedido requiere de 4 a 6 días laborables de confección antes de ser enviado de forma asegurada.
                  </p>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-natural-accent hover:bg-natural-accent-hover text-[#f5f5f0] font-bold font-sans text-xs uppercase tracking-widest rounded-full py-4 shadow-sm transition-all cursor-pointer"
                >
                  Proceder al Checkout Artesano
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
