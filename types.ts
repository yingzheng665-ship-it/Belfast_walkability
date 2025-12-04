export interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  cloudCover: number;
  isDay: boolean;
  weatherCode: number;
}

export interface UTCIResult {
  value: number;
  stressCategory: string;
  description: string;
  color: string;
}

export enum RouteType {
  LEISURE = 'LEISURE',
  FAST = 'FAST',
  TRANSPORT = 'TRANSPORT'
}

export interface RouteStep {
  instruction: string;
  distance?: string;
}

export interface WalkRoute {
  type: RouteType;
  title: string;
  duration: string;
  distance: string;
  scenicScore: number; // 0-10
  crowdLevel: 'Low' | 'Medium' | 'High';
  description: string;
  steps: RouteStep[];
  landmarks: string[];
}

export interface ZoneDensity {
  name: string;
  densityScore: number; // 0-100 (100 is very crowded)
  populationTrend: number; // For chart
  time: string;
}