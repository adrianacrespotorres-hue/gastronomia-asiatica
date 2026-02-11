import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SlideContent, SlideLayout } from '../types';

export const generatePresentation = async (): Promise<SlideContent[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        body: { type: Type.STRING },
        bulletPoints: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        imageKeyword: { type: Type.STRING, description: "A single english keyword for finding a relevant image (e.g. 'sushi', 'rice', 'spices')" },
        layout: { 
            type: Type.STRING, 
            enum: [
                'TITLE_ONLY',
                'TEXT_AND_IMAGE',
                'BULLET_POINTS',
                'CHART',
                'CONCLUSION'
            ] 
        },
        chartData: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    value: { type: Type.INTEGER }
                }
            },
            description: "Only required if layout is CHART. Provide 4-5 data points."
        },
        chartLabel: { type: Type.STRING }
      },
      required: ['id', 'title', 'body', 'layout', 'imageKeyword']
    }
  };

  const prompt = `
    Actúa como un experto historiador de la cultura asiática y gastronomía.
    Genera el contenido para una presentación de 10 diapositivas dirigida a estudiantes de gastronomía.
    
    El tema es: "La cultura asiática: Tradiciones, Historia y Evolución en la Gastronomía".
    
    Requisitos:
    1. Idioma: Español.
    2. Tono: Profesional, académico, inspirador y didáctico.
    3. Estructura:
       - Slide 1: Título e Introducción.
       - Slide 2: Fundamentos Filosóficos (Yin Yang, 5 Elementos en la comida).
       - Slide 3: Ingredientes Históricos (Arroz, Soja, Té).
       - Slide 4: La Ruta de las Especias y su influencia.
       - Slide 5: Técnicas de Cocina Milenarias (Wok, Fermentación).
       - Slide 6: Etiqueta y Tradiciones de Mesa.
       - Slide 7: Evolución y Fusión Moderna.
       - Slide 8: Gráfico estadístico (Layout: CHART). Ejemplo: Consumo de arroz vs trigo, o popularidad de platillos.
       - Slide 9: Impacto Global y Diáspora.
       - Slide 10: Conclusión.
    
    Asegúrate de que la diapositiva 8 tenga datos numéricos interesantes para un gráfico.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: "Eres un diseñador instruccional experto en gastronomía."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as SlideContent[];
  } catch (error) {
    console.error("Error generating presentation:", error);
    // Fallback data in case of API failure (for robustness)
    return [
      {
        id: 1,
        title: "Error de Generación",
        body: "No se pudo conectar con el historiador virtual. Por favor intenta de nuevo.",
        layout: SlideLayout.TitleOnly,
        imageKeyword: "error"
      }
    ];
  }
};