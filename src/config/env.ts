import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  TENANT_ID: z.string(),
  REDIRECT_URI: z.string(),
});

let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
  console.log("Se cargaron correctamente ✔");
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Se produjo un error al cargar las envs", Date().toString());
  }
  process.exit(1);
}

export { env };
