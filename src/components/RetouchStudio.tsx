import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Upload, 
  Sliders, 
  Image as ImageIcon, 
  Sun, 
  Check, 
  X, 
  Info, 
  Undo, 
  Eye, 
  Palette, 
  Brush, 
  FileText,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductRetouch {
  id: string;
  name: string;
  category: string;
  originalDescription: string;
  watermarkToRemove: string;
  rawFileName: string;
  recommendedIdea: {
    title: string;
    description: string;
    background: string;
    lighting: string;
    props: string;
  };
  fallbackImage: string;
  defaultBg: string; // Background preset ID
  defaultLighting: string; // Lighting preset ID
  defaultFilter: string; // Filter ID
}

const RETOUCH_PRODUCTS: ProductRetouch[] = [
  {
    id: "zapatillas_girasoles",
    name: "Zapatillas Altas 'Girasoles'",
    category: "zapatillas",
    originalDescription: "Zapatillas de lona blanca con bordado artesanal de girasol tridimensional, flores moradas y lazo de organza rojo.",
    watermarkToRemove: "Fondo verde plano y sombra de recorte dura.",
    rawFileName: "zapatillas_girasoles.png",
    recommendedIdea: {
      title: "Atmósfera de Taller Rústico de Costura",
      description: "Retiraremos el fondo verde de estudio para colocar las zapatillas sobre un tablero de roble envejecido o mantelería de lino crudo. Añadiremos elementos desenfocados en los bordes como hilos de colores Mouliné y agujas para acentuar el origen textil. Proyectaremos luz cálida de tarde entrando por una ventana lateral.",
      background: "taller",
      lighting: "ventana",
      props: "Hilos Mouliné de colores cálidos, tijeras de costura de bronce clásicas, lino natural"
    },
    fallbackImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&h=450&q=80",
    defaultBg: "taller",
    defaultLighting: "ventana",
    defaultFilter: "warm"
  },
  {
    id: "brazalete_cuero",
    name: "Brazalete de Cuero de Autor",
    category: "pulseras",
    originalDescription: "Brazalete grueso de cuero teñido a mano en castaño natural con aro central y remaches de plata de ley.",
    watermarkToRemove: "Marca de agua circular de fondo ('eddas').",
    rawFileName: "brazalete_cuero.png",
    recommendedIdea: {
      title: "Mesa de Curtidor y Luz de Candilejas",
      description: "Sustituiremos el círculo gris por un fondo texturizado de cuero natural de curtido vegetal o madera de encina marcada. Usaremos una luz puntual focalizada ('spotlight') desde arriba para destacar el brillo metálico de la plata pulida y la textura porosa del cuero curtido a mano, dándole un aire robusto y exclusivo.",
      background: "madera",
      lighting: "foco",
      props: "Trozo de cuero crudo de fondo, punzón de costura, cera de abejas para bordes"
    },
    fallbackImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&h=450&q=80",
    defaultBg: "madera",
    defaultLighting: "foco",
    defaultFilter: "vintage"
  },
  {
    id: "pendientes_labios",
    name: "Pendientes 'Labios de Carmín'",
    category: "pendientes",
    originalDescription: "Pendientes extravagantes con forma de labios rojos mordiéndose con dientes blancos esmaltados.",
    watermarkToRemove: "Marca de agua circular de fondo ('eddas').",
    rawFileName: "labios_rojos.png",
    recommendedIdea: {
      title: "Glow de Estudio Minimalista y Esmaltado",
      description: "Quitaremos la marca de agua y los colocaremos sobre una placa de yeso o mármol blanco impoluto. Se aplicará un halo luminoso suave de color rosa pastel detrás de los pendientes para realzar el rojo pasión del esmalte. La luz cenital suave y limpia eliminará reflejos molestos en la resina vítrea.",
      background: "estudio",
      lighting: "difusa",
      props: "Superficie de mármol blanco brillante, reflejo satinado de fondo"
    },
    fallbackImage: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&h=450&q=80",
    defaultBg: "estudio",
    defaultLighting: "difusa",
    defaultFilter: "soft"
  },
  {
    id: "pendientes_espinas",
    name: "Pendientes 'Corazón de Espinas'",
    category: "pendientes",
    originalDescription: "Pendientes en forma de corazón trenzado simulando hilos de alambre de espino con pátina de plata envejecida.",
    watermarkToRemove: "Marca de agua circular de fondo ('eddas').",
    rawFileName: "corazon_alambre.png",
    recommendedIdea: {
      title: "Misticismo Gótico y Claroscuro Dramático",
      description: "Colocaremos estas piezas góticas sobre piedra de pizarra gris oscura o terciopelo negro. Utilizaremos un claroscuro muy marcado con iluminación rasante de un solo lado para tallar las sombras del trenzado metálico del alambre de espino y acentuar el aire misterioso y rebelde del diseño.",
      background: "pizarra",
      lighting: "drama",
      props: "Losa de pizarra natural, pétalos secos de rosa roja marchita, cadena fina"
    },
    fallbackImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&h=450&q=80",
    defaultBg: "pizarra",
    defaultLighting: "drama",
    defaultFilter: "gothic"
  },
  {
    id: "pendientes_trisquel",
    name: "Pendientes 'Trisquel Ancestral'",
    category: "pendientes",
    originalDescription: "Medallones de plata de ley circulares con el símbolo del trisquel celta con relieve envejecido.",
    watermarkToRemove: "Marca de agua circular de fondo ('eddas').",
    rawFileName: "trisquel_celta.png",
    recommendedIdea: {
      title: "Tierra Celta: Musgo Fresco y Rocas del Bosque",
      description: "La joya descansará sobre una cama viva de musgo verde brillante, cortezas de pino y piñas pequeñas. Proyectaremos sombras diagonales de hojas y ramas filtrando rayos de sol (efecto 'Komorebi') para evocar la conexión espiritual celta con la naturaleza y el equilibrio vital del trisquel.",
      background: "musgo",
      lighting: "hojas",
      props: "Musgo de bosque húmedo, ramita de roble silvestre, corteza de abedul"
    },
    fallbackImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&h=450&q=80",
    defaultBg: "musgo",
    defaultLighting: "hojas",
    defaultFilter: "soft"
  },
  {
    id: "taller_creativo",
    name: "Expositor de Pendientes Quirky",
    category: "pendientes",
    originalDescription: "Expositor de fieltro colgante lleno de diseños variados de pendientes creativos e ilustrados.",
    watermarkToRemove: "Pomo de la puerta, fondo de puerta doméstico y sombras crudas.",
    rawFileName: "taller_creativo.png",
    recommendedIdea: {
      title: "Rincón Inspiracional del Atelier de Joyas",
      description: "Recortaremos el expositor y eliminaremos el pomo y marco de la puerta de fondo. Lo integraremos en un entorno acogedor y desenfocado de taller creativo, rodeado de tarros de cristal con pinceles, paletas de resinas y bocetos ilustrados en papel pergamino. Luz envolvente muy suave que emana calidez.",
      background: "atelier",
      lighting: "difusa",
      props: "Bocetos de diseño en papel artesanal, pinceles, botes de pigmentos"
    },
    fallbackImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&h=450&q=80",
    defaultBg: "atelier",
    defaultLighting: "difusa",
    defaultFilter: "warm"
  }
];

export default function RetouchStudio() {
  const [activeProduct, setActiveProduct] = useState<ProductRetouch>(RETOUCH_PRODUCTS[0]);
  
  // Custom uploaded images store (using product ID as key)
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    RETOUCH_PRODUCTS.forEach((prod) => {
      try {
        const localData = localStorage.getItem(`uploaded-image-${prod.id}`);
        if (localData) {
          saved[prod.id] = localData;
        }
      } catch (e) {
        console.warn("Could not read from localStorage on initialization:", e);
      }
    });
    return saved;
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Custom controls state
  const [bgPreset, setBgPreset] = useState<string>(activeProduct.defaultBg);
  const [lightingPreset, setLightingPreset] = useState<string>(activeProduct.defaultLighting);
  const [colorFilter, setColorFilter] = useState<string>(activeProduct.defaultFilter);
  
  // Sliders
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(105);
  const [saturation, setSaturation] = useState<number>(100);
  const [blurAmount, setBlurAmount] = useState<number>(0);
  const [shadowDepth, setShadowDepth] = useState<"soft" | "none" | "dramatic">("soft");
  const [removeBackground, setRemoveBackground] = useState<boolean>(true);
  const [addProps, setAddProps] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync controls with product defaults when product changes
  useEffect(() => {
    setBgPreset(activeProduct.defaultBg);
    setLightingPreset(activeProduct.defaultLighting);
    setColorFilter(activeProduct.defaultFilter);
    setBrightness(100);
    setContrast(105);
    setSaturation(100);
    setBlurAmount(0);
    setShadowDepth("soft");
    setRemoveBackground(true);
    setAddProps(true);
    setUploadError(null);
  }, [activeProduct]);

  // Helper to compress image using canvas before uploading
  const compressImage = (base64Str: string, maxWidth = 1200, maxHeight = 1200): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.85 quality
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  // Handle local file upload and save to server
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadError(null);
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const originalBase64 = uploadEvent.target.result as string;
          try {
            // Compress image client-side to ensure small payload size (under 500kb)
            const compressedBase64 = await compressImage(originalBase64);
            
            // 1. Instantly save to local memory (localStorage)
            try {
              localStorage.setItem(`uploaded-image-${activeProduct.id}`, compressedBase64);
            } catch (storageErr) {
              console.warn("Could not save to localStorage (quota full or private window):", storageErr);
            }

            // 2. Instantly update UI and dispatch events (completely offline/serverless compatible)
            setUploadedImages((prev) => ({
              ...prev,
              [activeProduct.id]: compressedBase64
            }));

            window.dispatchEvent(new CustomEvent("product-image-updated", {
              detail: { productId: activeProduct.id, url: compressedBase64 }
            }));

            // 3. Try to save on the server (works when running locally in development for export)
            try {
              const response = await fetch("/api/upload-image", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  productId: activeProduct.id,
                  base64Data: compressedBase64
                })
              });

              if (response.ok) {
                const result = await response.json();
                console.log("Successfully persisted image on developer workspace server:", result.url);
              } else {
                const text = await response.text();
                console.warn("Server upload failed (expected on Vercel/Serverless):", response.status, text);
              }
            } catch (serverErr) {
              console.warn("Server upload network error (expected on Vercel/Serverless):", serverErr);
            }

          } catch (err: any) {
            console.error("Upload process error:", err);
            setUploadError(err.message || "Error al procesar la imagen.");
          } finally {
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentImage = uploadedImages[activeProduct.id] || null;

  // CSS for background presets
  const getBackgroundStyles = () => {
    if (!removeBackground) return "bg-stone-200"; // default flat gray if not cut out
    
    switch (bgPreset) {
      case "taller": // Linen & wood
        return "bg-[radial-gradient(#d6c3b0_1px,transparent_1px)] [background-size:20px_20px] bg-stone-100 border border-[#e5d5c5]";
      case "madera": // Oak wood gradient
        return "bg-gradient-to-tr from-[#3e2723] via-[#4e342e] to-[#6d4c41]";
      case "estudio": // Clean marble white
        return "bg-gradient-to-br from-[#f5f5f4] via-[#fafaf9] to-[#e7e5e4]";
      case "pizarra": // Dark Slate
        return "bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#09090b]";
      case "musgo": // Moss green
        return "bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d]";
      case "atelier": // Pastel Warm Workspace
        return "bg-gradient-to-br from-[#fafaf9] via-[#f5f2eb] to-[#e4dfd3]";
      default:
        return "bg-stone-100";
    }
  };

  // CSS filters
  const getFilterStyles = () => {
    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (blurAmount > 0) filterString += ` blur(${blurAmount}px)`;

    switch (colorFilter) {
      case "warm":
        return `${filterString} sepia(18%) saturate(115%) contrast(102%)`;
      case "vintage":
        return `${filterString} sepia(35%) contrast(92%) saturate(90%) hue-rotate(-5deg)`;
      case "soft":
        return `${filterString} saturate(102%) brightness(102%) contrast(104%)`;
      case "gothic":
        return `${filterString} saturate(60%) contrast(125%) brightness(90%)`;
      default:
        return filterString;
    }
  };

  // Reset controls to factory defaults
  const handleReset = () => {
    setBrightness(100);
    setContrast(105);
    setSaturation(100);
    setBlurAmount(0);
    setShadowDepth("soft");
    setBgPreset(activeProduct.defaultBg);
    setLightingPreset(activeProduct.defaultLighting);
    setColorFilter(activeProduct.defaultFilter);
    setRemoveBackground(true);
    setAddProps(true);
  };

  return (
    <div className="space-y-8 font-serif bg-white border border-natural-border p-6 md:p-8 rounded-[32px] shadow-sm">
      {/* Editorial Header */}
      <div className="border-b border-natural-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#8a8a7a] font-bold block mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-natural-accent animate-pulse" /> TALLER DE DISEÑO & PRESENTACIÓN
          </span>
          <h3 className="font-serif text-2xl font-bold text-natural-dark">
            Estudio de Retoque y Luz Fotográfica
          </h3>
          <p className="font-sans text-xs text-[#7a7a6a] mt-1">
            Visualiza cómo transformamos tus fotos domésticas en imágenes de catálogo profesional con fondos orgánicos y luz ambiental.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="font-sans text-xs font-bold text-natural-accent hover:text-natural-accent-hover flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-natural-border hover:bg-natural-bg transition-all cursor-pointer"
        >
          <Undo className="w-3.5 h-3.5" /> Restaurar Ajustes
        </button>
      </div>

      {/* Greeting Banner for Narciso */}
      <div className="bg-amber-50/40 border border-amber-200/60 rounded-[24px] p-4 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center">
        <div className="p-2.5 bg-amber-100 rounded-full text-amber-800 shrink-0">
          <ImageIcon className="w-4 h-4" />
        </div>
        <div className="space-y-0.5 font-sans">
          <span className="text-xs font-bold text-natural-dark block">📸 ¡Hola Narciso! Integración directa de tus fotos activada:</span>
          <p className="text-[11px] text-[#7a7a6a] leading-relaxed">
            Para que las fotos reales que has adjuntado en el chat aparezcan en el catálogo de la tienda, selecciónalas abajo y súbelas en la sección <strong className="text-natural-accent font-semibold">"2. Sube tu Foto Original"</strong>. El servidor las guardará y actualizará la web inmediatamente.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Product Selection */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Product Selection Grid */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block">
              1. Selecciona tu Diseño a Retocar
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RETOUCH_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveProduct(prod)}
                  className={`p-3 rounded-2xl border text-left font-sans transition-all flex flex-col justify-between h-[100px] cursor-pointer group ${
                    activeProduct.id === prod.id
                      ? "bg-natural-accent text-white border-natural-accent shadow-sm"
                      : "bg-natural-card-bg hover:bg-natural-border/30 text-natural-text border-natural-border"
                  }`}
                >
                  <span className="text-[10px] font-bold block line-clamp-2 leading-tight group-hover:underline">
                    {prod.name}
                  </span>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      activeProduct.id === prod.id
                        ? "bg-white/20 text-white font-bold"
                        : "bg-white border border-natural-border text-[#8a8a7a]"
                    }`}>
                      {prod.category}
                    </span>
                    {uploadedImages[prod.id] && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="Foto personalizada subida" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Drag-and-Drop Image Uploader */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block">
              2. Sube tu Foto Original (Enviada en el Chat)
            </label>
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[24px] p-5 text-center transition-all ${
                isUploading
                  ? "border-amber-300 bg-amber-50/10 cursor-wait"
                  : currentImage 
                    ? "border-emerald-200 bg-emerald-50/20 cursor-pointer hover:bg-natural-card-bg/50" 
                    : "border-natural-border hover:border-natural-accent cursor-pointer hover:bg-natural-card-bg/50"
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                disabled={isUploading}
                className="hidden" 
              />
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2.5 rounded-full ${
                  isUploading 
                    ? "bg-amber-100 text-amber-700 animate-pulse" 
                    : currentImage 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-stone-100 text-stone-500"
                }`}>
                  {isUploading ? (
                    <svg className="animate-spin h-4 w-4 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="font-sans text-xs font-bold text-natural-dark block">
                    {isUploading 
                      ? "Guardando foto real en servidor..." 
                      : currentImage 
                        ? "¡Foto real cargada e integrada!" 
                        : "Haz clic para subir tu foto"}
                  </span>
                  <p className="font-sans text-[10px] text-[#8a8a7a]">
                    {isUploading 
                      ? "Se guardará directamente en el catálogo de la web" 
                      : currentImage 
                        ? "Tu foto real ahora reemplaza el diseño de muestra de la tienda" 
                        : `Sube '${activeProduct.rawFileName}'`}
                  </p>
                </div>
              </div>
            </div>
            
            {uploadError && (
              <p className="text-[11px] font-sans text-rose-600 font-semibold mt-1 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl">
                ⚠️ {uploadError}
              </p>
            )}
            
            {currentImage && !isUploading && (
              <p className="text-[10px] font-sans text-emerald-700 font-medium mt-1 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <span>✨</span> ¡Éxito! Esta foto se ha guardado en el servidor y está activa en el catálogo de productos de la web de inmediato.
              </p>
            )}
          </div>

          {/* 3. Retouching Presets */}
          <div className="space-y-4 bg-natural-card-bg p-5 rounded-3xl border border-natural-border">
            <div className="flex items-center gap-1.5 text-natural-accent">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <h4 className="font-serif font-bold text-sm text-natural-dark">Propuesta de Edición</h4>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-sans text-[10px] font-bold text-natural-accent block uppercase">
                  {activeProduct.recommendedIdea.title}
                </span>
                <p className="font-sans text-xs text-[#7a7a6a] leading-relaxed">
                  {activeProduct.recommendedIdea.description}
                </p>
              </div>

              <div className="border-t border-[#ecece4] pt-2.5 space-y-1.5 font-sans text-[10px]">
                <div className="flex justify-between">
                  <span className="text-[#8a8a7a] font-medium">Corrección de origen:</span>
                  <span className="text-rose-700 font-bold">{activeProduct.watermarkToRemove}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8a7a] font-medium">Atrezo y entorno propuesto:</span>
                  <span className="text-natural-dark font-bold text-right max-w-[160px] truncate" title={activeProduct.recommendedIdea.props}>
                    {activeProduct.recommendedIdea.props}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Live Retouched Preview Stage */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block">
              3. Escenario de Luz en Vivo (Vista Previa)
            </span>
          </div>

          {/* THE STAGE CANTON */}
          <div className="relative rounded-[32px] overflow-hidden aspect-square border border-natural-border shadow-md bg-stone-100 flex items-center justify-center">
            
            {/* Dynamic Background Preset Layer */}
            <div className={`absolute inset-0 w-full h-full transition-all duration-500 ${getBackgroundStyles()}`} />

            {/* Subtle paper grain texture to feel artisanal */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80')] pointer-events-none" />

            {/* Ambient Props Overlay Layer (Simulated via decorative vectors and warm depth-of-field lights) */}
            {addProps && removeBackground && (
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {/* Simulated bokeh warm sparkles */}
                <div className="absolute top-8 left-12 w-16 h-16 rounded-full bg-amber-200/15 blur-xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-amber-100/10 blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }} />
                
                {/* Craft details drawing based on active background */}
                {bgPreset === "taller" && (
                  <>
                    {/* Simulated elegant stitching outlines or floating threads on side margins */}
                    <div className="absolute bottom-3 left-4 text-[#8a8a7a]/25 font-sans text-[8px] flex flex-col font-bold">
                      <span>🧵 Hilos Mouliné</span>
                      <span>📍 Calibre 22</span>
                    </div>
                  </>
                )}
                {bgPreset === "musgo" && (
                  <div className="absolute top-4 right-4 text-[#ffffff]/35 font-sans text-[8px] flex flex-col font-bold text-right">
                    <span>🌿 Entorno Botánico</span>
                    <span>🌳 Luz de Komorebi</span>
                  </div>
                )}
              </div>
            )}

            {/* DYNAMIC LIGHTING OVERLAYS */}
            {removeBackground && (
              <div className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300">
                {/* Sunset Gold overlay */}
                {lightingPreset === "ventana" && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-200/5 mix-blend-color-burn" />
                )}
                
                {/* Spotlight Vignette */}
                {lightingPreset === "foco" && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)] mix-blend-multiply opacity-80" />
                )}

                {/* Soft glow behind product */}
                {lightingPreset === "difusa" && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(254,243,199,0.2)_0%,transparent_70%)] mix-blend-screen" />
                )}

                {/* Leaf Shadow Filter */}
                {lightingPreset === "hojas" && (
                  <div className="absolute inset-0 opacity-45 mix-blend-multiply bg-[linear-gradient(135deg,transparent_20%,rgba(21,128,61,0.1)_40%,transparent_50%,rgba(21,128,61,0.08)_60%,transparent_80%)]" />
                )}

                {/* Dramatic side light */}
                {lightingPreset === "drama" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-white/10 mix-blend-overlay" />
                )}
              </div>
            )}

            {/* THE PRODUCT IMAGE CANVAS */}
            <div className="relative z-10 w-[78%] h-[78%] flex items-center justify-center">
              {currentImage ? (
                <div className={`relative w-full h-full flex items-center justify-center transition-all ${
                  shadowDepth === "soft" ? "drop-shadow-lg" : shadowDepth === "dramatic" ? "drop-shadow-[15px_15px_15px_rgba(0,0,0,0.6)]" : ""
                }`}>
                  <img
                    src={currentImage}
                    alt="Tu foto de diseño artesanal"
                    style={{ 
                      filter: getFilterStyles(),
                      objectFit: removeBackground ? "contain" : "cover" 
                    }}
                    className={`w-full h-full transition-all duration-300 ${
                      removeBackground ? "rounded-none" : "rounded-[24px]"
                    }`}
                  />
                  
                  {/* Subtle watermarked overlay showing clipping mask preview */}
                  {removeBackground && (
                    <div className="absolute top-2 right-2 bg-emerald-500/90 text-[#f5f5f0] text-[8px] font-sans font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Check className="w-2.5 h-2.5" /> Fondo Editado
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback Illustrative Product Card with elegant mock filters */
                <div className="relative w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className={`relative w-full h-full flex items-center justify-center transition-all ${
                    shadowDepth === "soft" ? "drop-shadow-lg" : shadowDepth === "dramatic" ? "drop-shadow-[15px_15px_15px_rgba(0,0,0,0.4)]" : ""
                  }`}>
                    <img
                      src={activeProduct.fallbackImage}
                      alt="Modelo del catálogo de autor"
                      style={{ 
                        filter: getFilterStyles(),
                        objectFit: "cover" 
                      }}
                      className="w-full h-full object-cover rounded-[24px] transition-all duration-300"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 rounded-[24px] flex flex-col justify-center items-center p-6 text-white space-y-2">
                      <span className="font-sans text-[9px] uppercase tracking-widest bg-natural-accent px-2.5 py-1 rounded-full font-bold">
                        Demostración del Taller
                      </span>
                      <h5 className="font-serif italic font-bold text-sm leading-tight">
                        {activeProduct.name}
                      </h5>
                      <p className="font-sans text-[10px] opacity-80 leading-snug">
                        Sube tu propia foto de '{activeProduct.rawFileName}' para ver cómo se aplica este retoque automáticamente.
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-natural-accent font-sans text-[10px] font-bold px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3 h-3" /> Subir mi Diseño
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Foot note overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xs py-1.5 px-4 rounded-full border border-natural-border z-30 shadow-3xs flex items-center gap-2">
              <span className="font-sans text-[9px] font-bold text-[#8a8a7a]">
                Sombra de Contacto:
              </span>
              <div className="flex gap-1.5">
                {[
                  { id: "none", label: "Ninguna" },
                  { id: "soft", label: "Difusa" },
                  { id: "dramatic", label: "Fuerte" }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShadowDepth(s.id as any)}
                    className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                      shadowDepth === s.id
                        ? "bg-natural-accent text-white"
                        : "text-natural-text hover:bg-natural-bg"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick upload assistance */}
          {currentImage && (
            <div className="bg-emerald-50/45 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5 font-sans text-[11px] text-emerald-800">
                <span className="font-bold block">¡Increíble! Has subido tu propio diseño real</span>
                <p className="leading-relaxed opacity-90">
                  Usa los controles del panel de la derecha para ajustar el tono, el fondo y la iluminación. ¡Trabajaremos con este mismo estándar artesanal para tu catálogo final!
                </p>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Studio Precision Adjustments */}
        <div className="lg:col-span-3 space-y-6 bg-[#fcfbf9] border border-natural-border p-5 rounded-3xl">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> 4. Filtros y Ajustes de Precisión
            </span>
          </div>

          {/* Toggle buttons */}
          <div className="space-y-3 border-b border-[#ecece4] pb-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-[#7a7a6a] font-semibold">Recorte de Silueta:</span>
              <button
                onClick={() => setRemoveBackground(!removeBackground)}
                className={`relative w-9 h-5 rounded-full transition-all cursor-pointer ${removeBackground ? "bg-emerald-500" : "bg-stone-300"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${removeBackground ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-[#7a7a6a] font-semibold">Atrezo y Enfoque:</span>
              <button
                onClick={() => setAddProps(!addProps)}
                className={`relative w-9 h-5 rounded-full transition-all cursor-pointer ${addProps ? "bg-emerald-500" : "bg-stone-300"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${addProps ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>

          {/* Background Preset select */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block">
              A. Fondo del Entorno
            </label>
            <select
              value={bgPreset}
              onChange={(e) => setBgPreset(e.target.value)}
              className="w-full text-xs text-natural-dark px-3 py-2.5 border border-natural-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-natural-accent font-sans font-medium cursor-pointer"
            >
              <option value="taller">🧵 Taller de Lino y Agujas</option>
              <option value="madera">🪵 Roble y Cuero Rústico</option>
              <option value="estudio">🏛️ Mármol Blanco Minimalista</option>
              <option value="pizarra">🪨 Piedra Pizarra Gótica</option>
              <option value="musgo">🌿 Musgo Orgánico del Bosque</option>
              <option value="atelier">🎨 Atelier Creativo Pintoresco</option>
            </select>
          </div>

          {/* Lighting Overlay select */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block">
              B. Atmósfera de Luz
            </label>
            <div className="grid grid-cols-2 gap-1.5 font-sans">
              {[
                { id: "ventana", label: "🌅 Ventana Tarde" },
                { id: "foco", label: "🎯 Foco Cenital" },
                { id: "difusa", label: "💡 Luz Suave" },
                { id: "hojas", label: "🌿 Sol Komorebi" },
                { id: "drama", label: "🎭 Clarooscuro" }
              ].map((light) => (
                <button
                  key={light.id}
                  onClick={() => setLightingPreset(light.id)}
                  className={`text-[10px] py-2 px-1.5 rounded-lg border font-medium transition-all cursor-pointer text-left ${
                    lightingPreset === light.id
                      ? "bg-natural-accent text-[#f5f5f0] border-natural-accent shadow-3xs font-bold"
                      : "bg-white hover:bg-natural-bg text-natural-text border-natural-border"
                  }`}
                >
                  {light.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photographic Tint select */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8a8a7a] font-sans font-bold block">
              C. Filtro de Revelado
            </label>
            <div className="flex flex-wrap gap-1">
              {[
                { id: "none", label: "Original" },
                { id: "warm", label: "🔥 Cálido" },
                { id: "vintage", label: "📜 Sepia" },
                { id: "soft", label: "✨ Estudio" },
                { id: "gothic", label: "🖤 Gótico" }
              ].map((filt) => (
                <button
                  key={filt.id}
                  onClick={() => setColorFilter(filt.id)}
                  className={`text-[9px] px-2.5 py-1.5 rounded-md border font-bold transition-all cursor-pointer ${
                    colorFilter === filt.id
                      ? "bg-stone-800 text-white border-stone-800"
                      : "bg-white hover:bg-natural-bg text-[#8a8a7a] border-natural-border"
                  }`}
                >
                  {filt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders panel */}
          <div className="space-y-3.5 border-t border-[#ecece4] pt-4 font-sans text-xs text-[#7a7a6a]">
            
            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span>Brillo / Exposición</span>
                <span className="font-mono text-[#8a8a7a]">{brightness}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="140"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-natural-accent h-1 bg-natural-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span>Contraste</span>
                <span className="font-mono text-[#8a8a7a]">{contrast}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="140"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-natural-accent h-1 bg-natural-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span>Saturación de Color</span>
                <span className="font-mono text-[#8a8a7a]">{saturation}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-natural-accent h-1 bg-natural-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span>Suavizado de Ruido / Enfoque</span>
                <span className="font-mono text-[#8a8a7a]">{blurAmount}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.5"
                value={blurAmount}
                onChange={(e) => setBlurAmount(Number(e.target.value))}
                className="w-full accent-natural-accent h-1 bg-natural-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

          </div>

          {/* Download settings simulation */}
          <button 
            onClick={() => {
              alert(`¡Ajustes de Retoque Guardados!\nHemos registrado los parámetros seleccionados para procesar tus fotos '${activeProduct.rawFileName}' en nuestro taller de diseño.`);
            }}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold font-sans text-[11px] uppercase tracking-widest py-3 rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
          >
            <Palette className="w-3.5 h-3.5" /> Aprobar Parámetros
          </button>

        </div>

      </div>

      {/* FOOTER: Explanation of collaboration process */}
      <div className="mt-6 pt-6 border-t border-natural-border bg-natural-card-bg p-6 rounded-2xl space-y-4">
        <h4 className="font-serif italic font-bold text-sm text-natural-dark flex items-center gap-1.5">
          <Brush className="w-4.5 h-4.5 text-natural-accent" /> ¿Cómo perfeccionaremos tus fotos juntos paso a paso?
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans text-[#7a7a6a]">
          <div className="space-y-1">
            <span className="font-bold text-natural-dark block flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-natural-accent text-white flex items-center justify-center text-[10px]">1</span> 
              Subes la original en el Taller
            </span>
            <p className="leading-relaxed pl-6">
              Sube tus imágenes reales con ganchos, fondos verdes o marcas de agua directamente en este panel para que podamos ver las proporciones y la escala real del producto.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-natural-dark block flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-natural-accent text-white flex items-center justify-center text-[10px]">2</span> 
              Elegimos el entorno ideal
            </span>
            <p className="leading-relaxed pl-6">
              Votaremos la iluminación de estudio más favorecedora y el fondo orgánico (madera, lino, pizarra o musgo) que mejor sintonice con la personalidad y color de cada joya.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-natural-dark block flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-natural-accent text-white flex items-center justify-center text-[10px]">3</span> 
              Refinamos el acabado final
            </span>
            <p className="leading-relaxed pl-6">
              Recortaremos las siluetas milimétricamente, puliremos brillos y aplicaremos sombras proyectadas reales en Photoshop para que tus creaciones brillen con excelencia.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
