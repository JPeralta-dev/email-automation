"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_PATH = void 0;
exports.saveToken = saveToken;
exports.loadToken = loadToken;
exports.tokenExists = tokenExists;
const fs_1 = __importDefault(require("fs"));
exports.TOKEN_PATH = "./storage/token.json";
if (!fs_1.default.existsSync("./storage")) {
    fs_1.default.mkdirSync("./storage", { recursive: true });
}
function saveToken(data) {
    fs_1.default.writeFileSync(exports.TOKEN_PATH, JSON.stringify(data, null, 2));
}
function loadToken() {
    if (!fs_1.default.existsSync(exports.TOKEN_PATH)) {
        throw new Error("Token no encontrado");
    }
    return JSON.parse(fs_1.default.readFileSync(exports.TOKEN_PATH, "utf-8"));
}
function tokenExists() {
    return fs_1.default.existsSync(exports.TOKEN_PATH);
}
