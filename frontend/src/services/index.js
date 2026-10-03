import { mockServices } from "./mock/index.js";
import { apiServices } from "./api/index.js";
export const isMock = (import.meta.env.VITE_DATA_SOURCE || "mock") === "mock";
if (!["mock", "api"].includes(import.meta.env.VITE_DATA_SOURCE || "mock"))
  throw new Error("VITE_DATA_SOURCE debe ser mock o api.");
export const services = isMock ? mockServices : apiServices;
