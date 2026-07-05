import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Eye, Check, X, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Product } from "../types";

interface CatalogProps {
  products: Product[];
  onAddToCart: (product: Product, size?: string, customText?: string) => void;
}

export default function Catalog({ products, onAddToCart }: CatalogProps) {
  const [activeCategory, setActiveCategory] = useState<"todos" | "zapatillas" | "pulseras" | "pendientes">("todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Customization state for detail modal
  const [sneakerSize, setSneakerSize] = useState("38");
  const [sneakerLaces, setSneakerLaces] = useState("rojo_organza");
  const [sneakerInitials, setSneakerInitials] = useState("");
  const [heartColor, setHeartColor] = useState("plata");

  // Functional & Visual Filters
  const [priceFilter, setPriceFilter] = useState<"all" | "under30" | "under60" | "over60">("all");
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [photoFilter, setPhotoFilter] = useState<"none" | "warm" | "vintage" | "soft">("none");

  const getFilterStyle = (filter: string) => {
    switch (filter) {
      case "warm":
        return "sepia(0.2) saturate(1.2) contrast(1.02) brightness(0.98)";
      case "vintage":
        return "sepia(0.35) contrast(0.9) brightness(0.95) saturate(0.85)";
      case "soft":
        return "contrast(1.08) brightness(1.02) saturate(1.05)";
      default:
        return "none";
    }
  };

  const categories = [
    { id: "todos", label: "Colección Completa" },
    { id: "zapatillas", label: "Zapatillas Personalizadas" },
    { id: "pulseras", label: "Pulseras de Autor" },
    { id: "pendientes", label: "Pendientes Divertidos & Góticos" },
  ];

  const filteredProducts = activeCategory === "todos"
    ? products
    : products.filter(p => p.category === activeCategory);

  const finalFilteredProducts = filteredProducts.filter((product) => {
    // Price filter
    if (priceFilter === "under30" && product.price >= 30) return false;
    if (priceFilter === "under60" && (product.price < 30 || product.price >= 60)) return false;
    if (priceFilter === "over60" && product.price < 60) return false;

    // Customizable filter
    if (onlyCustomizable && !product.isCustomizable) return false;

    return true;
  });

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    // Reset selections
    setSneakerSize("38");
    setSneakerLaces("rojo_organza");
    setSneakerInitials("");
    setHeartColor("plata");
  };

  const handleAddFromDetail = () => {
    if (!selectedProduct) return;
    
    if (selectedProduct.category === "zapatillas") {
      onAddToCart(selectedProduct, sneakerSize, sneakerInitials);
    } else {
      onAddToCart(selectedProduct, undefined, undefined);
    }
    
    setSelectedProduct(null);
  };

  // Helper to render high quality craft icon/illustrations based on product
  const renderProductFallbackGraphic = (p: Product) => {
    const isSneaker = p.category === "zapatillas";
    const isBracelet = p.category === "pulseras";
    const isEarring = p.id.includes("labios") || p.id.includes("espinas") || p.id.includes("trisquel") || p.id.includes("fantasia");

    return (
      <div 
        className="w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden rounded-2xl group-hover:scale-102 transition-transform duration-500"
        style={{ backgroundColor: p.colorAccent }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Render elegant abstract crafts styling */}
        {isSneaker && (
          <div className="relative flex flex-col items-center">
            {/* Minimalist drawing representing the sunflowers high tops */}
            <span className="text-6xl filter drop-shadow-md">👟</span>
            <div className="absolute -bottom-2 flex gap-1 bg-white/95 backdrop-blur border border-amber-200 px-2.5 py-1 rounded-full text-[10px] text-amber-800 font-bold shadow-sm">
              🌻 Girasoles & Lazos
            </div>
          </div>
        )}

        {isBracelet && (
          <div className="relative flex flex-col items-center">
            <span className="text-6xl filter drop-shadow-md">🤎</span>
            <div className="absolute -bottom-2 flex gap-1 bg-white/95 backdrop-blur border border-stone-200 px-2.5 py-1 rounded-full text-[10px] text-stone-800 font-bold shadow-sm">
              Leather Ring Clasp
            </div>
          </div>
        )}

        {p.id.includes("labios") && (
          <div className="relative flex flex-col items-center">
            <span className="text-6xl filter drop-shadow-md">👄</span>
            <div className="absolute -bottom-2 flex gap-1 bg-white/95 backdrop-blur border-red-200 px-2.5 py-1 rounded-full text-[10px] text-red-800 font-bold shadow-sm">
              Lips & Teeth Hangers
            </div>
          </div>
        )}

        {p.id.includes("espinas") && (
          <div className="relative flex flex-col items-center">
            <span className="text-6xl filter drop-shadow-md">🖤</span>
            <div className="absolute -bottom-2 flex gap-1 bg-white/95 backdrop-blur border-stone-300 px-2.5 py-1 rounded-full text-[10px] text-stone-800 font-bold shadow-sm">
              Barbed Wire Heart
            </div>
          </div>
        )}

        {p.id.includes("trisquel") && (
          <div className="relative flex flex-col items-center">
            <span className="text-6xl filter drop-shadow-md">🌀</span>
            <div className="absolute -bottom-2 flex gap-1 bg-white/95 backdrop-blur border-amber-200 px-2.5 py-1 rounded-full text-[10px] text-amber-800 font-bold shadow-sm">
              Celtics Triskele
            </div>
          </div>
        )}

        {p.id.includes("fantasia") && (
          <div className="relative flex flex-col items-center">
            <span className="text-6xl filter drop-shadow-md">🕶️💿</span>
            <div className="absolute -bottom-2 flex gap-1 bg-white/95 backdrop-blur border-stone-200 px-2.5 py-1 rounded-full text-[10px] text-stone-800 font-bold shadow-sm">
              Mini Vinyls & Fun Shapes
            </div>
          </div>
        )}

        {/* Delicate Corner stitching lines representing the Hecho a mano feel */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-stone-400/30 border-dashed rounded-tl-lg" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-stone-400/30 border-dashed rounded-br-lg" />
      </div>
    );
  };

  return (
    <div id="catalog-section" className="space-y-6 font-serif">
      {/* Category Tabs & Interactive Filters */}
      <div className="space-y-4 border-b border-natural-border pb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`text-xs px-5 py-2.5 rounded-full font-sans transition-all duration-200 cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-natural-accent text-[#f5f5f0] border-natural-accent font-bold shadow-sm"
                  : "bg-white text-[#8a8a7a] border-natural-border hover:bg-natural-bg hover:text-natural-accent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters Panel with Photographic & Functional controls */}
        <div className="bg-natural-card-bg/60 border border-natural-border p-4 rounded-[24px] flex flex-wrap gap-4 items-center justify-between">
          {/* Functional Filters (Price & Customizable) */}
          <div className="flex flex-wrap gap-3 items-center text-xs font-sans">
            <span className="text-[#8a8a7a] font-bold uppercase tracking-widest text-[9px]">Filtrar por:</span>
            
            {/* Price Filter dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-natural-border shadow-2xs">
              <span className="text-[#8a8a7a] text-[10px] font-medium">Precio:</span>
              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="bg-transparent font-bold text-natural-dark focus:outline-none cursor-pointer text-[10px]"
              >
                <option value="all">Todos los precios</option>
                <option value="under30">Menos de 30€</option>
                <option value="under60">Menos de 60€</option>
                <option value="over60">Más de 60€</option>
              </select>
            </div>

            {/* Customizable toggle */}
            <button
              onClick={() => setOnlyCustomizable(!onlyCustomizable)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] transition-all cursor-pointer shadow-2xs ${
                onlyCustomizable 
                  ? "bg-natural-accent text-white border-natural-accent font-bold" 
                  : "bg-white text-natural-text border-natural-border hover:bg-natural-bg"
              }`}
            >
              <span>✨ Solo Personalizables</span>
            </button>
          </div>

          {/* Visual/Photographic Effects Filters */}
          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="text-[#8a8a7a] font-bold uppercase tracking-widest text-[9px]">Filtro de Foto:</span>
            <div className="flex bg-white p-1 rounded-full border border-natural-border gap-1 shadow-2xs">
              {[
                { id: "none", label: "Original" },
                { id: "warm", label: "Cálido 🔥" },
                { id: "vintage", label: "Vintage 📜" },
                { id: "soft", label: "Estudio 💡" }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPhotoFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all cursor-pointer ${
                    photoFilter === f.id
                      ? "bg-natural-accent text-white shadow-3xs"
                      : "text-[#8a8a7a] hover:bg-natural-bg"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalFilteredProducts.map((product) => (
          <motion.div
            layout
            key={product.id}
            id={`product-card-${product.id}`}
            whileHover={{ y: -4 }}
            className="group bg-white border border-natural-border rounded-[32px] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Visual Header */}
            <div className="relative mb-4 overflow-hidden rounded-[24px] aspect-[4/3] bg-stone-100">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  referrerPolicy="no-referrer"
                  style={{ filter: getFilterStyle(photoFilter) }}
                  className="w-full h-full object-cover rounded-[24px] transition-transform duration-500 group-hover:scale-105"
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
                    if (product.fallbackImage) {
                      img.src = product.fallbackImage;
                    }
                  }}
                />
              ) : (
                renderProductFallbackGraphic(product)
              )}
              
              {/* Product Badge */}
              {product.badge && (
                <span className="absolute top-3 left-3 bg-natural-accent text-[#f5f5f0] text-[9px] uppercase tracking-widest font-sans font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Visual Body */}
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-serif font-bold text-natural-dark text-md leading-snug group-hover:text-natural-accent transition-colors">
                  {product.name}
                </h4>
                <span className="text-md font-bold text-natural-accent shrink-0 font-sans">
                  {product.price}€
                </span>
              </div>
              <p className="font-sans text-xs text-[#7a7a6a] leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Visual Footer */}
            <div className="flex items-center justify-between gap-3 mt-5 pt-3 border-t border-[#ecece4]">
              <button
                onClick={() => handleOpenDetail(product)}
                className="flex items-center gap-1.5 text-[11px] font-sans font-bold tracking-wider uppercase text-natural-accent hover:text-natural-accent-hover transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Detalles & Taller
              </button>

              <button
                onClick={() => {
                  if (product.category === "zapatillas") {
                    handleOpenDetail(product);
                  } else {
                    onAddToCart(product);
                  }
                }}
                className="flex items-center justify-center p-2.5 bg-natural-accent text-[#f5f5f0] hover:bg-natural-accent-hover rounded-full transition-all shadow-sm cursor-pointer"
                title="Añadir al carrito"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Exquisite Product Customizer and details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/45 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border border-natural-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col font-serif"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-natural-border flex justify-between items-center bg-[#fcfbf9]">
                <span className="text-[10px] uppercase tracking-widest bg-natural-accent text-[#f5f5f0] px-3 py-1 rounded-full font-sans font-bold">
                  Taller de Ajuste Artesanal
                </span>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 hover:bg-natural-bg rounded-full text-stone-400 hover:text-stone-800 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Representation */}
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-[24px] aspect-[4/3] bg-stone-100 border border-natural-border shadow-2xs">
                      {selectedProduct.image ? (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.imageAlt}
                          referrerPolicy="no-referrer"
                          style={{ filter: getFilterStyle(photoFilter) }}
                          className="w-full h-full object-cover rounded-[24px]"
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
                            if (selectedProduct.fallbackImage) {
                              img.src = selectedProduct.fallbackImage;
                            }
                          }}
                        />
                      ) : (
                        renderProductFallbackGraphic(selectedProduct)
                      )}
                    </div>
                    
                    <div className="bg-natural-card-bg border border-natural-border rounded-2xl p-4 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block">Materiales de Elaboración</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.materials.map((mat, i) => (
                          <span key={i} className="text-[10px] text-natural-text bg-white border border-natural-border rounded-md px-2 py-0.5 font-sans font-semibold">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Info & Controls */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-serif font-bold text-natural-dark text-xl leading-tight">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-md font-bold text-natural-accent mt-1 font-sans">
                        {selectedProduct.price}€
                      </p>
                    </div>

                    <p className="font-sans text-xs text-[#7a7a6a] leading-relaxed">
                      {selectedProduct.details}
                    </p>

                    {/* DYNAMIC CUSTOMIZATION CONTROLS */}
                    {selectedProduct.category === "zapatillas" ? (
                      <div className="space-y-4 border-t border-natural-border pt-4">
                        {/* Size Selector */}
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block mb-1.5">Talla (Estándar EU)</label>
                          <div className="grid grid-cols-5 gap-1.5 font-sans">
                            {["36", "37", "38", "39", "40", "41", "42", "43", "44"].map((sz) => (
                              <button
                                key={sz}
                                onClick={() => setSneakerSize(sz)}
                                className={`text-xs py-1.5 rounded-lg border font-mono font-medium transition-all cursor-pointer ${
                                  sneakerSize === sz
                                    ? "bg-natural-accent text-[#f5f5f0] border-natural-accent shadow-sm"
                                    : "bg-natural-card-bg hover:bg-natural-border/30 text-natural-text border-natural-border"
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Ribbon/Lace options */}
                        <div className="font-sans">
                          <label className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-bold block mb-1.5">Lazada Seleccionada</label>
                          <div className="grid grid-cols-1 gap-2">
                            <button
                              onClick={() => setSneakerLaces("rojo_organza")}
                              className={`text-xs p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                                sneakerLaces === "rojo_organza" ? "bg-natural-card-bg border-natural-accent font-semibold text-natural-accent" : "bg-white border-natural-border hover:bg-natural-bg text-[#7a7a6a]"
                              }`}
                            >
                              <span>🎀 Cinta de organza rojo carmesí (Ancha)</span>
                              {sneakerLaces === "rojo_organza" && <Check className="w-4 h-4 text-natural-accent" />}
                            </button>
                            <button
                              onClick={() => setSneakerLaces("satin_negro")}
                              className={`text-xs p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                                sneakerLaces === "satin_negro" ? "bg-natural-card-bg border-natural-accent font-semibold text-natural-accent" : "bg-white border-natural-border hover:bg-natural-bg text-[#7a7a6a]"
                              }`}
                            >
                              <span>🎀 Cinta de satén negro noche (Elegante)</span>
                              {sneakerLaces === "satin_negro" && <Check className="w-4 h-4 text-natural-accent" />}
                            </button>
                            <button
                              onClick={() => setSneakerLaces("hemp_natural")}
                              className={`text-xs p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                                sneakerLaces === "hemp_natural" ? "bg-natural-card-bg border-natural-accent font-semibold text-natural-accent" : "bg-white border-natural-border hover:bg-natural-bg text-[#7a7a6a]"
                              }`}
                            >
                              <span>📿 Cordón rústico de cáñamo (Estilo natural)</span>
                              {sneakerLaces === "hemp_natural" && <Check className="w-4 h-4 text-natural-accent" />}
                            </button>
                          </div>
                        </div>

                        {/* Custom Initials */}
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block mb-1.5">Bordado de Iniciales (Gratuito)</label>
                          <input
                            type="text"
                            maxLength={4}
                            value={sneakerInitials}
                            onChange={(e) => setSneakerInitials(e.target.value)}
                            placeholder="Ej: NA, EV..."
                            className="w-full text-xs text-natural-dark px-3.5 py-2.5 border border-natural-border rounded-xl bg-natural-card-bg/40 focus:outline-none focus:ring-1 focus:ring-natural-accent font-sans"
                          />
                          <p className="text-[10px] text-[#8a8a7a] font-sans mt-1">
                            Bordaremos estas letras con hilo dorado en el collar del tobillo.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 border-t border-natural-border pt-4 bg-natural-card-bg p-4 rounded-2xl">
                        <span className="text-[10px] uppercase tracking-wider text-natural-accent font-sans font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Elaboración Garantizada
                        </span>
                        <p className="font-sans text-xs text-[#7a7a6a] leading-relaxed">
                          Cada una de nuestras joyas y pendientes se elabora bajo demanda de manera 100% individual en nuestro taller. Los acabados de resina y metal pueden variar ligeramente de la foto, haciendo que tu pieza sea absolutamente irrepetible.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-natural-border flex gap-3 bg-[#fcfbf9]">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-white border border-natural-border text-natural-text hover:bg-natural-bg font-semibold font-sans text-xs rounded-full py-3.5 px-4 transition-all cursor-pointer"
                >
                  Seguir buscando
                </button>
                <button
                  onClick={handleAddFromDetail}
                  className="flex-1 bg-natural-accent hover:bg-natural-accent-hover text-[#f5f5f0] font-bold font-sans text-xs rounded-full py-3.5 px-4 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Añadir al taller del carrito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
