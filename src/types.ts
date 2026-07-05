export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "zapatillas" | "pulseras" | "pendientes";
  materials: string[];
  features: string[];
  isCustomizable: boolean;
  imageAlt: string;
  image?: string;
  fallbackImage?: string;
  // Visual properties for mock representation since generated image quota is reached
  colorAccent: string;
  badge?: string;
  details: string;
}

export interface CartItem {
  id: string; // unique for cart item (e.g. product.id + customization options hash)
  product: Product;
  quantity: number;
  selectedSize?: string; // For sneakers (36-44)
  customization?: {
    isAICreated?: boolean;
    conceptName?: string;
    description?: string;
    lacesColor?: string;
    lacesType?: string;
    embroideryName?: string;
    customLettering?: string;
    embellishments?: string[];
    priceAdjustment?: number;
  };
}

export interface AICreatedDesign {
  conceptName: string;
  description: string;
  colorPalette: { name: string; hex: string }[];
  recommendedLaces: string;
  customizationPrice: number;
  suggestedEmbellishments: string[];
  visualConceptDescription: string;
  isMock: boolean;
}

export interface GiftAdvice {
  recommendationTitle: string;
  explanation: string;
  suggestedProducts: {
    productType: "pendientes" | "pulseras" | "zapatillas";
    name: string;
    customizationIdea: string;
  }[];
  isMock: boolean;
}
