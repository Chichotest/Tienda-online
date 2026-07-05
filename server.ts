import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.log("GEMINI_API_KEY is not defined. Operating in high-quality creative fallback mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Fallback generators in case there is no API key yet
function getMockDesign(prompt: string) {
  const lowercase = prompt.toLowerCase();
  let theme = "Bosque Encantado";
  let description = "Diseño bordado a mano con motivos forestales, setas silvestres, hojas de roble en tonos verde musgo y pequeñas flores de manzanilla.";
  let colors = [
    { name: "Verde Musgo", hex: "#2d5a27" },
    { name: "Marrón Roble", hex: "#8b5a2b" },
    { name: "Blanco Manzanilla", hex: "#fcf8f2" },
    { name: "Amarillo Silvestre", hex: "#eab308" }
  ];
  let laces = "Cordón rústico de cáñamo natural o cinta de organza verde salvia";
  let embellishments = ["Mini abalorios de madera cosidos", "Puntera envejecida de estilo vintage"];
  let visualConcept = "Unas zapatillas blancas cubiertas de hilos texturizados que simulan musgo y pequeños brotes de helecho.";

  if (lowercase.includes("girasol") || lowercase.includes("girasoles") || lowercase.includes("sol")) {
    theme = "Amanecer de Girasoles";
    description = "Girasoles grandes bordados con relieve en los laterales exteriores, acompañados de margaritas de punto de nudo y hojas verdes texturizadas.";
    colors = [
      { name: "Amarillo Girasol", hex: "#eab308" },
      { name: "Marrón Semilla", hex: "#451a03" },
      { name: "Verde Botánico", hex: "#15803d" },
      { name: "Blanco Crema", hex: "#fafaf9" }
    ];
    laces = "Cinta de organza roja translúcida ancha para un lazo espectacular";
    embellishments = ["Detalle de encaje en el borde del tobillo", "Ojales metálicos dorados"];
    visualConcept = "Zapatillas altas con girasoles bordados de pétalos tridimensionales e hilos sedosos.";
  } else if (lowercase.includes("mar") || lowercase.includes("playa") || lowercase.includes("azul") || lowercase.includes("océano")) {
    theme = "Brisa de Alta Mar";
    description = "Bordados fluidos de olas de mar en punto de cadeneta con degradados de azul, acompañados de pequeñas conchas de mar en hilo de satén.";
    colors = [
      { name: "Azul Ultramar", hex: "#1d4ed8" },
      { name: "Azul Turquesa", hex: "#06b6d4" },
      { name: "Blanco Espuma", hex: "#f1f5f9" },
      { name: "Beige Arena", hex: "#f5f5f4" }
    ];
    laces = "Cordón trenzado de algodón estilo náutico bicolor azul y blanco";
    embellishments = ["Hilos metalizados plateados para reflejos de agua", "Ancla grabada en la lengüeta"];
    visualConcept = "Zapatillas blancas con un oleaje artístico bordado en espiral que recorre el talón y los laterales.";
  } else if (lowercase.includes("gotic") || lowercase.includes("gótico") || lowercase.includes("negro") || lowercase.includes("calavera")) {
    theme = "Noche Eterna / Misticismo";
    description = "Bordados de rosas negras con espinas entrelazadas y una pequeña luna creciente en hilo plateado metalizado sobre el talón.";
    colors = [
      { name: "Negro Obsidiana", hex: "#0c0a09" },
      { name: "Rojo Sangría", hex: "#991b1b" },
      { name: "Plata Metalizado", hex: "#94a3b8" }
    ];
    laces = "Cinta de satén negro noche de 2cm de ancho";
    embellishments = ["Mini tachuelas plateadas en la parte trasera", "Pin de media luna en los cordones"];
    visualConcept = "Zapatillas de aire gótico sofisticado, con espinas bordadas que parecen abrazar la lona.";
  }

  return {
    conceptName: theme,
    description: `[Simulación IA] Inspirado en "${prompt}": ${description}`,
    colorPalette: colors,
    recommendedLaces: laces,
    customizationPrice: 65,
    suggestedEmbellishments: embellishments,
    visualConceptDescription: visualConcept,
    isMock: true
  };
}

function getMockGift(recipient: string, style: string, budget: number) {
  return {
    recommendationTitle: "Combinación de Artesanía " + (style || "Personalizada"),
    explanation: `Hemos seleccionado una propuesta única para la persona que describes ("${recipient}"), priorizando el estilo "${style || "artesanal"}" y adaptándonos a tu presupuesto de ${budget}€ con piezas llenas de alma.`,
    suggestedProducts: [
      {
        productType: "pendientes",
        name: style.toLowerCase().includes("gotic") || style.toLowerCase().includes("rock") ? "Pendientes Corazón de Espinas" : "Pendientes Trisquel Celta",
        customizationIdea: "Podemos añadir un pequeño colgante de cuarzo o perla natural para darle un brillo extra."
      },
      {
        productType: "zapatillas",
        name: "Zapatillas Personalizadas 'Boceto de Ensueño'",
        customizationIdea: `Bordado sutil con las iniciales de ${recipient} entrelazadas en el talón con hilo dorado.`
      }
    ],
    isMock: true
  };
}

// 1. API: Design Creator Endpoint
app.post("/api/design-creator", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "El campo 'prompt' es obligatorio y debe ser una cadena de texto." });
  }

  const client = getGeminiClient();
  if (!client) {
    // Return high-quality mock design instantly
    const mock = getMockDesign(prompt);
    return res.json(mock);
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `El usuario quiere diseñar unas zapatillas de lona personalizadas bordadas a mano de forma artesanal. Su idea de diseño es: "${prompt}".
Genera un concepto de diseño detallado, coherente y hermoso.`,
      config: {
        systemInstruction: "Eres un maestro artesano experto en bordado a mano de zapatillas personalizadas y joyería de autor. Tu tarea es co-crear diseños junto con los clientes de la tienda online 'Alma & Hebra'. Devuelve el diseño estructurado en JSON según el esquema indicado.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptName: {
              type: Type.STRING,
              description: "Un título artístico y evocador para el concepto del diseño en español."
            },
            description: {
              type: Type.STRING,
              description: "Una descripción poética pero detallada de los bordados artesanales sugeridos, mencionando los puntos de costura (nudo celta, punto de cadeneta, satén, etc.) en español."
            },
            colorPalette: {
              type: Type.ARRAY,
              description: "Una paleta de 3 o 4 colores principales de hilo para el bordado.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Nombre poético del color en español." },
                  hex: { type: Type.STRING, description: "Código de color hexadecimal (ej. #eab308)." }
                },
                required: ["name", "hex"]
              }
            },
            recommendedLaces: {
              type: Type.STRING,
              description: "Recomendación del tipo y color de cordón o cinta (por ejemplo, 'Cinta de organza roja' o 'Cordón rústico de yute')."
            },
            customizationPrice: {
              type: Type.INTEGER,
              description: "Precio estimado en euros de la mano de obra artesanal (un entero sensato entre 45 y 85 euros)."
            },
            suggestedEmbellishments: {
              type: Type.ARRAY,
              description: "Lista de 2 o 3 detalles o adornos adicionales que elevarían la pieza (ej. perlas de río cosidas, iniciales en hilo de plata).",
              items: { type: Type.STRING }
            },
            visualConceptDescription: {
              type: Type.STRING,
              description: "Una descripción visual detallada de cómo lucirán las zapatillas listas en una foto de producto."
            }
          },
          required: [
            "conceptName",
            "description",
            "colorPalette",
            "recommendedLaces",
            "customizationPrice",
            "suggestedEmbellishments",
            "visualConceptDescription"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se recibió respuesta del modelo Gemini.");
    }

    const design = JSON.parse(text.trim());
    return res.json({ ...design, isMock: false });
  } catch (error: any) {
    console.error("Error en Gemini /api/design-creator:", error);
    // Graceful fallback on API error
    const mock = getMockDesign(prompt);
    return res.json({
      ...mock,
      errorFeedback: "El servicio de IA directo está cargando, hemos generado tu diseño usando nuestro catálogo artesanal preestablecido."
    });
  }
});

// 2. API: Gift Advisor Endpoint
app.post("/api/gift-advisor", async (req, res) => {
  const { recipient, style, budget } = req.body;
  if (!recipient || !style) {
    return res.status(400).json({ error: "Los campos 'recipient' y 'style' son requeridos." });
  }

  const budgetNum = Number(budget) || 50;

  const client = getGeminiClient();
  if (!client) {
    const mock = getMockGift(recipient, style, budgetNum);
    return res.json(mock);
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Ayuda a un cliente a elegir un regalo artesanal de nuestra tienda 'Alma & Hebra'.
El destinatario es: "${recipient}"
El estilo estético deseado es: "${style}" (por ejemplo: vintage, místico, gótico, alegre, minimalista, rústico, cottagecore).
El presupuesto máximo es: ${budgetNum} euros.

Recomienda de forma personalizada qué tipo de pieza regalar de nuestro taller artesanal (pendientes con labios de resina, pendientes de trisquel celta plateado, pulseras de cuero con hebilla circular de plata, o zapatillas altas bordadas a mano). Propón una idea para cada tipo de producto y justifícala con cariño.`,
      config: {
        systemInstruction: "Eres el consejero de regalos de 'Alma & Hebra'. Tu tono es extremadamente cálido, literario, entusiasta y muy enfocado en el valor emocional de las cosas hechas a mano y personalizadas.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendationTitle: {
              type: Type.STRING,
              description: "Un titular personalizado y entrañable (ej. 'La Colección Mística para Lucía')."
            },
            explanation: {
              type: Type.STRING,
              description: "Explicación detallada de por qué esta selección encaja a la perfección con la personalidad y el estilo del destinatario."
            },
            suggestedProducts: {
              type: Type.ARRAY,
              description: "Propuestas de regalos recomendados del catálogo de Alma & Hebra.",
              items: {
                type: Type.OBJECT,
                properties: {
                  productType: {
                    type: Type.STRING,
                    description: "El tipo de producto ('pendientes', 'pulseras', o 'zapatillas')."
                  },
                  name: {
                    type: Type.STRING,
                    description: "Nombre sugerido de la pieza artesanal (ej. 'Pendientes Trisquel Celta de Plata pulida')."
                  },
                  customizationIdea: {
                    type: Type.STRING,
                    description: "Idea concreta de personalización para este regalo (ej. 'Podemos grabar la fecha del aniversario en el interior del cuero de la pulsera')."
                  }
                },
                required: ["productType", "name", "customizationIdea"]
              }
            }
          },
          required: [
            "recommendationTitle",
            "explanation",
            "suggestedProducts"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se recibió respuesta del modelo Gemini.");
    }

    const advice = JSON.parse(text.trim());
    return res.json({ ...advice, isMock: false });
  } catch (error: any) {
    console.error("Error en Gemini /api/gift-advisor:", error);
    const mock = getMockGift(recipient, style, budgetNum);
    return res.json({
      ...mock,
      errorFeedback: "El consejero de IA directo está ocupado puliendo hilos. Te mostramos nuestra propuesta recomendada preestablecida."
    });
  }
});

// 3. API: Image Upload Endpoint (To save user's custom photos to the catalog)
app.post("/api/upload-image", (req, res) => {
  const { productId, base64Data } = req.body;
  if (!productId || !base64Data) {
    return res.status(400).json({ error: "Faltan datos de 'productId' o 'base64Data'." });
  }

  let baseName = "";
  switch (productId) {
    case "zapatillas_girasoles":
      baseName = "zapatillas_girasoles";
      break;
    case "pulsera_tierra":
    case "brazalete_cuero":
      baseName = "brazalete_cuero";
      break;
    case "pendientes_labios":
    case "labios_rojos":
      baseName = "labios_rojos";
      break;
    case "pendientes_espinas":
    case "corazon_alambre":
      baseName = "corazon_alambre";
      break;
    case "pendientes_trisquel":
    case "trisquel_celta":
      baseName = "trisquel_celta";
      break;
    case "pendientes_fantasia":
    case "taller_creativo":
      baseName = "taller_creativo";
      break;
    default:
      return res.status(400).json({ error: "Identificador de producto no reconocido." });
  }

  try {
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    let buffer;
    let extension = "png"; // fallback por defecto
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], "base64");
      const mime = matches[1].toLowerCase();
      if (mime.includes("jpeg") || mime.includes("jpg")) {
        extension = "jpg";
      } else if (mime.includes("webp")) {
        extension = "webp";
      } else if (mime.includes("png")) {
        extension = "png";
      }
    } else {
      buffer = Buffer.from(base64Data, "base64");
    }

    const filename = `${baseName}.${extension}`;
    const publicImagesDir = path.join(process.cwd(), "public", "images");
    const distImagesDir = path.join(process.cwd(), "dist", "images");

    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }
    
    const publicPath = path.join(publicImagesDir, filename);
    fs.writeFileSync(publicPath, buffer);
    console.log(`[Upload] Image saved to public: ${publicPath}`);

    if (fs.existsSync(path.join(process.cwd(), "dist"))) {
      if (!fs.existsSync(distImagesDir)) {
        fs.mkdirSync(distImagesDir, { recursive: true });
      }
      const distPath = path.join(distImagesDir, filename);
      fs.writeFileSync(distPath, buffer);
      console.log(`[Upload] Image saved to dist: ${distPath}`);
    }

    return res.json({ success: true, url: `/images/${filename}` });
  } catch (err: any) {
    console.error("Error saving uploaded image:", err);
    return res.status(500).json({ error: "No se pudo guardar la imagen en el servidor: " + err.message });
  }
});

// Serve frontend build static files & mount Vite middleware in development
async function setupViteAndListen() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running and listening on http://0.0.0.0:${PORT}`);
  });
}

setupViteAndListen();
