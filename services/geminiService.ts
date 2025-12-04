import { GoogleGenAI, Type } from "@google/genai";
import { WalkRoute, RouteType, WeatherData, ZoneDensity } from '../types';

// IMPORTANT: In a real production app, move API calls to a backend proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartRoutes = async (
  startLocation: string,
  endLocation: string,
  weather: WeatherData
): Promise<WalkRoute[]> => {
  const modelId = "gemini-2.5-flash";

  const weatherDesc = `Temperature: ${weather.temperature}°C, Wind: ${weather.windSpeed}m/s, Raining: ${weather.weatherCode > 50 ? 'Yes' : 'No'}`;

  const prompt = `
    Act as an expert Belfast walking guide.
    Generate 3 distinct routes from "${startLocation}" to "${endLocation}" in Belfast, UK.
    Current Weather: ${weatherDesc}.

    The 3 routes must correspond exactly to these types:
    1. LEISURE: Scenic, passes landmarks, lower stress.
    2. FAST: Direct, shortest path, main roads.
    3. TRANSPORT: A route that involves walking to a bus/glider stop and taking transit (simulate the transit part).

    Return strictly JSON data adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: [RouteType.LEISURE, RouteType.FAST, RouteType.TRANSPORT] },
              title: { type: Type.STRING },
              duration: { type: Type.STRING },
              distance: { type: Type.STRING },
              scenicScore: { type: Type.NUMBER },
              crowdLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              description: { type: Type.STRING },
              landmarks: { type: Type.ARRAY, items: { type: Type.STRING } },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    instruction: { type: Type.STRING },
                    distance: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WalkRoute[];
    }
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini Route Error:", error);
    // Fallback data if API fails or quota exceeded
    return [
      {
        type: RouteType.LEISURE,
        title: "Laganside Scenic Walk",
        duration: "35 mins",
        distance: "2.4 km",
        scenicScore: 9,
        crowdLevel: "Medium",
        description: "A beautiful walk along the River Lagan, passing the Big Fish and waterfront.",
        landmarks: ["Big Fish", "Beacon of Hope", "Custom House Square"],
        steps: [{ instruction: "Head east towards the river" }, { instruction: "Follow the towpath north" }]
      },
      {
        type: RouteType.FAST,
        title: "City Centre Dash",
        duration: "20 mins",
        distance: "1.8 km",
        scenicScore: 4,
        crowdLevel: "High",
        description: "The most direct route through the main streets.",
        landmarks: ["Victoria Square"],
        steps: [{ instruction: "Walk straight down Chichester St" }, { instruction: "Turn left at Oxford St" }]
      },
      {
        type: RouteType.TRANSPORT,
        title: "Glider G1 Link",
        duration: "15 mins",
        distance: "0.5 km (Walk)",
        scenicScore: 5,
        crowdLevel: "High",
        description: "Walk to City Hall stop and take the G1 Glider.",
        landmarks: ["City Hall"],
        steps: [{ instruction: "Walk to City Hall Glider Stop" }, { instruction: "Take G1 Eastbound" }]
      }
    ];
  }
};

export const getBelfastDensityInsights = async (): Promise<ZoneDensity[]> => {
  const modelId = "gemini-2.5-flash";
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dayString = now.toLocaleDateString('en-UK', { weekday: 'long' });

  const prompt = `
    Estimate the current crowd density (0-100) for these Belfast zones: 
    Cathedral Quarter, Titanic Quarter, City Hall/Donegall Place, Queen's Quarter, Botanic Gardens.
    
    Current Time: ${dayString} ${timeString}.
    Consider typical footfall, nightlife, or work hours.

    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        densityScore: { type: Type.NUMBER },
                        populationTrend: { type: Type.NUMBER, description: "Previous hour comparison" },
                        time: { type: Type.STRING }
                    }
                }
            }
        }
    });

    if (response.text) {
        return JSON.parse(response.text) as ZoneDensity[];
    }
    return [];
  } catch (e) {
    console.error(e);
    return [
        { name: "City Centre", densityScore: 75, populationTrend: 80, time: "Now" },
        { name: "Titanic Quarter", densityScore: 40, populationTrend: 35, time: "Now" },
        { name: "Queens Quarter", densityScore: 60, populationTrend: 55, time: "Now" },
    ];
  }
}