"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = __importDefault(require("zod"));
dotenv_1.default.config();
const envSchema = zod_1.default.object({
    CLIENT_ID: zod_1.default.string(),
    CLIENT_SECRET: zod_1.default.string(),
    TENANT_ID: zod_1.default.string(),
    REDIRECT_URI: zod_1.default.string(),
});
let env;
try {
    exports.env = env = envSchema.parse(process.env);
    console.log("Se cargaron correctamente ✔");
}
catch (error) {
    if (error instanceof zod_1.default.ZodError) {
        console.error("Se produjo un error al cargar las envs", Date().toString());
    }
    process.exit(1);
}
