import fs from "fs";
import { TokenData } from "./types/type";

export const TOKEN_PATH = "./storage/token.json";

if (!fs.existsSync("./storage")) {
  fs.mkdirSync("./storage", { recursive: true });
}
export function saveToken(data: TokenData) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(data, null, 2));
}

export function loadToken(): TokenData {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error("Token no encontrado");
  }
  return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
}

export function tokenExists(): boolean {
  return fs.existsSync(TOKEN_PATH);
}
