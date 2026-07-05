import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, ShieldCheck, TicketCheck, FileText, Truck, Sparkles } from "lucide-react";
import { CartItem } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  
  // Shipping form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [payMethod, setPayMethod] = useState("tarjeta");

  const [orderId, setOrderId] = useState("");

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.product.price + (item.customization?.priceAdjustment || 0);
    return acc + itemPrice * item.quantity;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !email) return;

    // Generate a unique artisanal order serial number
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const dateCode = new Date().toISOString().substring(2, 10).replace(/-/g, "");
    setOrderId(`AH-${dateCode}-${randomNum}`);

    setStep("success");
  };

  const handleFinish = () => {
    onClearCart();
    setStep("form");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-950/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto font-serif"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="bg-[#fcfbf9] rounded-[32px] border border-natural-border shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-8"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-natural-border flex justify-between items-center bg-white">
              <span className="text-xs font-bold text-natural-dark font-serif">
                {step === "form" ? "Tramitación del Pedido" : "¡Taller Confirmado!"}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-natural-bg rounded-full text-[#8a8a7a] hover:text-stone-800 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            {step === "form" ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <div className="bg-natural-card-bg p-4 rounded-2xl border border-natural-border space-y-1.5 mb-2 font-sans">
                  <div className="flex justify-between text-xs text-[#7a7a6a] font-medium">
                    <span>Resumen de Creación</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} artículo(s)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-natural-dark pt-2 border-t border-natural-border">
                    <span>Importe Total</span>
                    <span>{subtotal}€</span>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-natural-dark text-sm">Dirección de Envío</h3>
                
                <div className="grid grid-cols-1 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#8a8a7a] font-sans font-bold block mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Lucía Álvarez González"
                      className="w-full text-xs px-3.5 py-2.5 border border-natural-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-natural-accent font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#8a8a7a] font-sans font-bold block mb-1">Calle, Número, Piso y Puerta</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej: Calle de Hortaleza 12, 3º Izq"
                      className="w-full text-xs px-3.5 py-2.5 border border-natural-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-natural-accent font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-[#8a8a7a] font-sans font-bold block mb-1">Localidad / Ciudad</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ej: Madrid"
                        className="w-full text-xs px-3.5 py-2.5 border border-natural-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-natural-accent font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-[#8a8a7a] font-sans font-bold block mb-1">Código Postal</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Ej: 28004"
                        className="w-full text-xs px-3.5 py-2.5 border border-natural-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-natural-accent font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-[#8a8a7a] font-sans font-bold block mb-1">Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: 612345678"
                        className="w-full text-xs px-3.5 py-2.5 border border-natural-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-natural-accent font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-[#8a8a7a] font-sans font-bold block mb-1">Email de Contacto</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ej: lucia@example.com"
                        className="w-full text-xs px-3.5 py-2.5 border border-natural-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-natural-accent font-sans"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-natural-dark text-sm pt-2">Método de Pago Seguro</h3>
                <div className="grid grid-cols-3 gap-2 text-xs font-sans">
                  {[
                    { id: "tarjeta", label: "💳 Tarjeta" },
                    { id: "bizum", label: "📱 Bizum" },
                    { id: "paypal", label: "🅿️ PayPal" },
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setPayMethod(pay.id)}
                      className={`py-2 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                        payMethod === pay.id
                          ? "bg-natural-accent text-[#f5f5f0] border-natural-accent shadow-sm"
                          : "bg-white text-natural-text border-natural-border hover:bg-natural-bg"
                      }`}
                    >
                      {pay.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2.5 text-[10px] text-natural-text leading-normal bg-natural-card-bg p-3.5 rounded-xl border border-natural-border font-sans">
                  <Truck className="w-4 h-4 text-natural-accent shrink-0 mt-0.5" />
                  <span>
                    <strong>Envío Postal Asegurado Gratuito:</strong> Proporcionamos número de seguimiento en cuanto el paquete abandone el taller. Embalaje ecológico premium de cartón reciclado con virutas de madera protectoras.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-natural-accent hover:bg-natural-accent-hover text-[#f5f5f0] font-bold font-sans text-xs uppercase tracking-widest rounded-full py-4 shadow-sm transition-all mt-4 cursor-pointer"
                >
                  Confirmar Pedido y Enviar a Taller ({subtotal}€)
                </button>
              </form>
            ) : (
              /* EXQUISITE SUCCESS DISPLAY WITH CUSTOM CERTIFICATE OF UNIQUE CRAFT */
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center bg-natural-card-bg/20">
                <div className="w-12 h-12 rounded-full bg-natural-card-bg border border-natural-border flex items-center justify-center text-natural-accent mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="font-serif font-bold text-natural-dark text-lg">Hemos recibido tu encargo</h3>
                  <p className="font-sans text-xs text-[#8a8a7a] mt-1 max-w-sm mx-auto">
                    Tu pago ha sido procesado de forma segura. El artesano jefe ha enhebrado la aguja para comenzar a dar vida a tus piezas únicas.
                  </p>
                </div>

                {/* CERTIFICATE COMPONENT */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border-4 border-natural-accent/15 p-6 rounded-[24px] relative overflow-hidden shadow-md text-left space-y-4"
                  style={{ backgroundImage: "radial-gradient(#fbfaf7 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                >
                  {/* Intricate Corner borders for certificate aesthetic */}
                  <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-950/5 pointer-events-none" />
                  
                  {/* Watermark Logo design behind */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none font-serif text-[120px] font-bold text-stone-900 select-none">
                    A&H
                  </div>

                  <div className="text-center space-y-1 relative z-10">
                    <span className="text-[9px] uppercase tracking-widest font-sans text-natural-accent font-bold bg-natural-card-bg border border-natural-border px-3 py-0.5 rounded-full inline-block mb-1">
                      Taller Alma & Hebra
                    </span>
                    <h4 className="font-serif font-bold text-natural-dark text-md uppercase tracking-wider">
                      Certificado de Autenticidad
                    </h4>
                    <p className="text-[8px] text-[#8a8a7a] font-sans font-semibold">
                      DOCUMENTO DE ORDEN ARTESANAL • {orderId}
                    </p>
                  </div>

                  <div className="text-xs text-natural-text leading-relaxed space-y-3 pt-3 border-t border-[#ecece4] relative z-10 font-serif">
                    <p>
                      Por la presente, el taller artesano de <strong className="text-natural-dark">Alma & Hebra</strong> certifica que los siguientes encargos se están elaborando a mano de forma individual, con materiales selectos y bordados exclusivos, para:
                    </p>
                    
                    <div className="bg-natural-card-bg p-3 rounded-xl border border-natural-border font-sans space-y-2">
                      <p className="text-[10px] text-[#8a8a7a] font-bold tracking-widest leading-none">DESTINATARIO CERTIFICADO:</p>
                      <p className="text-xs font-bold text-natural-dark leading-none">{name.toUpperCase()}</p>
                      
                      <div className="text-[10px] text-natural-text space-y-1.5 pt-2 border-t border-natural-border/60">
                        {cartItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between font-mono text-[9px]">
                            <span className="truncate max-w-[200px]">
                              • {item.quantity}x {item.product.name} 
                              {item.selectedSize ? ` (Talla ${item.selectedSize})` : ""}
                              {item.customization?.customLettering ? ` [Bordado: ${item.customization.customLettering.toUpperCase()}]` : ""}
                            </span>
                            <span className="shrink-0">
                              {(item.product.price + (item.customization?.priceAdjustment || 0)) * item.quantity}€
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed italic text-[#7a7a6a] pt-1">
                      "Cada puntada de hilo, cada corte de cuero y cada engaste de metal lleva consigo el alma de nuestro oficio. No existen dos piezas idénticas en nuestro taller."
                    </p>
                  </div>

                  {/* Signatures & Seal */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#ecece4] relative z-10">
                    <div className="text-[9px] text-[#8a8a7a] font-mono">
                      <p>FECHA: {new Date().toLocaleDateString("es-ES")}</p>
                      <p>MADRID, ESPAÑA</p>
                    </div>

                    {/* Red wax seal simulation */}
                    <div className="relative flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#a64d4d] border border-[#803333] flex items-center justify-center text-[#f5f5f0] font-serif font-bold text-xs shadow-inner transform rotate-12">
                        A&H
                      </div>
                      <div className="absolute -top-1 -right-1 text-natural-accent">
                        <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
                      </div>
                    </div>

                    <div className="text-right text-[10px] font-sans">
                      <p className="font-serif italic font-bold text-natural-dark leading-none">N. Álvarez</p>
                      <p className="text-[8px] text-[#8a8a7a] font-sans mt-1 font-medium">Maestro Bordador</p>
                    </div>
                  </div>
                </motion.div>

                <p className="font-sans text-[10px] text-[#8a8a7a] leading-relaxed">
                  Se ha enviado una copia digital de este certificado y tu factura de compra a su correo electrónico ({email}).
                </p>

                <button
                  onClick={handleFinish}
                  className="w-full bg-natural-accent hover:bg-natural-accent-hover text-[#f5f5f0] font-bold font-sans text-xs uppercase tracking-widest rounded-full py-4 cursor-pointer"
                >
                  Volver a la Tienda
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
