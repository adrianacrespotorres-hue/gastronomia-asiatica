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
        imageKeyword: { type: Type.STRING, description: "Detailed English keyword for historical Asian food/culture imagery" },
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
            }
        },
        chartLabel: { type: Type.STRING }
      },
      required: ['id', 'title', 'body', 'layout', 'imageKeyword']
    }
  };

  const prompt = `
    Eres un distinguido historiador de la cultura asiática y catedrático de gastronomía mundial.
    Genera una presentación magistral titulada "Ecos del Pasado: La Odisea de la Cocina Asiática".
    
    Contenido requerido (10 diapositivas):
    1. Portada: Título evocador y subtítulo académico.
    2. Filosofía del Sabor: El equilibrio del Tao y los cinco sabores elementales.
    3. El Grano Sagrado: Historia social del arroz y su domesticación.
    4. Alquimia de la Soja: Del grano a la salsa y el tofu (importancia histórica).
    5. La Ruta de la Seda y Especias: Cómo el comercio transformó el paladar global.
    6. Maestría del Fuego: Evolución técnica desde hornos antiguos hasta el wok.
    7. Ceremonialismo: La etiqueta en la dinastía Tang o el período Edo.
    8. Estadística de Influencia (CHART): Porcentaje de popularidad histórica de técnicas (Fermentación, Vapor, Fritura, Crudo).
    9. Modernidad Crítica: Cómo la tradición sobrevive en la alta cocina contemporánea.
    10. Legado Eterno: Reflexión final sobre la gastronomía como patrimonio inmaterial.

    Lenguaje: Académico, rico en adjetivos históricos y poético. Español formal.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: "Eres un experto en curaduría de museos gastronómicos."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from API");
    return JSON.parse(text) as SlideContent[];
  } catch (error) {
    console.error("API Error:", error);
    return [
      {
        id: 1,
        title: "Error de Conexión Histórica",
        body: "Asegúrate de haber configurado la API_KEY en las variables de entorno de tu proyecto.",
        layout: SlideLayout.TitleOnly,
        imageKeyword: "history"
      }
    ];
  }
};