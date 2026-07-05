import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Sparkles, 
  Gift, 
  BookOpen, 
  ShieldCheck, 
  Info, 
  MapPin, 
  Clock, 
  Mail, 
  Instagram, 
  HelpCircle,
  Scissors,
  Camera
} from "lucide-react";

import { Product, CartItem, AICreatedDesign } from "./types";
import ShoeVisualizer from "./components/ShoeVisualizer";
import Catalog from "./components/Catalog";
import AICoCreator from "./components/AICoCreator";
import AIGiftAdvisor from "./components/AIGiftAdvisor";
import RetouchStudio from "./components/RetouchStudio";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";

const ARTISAN_PRODUCTS: Product[] = [
  {
    id: "zapatillas_girasoles",
    name: "Zapatillas 'Amanecer de Girasoles'",
    description: "Zapatillas de lona altas bordadas a mano con vibrantes girasoles en relieve, margaritas de nudo francés y lavandas silvestres.",
    price: 110,
    category: "zapatillas",
    materials: ["Lona de algodón 100%", "Hilos de seda Mouliné", "Cintas de organza translúcida", "Suela de caucho vulcanizado"],
    features: ["Bordado tridimensional", "Talla a elegir (36-44)", "Iniciales personalizadas en hilo de oro", "Lazada de cinta organza roja"],
    isCustomizable: true,
    imageAlt: "Zapatillas altas blancas bordadas a mano con girasoles tridimensionales y cordón de cinta de organza roja.",
    image: "/images/zapatillas_girasoles.jpeg",
    fallbackImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&h=450&q=80",
    colorAccent: "#fef3c7", // soft light gold yellow background
    badge: "Más Vendido",
    details: "Nuestra creación insignia. Cada par requiere más de 12 horas de meticuloso bordado con hilos de seda de alta calidad. Los girasoles se bordan en relieve tridimensional, creando pétalos vivos sobre la lona blanca. Se entregan con cordones intercambiables (cinta de organza carmesí y cordón clásico de algodón)."
  },
  {
    id: "pulsera_tierra",
    name: "Pulsera de Cuero 'Anillo de Tierra'",
    description: "Brazalete de cuero legítimo curtido al vegetal con un aro circular central de plata pulida y remaches de acero inoxidable.",
    price: 28,
    category: "pulseras",
    materials: ["Cuero vacuno premium (curtido vegetal)", "Plata de ley 925 maciza", "Remaches de acero quirúrgico"],
    features: ["Ajustable a cualquier muñeca", "Broche de presión doble", "Bordes pulidos a mano con cera de abejas"],
    isCustomizable: false,
    imageAlt: "Brazalete de cuero marrón con un gran aro plateado metálico en el centro.",
    image: "/images/brazalete_cuero.png",
    fallbackImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&h=450&q=80",
    colorAccent: "#f5ebe0", // soft warm leather beige background
    badge: "Pieza Única",
    details: "Un brazalete de espíritu minimalista y rústico. Cortamos y teñimos a mano cada tira de cuero de curtido vegetal en tono castaño profundo. El contraste entre el tacto orgánico del cuero y la frialdad industrial del gran anillo central de plata pulida crea una pieza de joyería versátil y atemporal."
  },
  {
    id: "pendientes_labios",
    name: "Pendientes 'Labios de Carmín'",
    description: "Pendientes colgantes de labios rojos mordiéndose con dientes blancos, modelados artesanalmente y ganchos de plata.",
    price: 18,
    category: "pendientes",
    materials: ["Resina brillante esmaltada", "Pigmentos intensos", "Ganchos de plata de ley 925"],
    features: ["Ultra ligeros", "Brillo de esmalte vitrificado", "Hipoalergénicos"],
    isCustomizable: false,
    imageAlt: "Pendientes en forma de labios rojos sensuales y dientes blancos mordiendo, con ganchos plateados.",
    image: "/images/labios_rojos.png",
    fallbackImage: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&h=450&q=80",
    colorAccent: "#ffe4e6", // soft red-pink background
    badge: "Divertido",
    details: "Pendientes atrevidos, pop y muy originales. Modelados a mano para conseguir una textura carnosa y expresiva, esmaltados con una capa de alto brillo que simula carmín mojado. Un complemento divertido y único que eleva cualquier estilo cotidiano."
  },
  {
    id: "pendientes_espinas",
    name: "Pendientes 'Corazón de Espinas'",
    description: "Pendientes artesanales moldeados en forma de corazón de alambre de espino con aleación plateada de estilo gótico chic.",
    price: 22,
    category: "pendientes",
    materials: ["Aleación hipoalergénica con baño de plata antigua", "Ganchos de plata de ley 925"],
    features: ["Estilo gótico sofisticado", "Efecto oxidado vintage", "Líneas pulidas suaves al tacto"],
    isCustomizable: false,
    imageAlt: "Pendientes metálicos con forma de corazón simulando alambre de espino.",
    image: "/images/corazon_alambre.png",
    fallbackImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&h=450&q=80",
    colorAccent: "#f4f4f5", // soft cool gray
    badge: "Novedad",
    details: "Artesanía metálica inspirada en la joyería gótica y de espinas. Moldeamos cada corazón usando hilos de metal de alta flexibilidad que trenzamos para simular alambre de espino, puliendo minuciosamente cada punta para que sea cómoda de vestir sin perder su aspecto rebelde."
  },
  {
    id: "pendientes_trisquel",
    name: "Pendientes 'Trisquel Ancestral'",
    description: "Pendientes colgantes de plata pulida con relieve del trisquel celta, símbolo de movimiento, equilibrio y renacimiento.",
    price: 25,
    category: "pendientes",
    materials: ["Plata de ley 925 maciza", "Pátina de sombreado oscuro"],
    features: ["Relieve de fundición artesanal", "Símbolo protector tradicional", "Estuche de madera de regalo"],
    isCustomizable: false,
    imageAlt: "Pendientes de plata circulares con el símbolo del trisquel celta grabado.",
    image: "/images/trisquel_celta.png",
    fallbackImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&h=450&q=80",
    colorAccent: "#eaf2f8", // light sky grey-blue
    details: "Un amuleto celta lleno de historia. Elaborados mediante fundición a la cera perdida en plata de ley 925, envejecidos con pátina oscura en las ranuras para acentuar el relieve tridimensional de las espirales. El trisquel representa la evolución espiritual, la conexión con la naturaleza y el equilibrio vital."
  },
  {
    id: "pendientes_fantasia",
    name: "Pendientes 'Fantasía Quirky'",
    description: "Parejas de pendientes asimétricos divertidos a elegir: vinilos retro, fantasmitas, ouija planchettes o mini tazas de café.",
    price: 15,
    category: "pendientes",
    materials: ["Plástico encogible", "Barniz protector UV", "Ganchos de plata de ley 925"],
    features: ["Asimetría a elegir", "Estampados de alta definición pintados a mano", "Extremadamente cómodos"],
    isCustomizable: true,
    imageAlt: "Expositor lleno de decenas de pendientes divertidos colgando de una puerta.",
    image: "/images/taller_creativo.png",
    fallbackImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&h=450&q=80",
    colorAccent: "#fcf6f5", // pastel white peach
    badge: "Taller Creativo",
    details: "Forman parte de nuestra colección de pendientes extravagantes ilustrados a mano. Elige tu par asimétrico preferido para combinar figuras icónicas: desde discos de vinilo retro hasta una ouija planchette de aire místico. Perfectos para regalar a coleccionistas de complementos curiosos."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"coleccion" | "taller" | "regalos" | "retoque">("coleccion");
  const [products, setProducts] = useState<Product[]>(() => {
    return ARTISAN_PRODUCTS.map((prod) => {
      const localImage = localStorage.getItem(`uploaded-image-${prod.id}`);
      if (localImage) {
        return {
          ...prod,
          image: localImage
        };
      }
      return prod;
    });
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // States for interactive ShoeVisualizer on the Co-Creator panel
  const [vizLacesColor, setVizLacesColor] = useState("rojo_organza");
  const [vizLacesType, setVizLacesType] = useState<"organza" | "algodon" | "hemp" | "satin">("organza");
  const [vizEmbTheme, setVizEmbTheme] = useState<"girasoles" | "mar" | "gotico" | "estrellas" | "ninguno">("girasoles");
  const [vizInitials, setVizInitials] = useState("");

  // Listen for real image uploads to update the catalog state in real-time
  useEffect(() => {
    const handleImageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ productId: string; url: string }>;
      const { productId, url } = customEvent.detail;
      setProducts((prev) => 
        prev.map((prod) => {
          if (
            prod.id === productId || 
            (productId === "brazalete_cuero" && prod.id === "pulsera_tierra") ||
            (productId === "taller_creativo" && prod.id === "pendientes_fantasia")
          ) {
            const finalUrl = url.startsWith("data:") ? url : `${url}?t=${Date.now()}`;
            return {
              ...prod,
              image: finalUrl
            };
          }
          return prod;
        })
      );
    };

    window.addEventListener("product-image-updated", handleImageUpdate);
    return () => {
      window.removeEventListener("product-image-updated", handleImageUpdate);
    };
  }, []);

  // Handler: Add standard product to cart
  const handleAddProductToCart = (product: Product, size?: string, customText?: string) => {
    // Generate unique ID based on product and sizing/embroidery parameters
    const sizePart = size ? `-size-${size}` : "";
    const textPart = customText ? `-txt-${customText.substring(0, 4)}` : "";
    const cartItemId = `${product.id}${sizePart}${textPart}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // Prepare customization payload
      const customization = product.category === "zapatillas" 
        ? {
            lacesColor: "Cinta de organza roja",
            lacesType: "organza",
            embroideryName: "Amanecer de Girasoles",
            customLettering: customText || undefined,
            priceAdjustment: 0
          }
        : undefined;

      return [
        ...prev,
        {
          id: cartItemId,
          product,
          quantity: 1,
          selectedSize: size,
          customization
        },
      ];
    });

    // Auto-open cart to show confirmation
    setIsCartOpen(true);
  };

  // Handler: Add AI-Co-Created shoe to cart
  const handleAddCustomToCart = (customization: any, price: number) => {
    // Wrap product
    const baseShoe = ARTISAN_PRODUCTS.find(p => p.id === "zapatillas_girasoles")!;
    const customProduct: Product = {
      ...baseShoe,
      name: `Zapatillas 'Alma - ${customization.conceptName}'`,
      price: price,
      badge: "Edición Única IA"
    };

    const cartItemId = `ai-shoe-${customization.conceptName.replace(/\s+/g, "-")}-${customization.customLettering}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product: customProduct,
          quantity: 1,
          selectedSize: "38", // default standard
          customization: {
            ...customization,
            isAICreated: true
          }
        }
      ];
    });

    setIsCartOpen(true);
  };

  // Handler: Add customized product from AI Gift search recommendations
  const handleAddGiftSuggestedToCart = (type: "pendientes" | "pulseras" | "zapatillas", name: string, customIdea: string) => {
    // Find matching catalog product base
    const baseProduct = ARTISAN_PRODUCTS.find(p => p.category === type) || ARTISAN_PRODUCTS[2];
    
    const customProduct: Product = {
      ...baseProduct,
      name: name,
      price: baseProduct.price + (type === "zapatillas" ? 15 : 5), // small surcharge for unique idea
      badge: "Encargo Regalo IA"
    };

    const cartItemId = `gift-${type}-${name.replace(/\s+/g, "-")}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product: customProduct,
          quantity: 1,
          selectedSize: type === "zapatillas" ? "38" : undefined,
          customization: {
            conceptName: "Regalo Personalizado",
            description: customIdea,
            lacesColor: type === "zapatillas" ? "Cordón recomendado" : undefined,
            priceAdjustment: type === "zapatillas" ? 15 : 5
          }
        }
      ];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Maps AI design result to visualizer canvas
  const handleApplyAIDesignToVisualizer = (data: AICreatedDesign, themeType: "girasoles" | "mar" | "gotico" | "estrellas" | "ninguno") => {
    setVizEmbTheme(themeType);
    setVizLacesColor(data.recommendedLaces);
    setVizLacesType(data.recommendedLaces.toLowerCase().includes("organza") ? "organza" : "algodon");
  };

  return (
    <div className="min-h-screen bg-natural-bg text-[#4a4a3a] font-serif antialiased flex flex-col justify-between">
      {/* Brand Header */}
      <header id="brand-header" className="bg-white/95 backdrop-blur-md border-b border-natural-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-serif italic font-bold text-natural-accent text-2xl tracking-tight leading-none">
              Alma & Hebra
            </h1>
            <span className="text-[10px] text-[#8a8a7a] font-sans tracking-widest uppercase mt-1">
              Bordado artesanal • Joyería de autor
            </span>
          </div>

          {/* Navigation tabs for Desktop */}
          <nav className="hidden md:flex gap-10 font-sans text-xs uppercase tracking-widest font-semibold text-[#8a8a7a]">
            <button 
              onClick={() => setActiveTab("coleccion")} 
              className={`hover:text-natural-accent border-b-2 pb-1 transition-all duration-200 cursor-pointer ${activeTab === "coleccion" ? "text-natural-accent border-natural-accent font-bold" : "border-transparent"}`}
            >
              Colección Completa
            </button>
            <button 
              onClick={() => setActiveTab("taller")} 
              className={`flex items-center gap-1.5 hover:text-natural-accent border-b-2 pb-1 transition-all duration-200 cursor-pointer ${activeTab === "taller" ? "text-natural-accent border-natural-accent font-bold" : "border-transparent"}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-natural-accent animate-pulse" />
              Taller de Costura IA
            </button>
            <button 
              onClick={() => setActiveTab("retoque")} 
              className={`flex items-center gap-1.5 hover:text-natural-accent border-b-2 pb-1 transition-all duration-200 cursor-pointer ${activeTab === "retoque" ? "text-natural-accent border-natural-accent font-bold" : "border-transparent"}`}
            >
              <Camera className="w-3.5 h-3.5 text-natural-accent" />
              Estudio de Retoque
            </button>
            <button 
              onClick={() => setActiveTab("regalos")} 
              className={`flex items-center gap-1.5 hover:text-natural-accent border-b-2 pb-1 transition-all duration-200 cursor-pointer ${activeTab === "regalos" ? "text-natural-accent border-natural-accent font-bold" : "border-transparent"}`}
            >
              <Gift className="w-3.5 h-3.5 text-natural-accent" />
              Buscador de Regalos
            </button>
          </nav>

          {/* Cart Icon trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-white hover:bg-natural-bg border border-natural-border rounded-full transition-all cursor-pointer flex items-center justify-center shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-natural-accent" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-natural-accent text-[#f5f5f0] font-sans text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-10">
        
        {/* Editorial Brand Intro Hero */}
        <section id="hero-intro" className="relative bg-white rounded-[32px] p-8 md:p-12 overflow-hidden border border-natural-border flex flex-col md:flex-row items-center gap-8 shadow-sm">
          {/* Subtle natural texture accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e2d5_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          <div className="space-y-4 max-w-xl relative z-10 flex-1">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#8a8a7a] mb-2 block font-semibold">
              Edición Limitada • Madrid
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-natural-dark leading-[1.15] mb-4">
              Cada par de zapatillas, <br /><span className="italic font-light text-natural-accent">un trozo de alma bordado</span>
            </h2>
            <p className="font-sans text-sm leading-relaxed text-[#7a7a6a] mb-6">
              En Alma & Hebra combinamos el oficio milenario del bordado a mano con técnicas de modelado de resinas, curtido de cueros y fundición de metales. Piezas moldeadas con calma que cuentan una historia propia.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => setActiveTab("coleccion")} 
                className="bg-natural-accent text-[#f5f5f0] px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest hover:bg-natural-accent-hover transition-colors shadow-sm cursor-pointer"
              >
                Ver Colección
              </button>
              <button 
                onClick={() => setActiveTab("taller")} 
                className="bg-natural-card-bg text-natural-accent border border-natural-border px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest hover:bg-[#e2e2d5]/60 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-natural-accent animate-pulse" />
                Taller de Costura IA
              </button>
            </div>
          </div>

          {/* Right Banner Showcase - Sneaker preview */}
          <div className="relative flex-1 w-full max-w-sm flex items-center justify-center">
            <ShoeVisualizer
              lacesColor="rojo"
              lacesType="organza"
              embroideryTheme="girasoles"
              customLettering="ALMA"
              className="w-full bg-natural-card-bg border-2 border-natural-border"
            />
          </div>
        </section>

        {/* Tab Controls for Mobile devices */}
        <div className="md:hidden grid grid-cols-4 gap-1 bg-natural-border/40 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("coleccion")}
            className={`text-[10px] uppercase tracking-wider py-2.5 rounded-xl text-center font-sans font-bold transition-all ${activeTab === "coleccion" ? "bg-white text-natural-accent shadow-sm" : "text-[#8a8a7a]"}`}
          >
            Colección
          </button>
          <button
            onClick={() => setActiveTab("taller")}
            className={`text-[10px] uppercase tracking-wider py-2.5 rounded-xl text-center font-sans font-bold flex items-center justify-center gap-1 transition-all ${activeTab === "taller" ? "bg-white text-natural-accent shadow-sm" : "text-[#8a8a7a]"}`}
          >
            <Sparkles className="w-3 h-3 text-natural-accent" /> Taller
          </button>
          <button
            onClick={() => setActiveTab("retoque")}
            className={`text-[10px] uppercase tracking-wider py-2.5 rounded-xl text-center font-sans font-bold flex items-center justify-center gap-1 transition-all ${activeTab === "retoque" ? "bg-white text-natural-accent shadow-sm" : "text-[#8a8a7a]"}`}
          >
            <Camera className="w-3 h-3 text-natural-accent" /> Retoque
          </button>
          <button
            onClick={() => setActiveTab("regalos")}
            className={`text-[10px] uppercase tracking-wider py-2.5 rounded-xl text-center font-sans font-bold flex items-center justify-center gap-1 transition-all ${activeTab === "regalos" ? "bg-white text-natural-accent shadow-sm" : "text-[#8a8a7a]"}`}
          >
            <Gift className="w-3 h-3 text-natural-accent" /> Regalos
          </button>
        </div>

        {/* Dynamic tab panels */}
        <AnimatePresence mode="wait">
          {activeTab === "coleccion" && (
            <motion.div
              key="coleccion-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-natural-dark">Catálogo de Joyería & Calzado de Autor</h3>
                  <p className="text-xs text-[#8a8a7a]">Selección exclusiva de nuestras piezas elaboradas con metales nobles, cuero y costuras delicadas.</p>
                </div>
                <Catalog products={products} onAddToCart={handleAddProductToCart} />
              </div>
            </motion.div>
          )}

          {activeTab === "taller" && (
            <motion.div
              key="taller-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Visualizer Canvas */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 h-fit">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-natural-dark">Boceto Interactivo en Vivo</h3>
                  <p className="text-xs text-[#8a8a7a]">Visualiza en tiempo real cómo lucirán tus zapatillas bordadas de forma artesanal.</p>
                </div>
                
                <ShoeVisualizer
                  lacesColor={vizLacesColor}
                  lacesType={vizLacesType}
                  embroideryTheme={vizEmbTheme}
                  customLettering={vizInitials}
                  className="bg-white border border-natural-border py-10"
                />

                {/* Direct quick modification tools inside visualizer */}
                <div className="bg-white border border-natural-border p-5 rounded-3xl space-y-3.5 shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block">Ajustes Rápidos del Taller</span>
                  
                  {/* Select ribbon color on shoe */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-[#7a7a6a] block">Color de Lazo:</span>
                    <div className="flex gap-2">
                      {[
                        { label: "Carmesí", value: "rojo", hex: "#dc2626" },
                        { label: "Noche", value: "negro", hex: "#171717" },
                        { label: "Salvia", value: "verde", hex: "#15803d" },
                        { label: "Cáñamo", value: "hemp", hex: "#d6c3b0" },
                        { label: "Oro", value: "oro", hex: "#d97706" }
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setVizLacesColor(item.value)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 hover:scale-110 transition-transform cursor-pointer ${vizLacesColor === item.value ? "ring-2 ring-natural-accent ring-offset-2" : "border-natural-border"}`}
                          style={{ backgroundColor: item.hex }}
                          title={item.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Typing custom lettering */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#7a7a6a] block">Siglas a Bordar en Talón:</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={vizInitials}
                      onChange={(e) => setVizInitials(e.target.value.substring(0, 4))}
                      placeholder="Ej: ALMA"
                      className="w-full text-xs text-natural-dark px-3.5 py-2 border border-natural-border rounded-xl focus:outline-none focus:ring-1 focus:ring-natural-accent bg-natural-card-bg/40 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: AI Co-creator Input & Outputs */}
              <div className="lg:col-span-7">
                <AICoCreator 
                  onApplyDesign={handleApplyAIDesignToVisualizer} 
                  onAddToCart={handleAddCustomToCart}
                  currentLettering={vizInitials}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "regalos" && (
            <motion.div
              key="regalos-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <AIGiftAdvisor onAddCustomSuggested={handleAddGiftSuggestedToCart} />
            </motion.div>
          )}

          {activeTab === "retoque" && (
            <motion.div
              key="retoque-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <RetouchStudio />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quality Badges */}
        <section id="quality-badges" className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-natural-border p-6 rounded-[32px] shadow-sm">
          <div className="flex gap-4">
            <div className="p-3 bg-natural-card-bg rounded-2xl text-natural-accent h-fit border border-natural-border">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-natural-dark text-sm">Materiales Auténticos</h4>
              <p className="font-sans text-xs text-[#7a7a6a] leading-normal">Hilo de seda Mouliné, plata de ley 925, cuero curtido vegetal y lona premium.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-natural-card-bg rounded-2xl text-natural-accent h-fit border border-natural-border">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-natural-dark text-sm">Garantía de Autor</h4>
              <p className="font-sans text-xs text-[#7a7a6a] leading-normal">Cada pieza se entrega con su Certificado de Autenticidad numerado y fechado por el taller.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-natural-card-bg rounded-2xl text-natural-accent h-fit border border-natural-border">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-natural-dark text-sm">Oficio Sostenible</h4>
              <p className="font-sans text-xs text-[#7a7a6a] leading-normal">Elaboramos bajo demanda estricta, reduciendo residuos y respetando los tiempos del sastre.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="footer" className="bg-natural-accent text-[#f5f5f0] py-12 mt-16 border-t border-natural-accent-hover font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-serif italic font-bold text-[#f5f5f0] text-lg tracking-tight">Alma & Hebra</h3>
            <p className="text-xs leading-relaxed max-w-xs opacity-80">
              Taller creativo de bordados artesanos y joyería de autor. Creando complementos memorables hechos a mano con cariño en Madrid.
            </p>
          </div>

          <div className="space-y-3.5 text-xs text-[#f5f5f0]/85">
            <h4 className="font-sans font-bold text-[#f5f5f0] uppercase tracking-widest text-xs">Información del Taller</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f5f5f0]/60" />
                <span>Calle de Hortaleza 12, 28004 Madrid, España</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#f5f5f0]/60" />
                <span>Atención con cita previa: Lun a Vie, 10:00 - 19:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f5f5f0]/60" />
                <span>contacto@almayhebra.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-bold text-[#f5f5f0] uppercase tracking-widest text-xs">Nuestra Comunidad</h4>
            <div className="flex gap-3">
              <a href="#instagram" className="p-2 bg-natural-accent-hover/60 hover:bg-natural-accent-hover border border-[#f5f5f0]/20 rounded-xl text-white transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#email" className="p-2 bg-natural-accent-hover/60 hover:bg-natural-accent-hover border border-[#f5f5f0]/20 rounded-xl text-white transition-colors" title="Escríbenos">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[10px] text-[#f5f5f0]/60 leading-relaxed font-sans tracking-wider">
              © {new Date().getFullYear()} ALMA & HEBRA S.L. • TODOS LOS DERECHOS RESERVADOS. HECHO A MANO CON ALMA EN ESPAÑA.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout and Certificate Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
