import { seedState } from "./seedState";

export const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const cloneSeed = () => JSON.parse(JSON.stringify(seedState));