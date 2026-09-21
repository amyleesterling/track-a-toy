export {};
declare global {
  interface Window {
    trackAToy?: {
      toyId: () => string;
      stageIndex: () => number;
      stageCount: () => number;
      routeKm: () => number;
      problems: string[];
    };
  }
}
