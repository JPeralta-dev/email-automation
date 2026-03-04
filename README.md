# 📧 Email Automation

Automatización de correos empresariales usando Microsoft Graph API. Monitorea una bandeja de entrada, detecta correos con asuntos específicos dentro de franjas horarias definidas, los reenvía a un destinatario con los adjuntos originales y los mueve a una carpeta "Procesados".

---

## Índice

- [¿Qué hace esta aplicación?](#qué-hace-esta-aplicación)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Despliegue con PM2](#despliegue-con-pm2)
- [Configuración Azure](#configuración-azure)

---

## ¿Qué hace esta aplicación?

Cada 60 segundos la app:

1. Lee los correos recibidos hoy en la bandeja de entrada
2. Filtra los que llegaron dentro de las franjas horarias configuradas
3. Verifica si el asunto contiene alguno de los números de teléfono (keywords) configurados
4. Si coincide: reenvía el correo con su cuerpo y adjuntos originales al destinatario configurado
5. Mueve el correo procesado a la carpeta **"Procesados"** (la crea si no existe)

### Franjas horarias activas

| Franja | Inicio | Fin |
|---|---|---|
| Mañana | 5:45 AM | 8:50 AM |
| Tarde | 5:45 PM | 6:50 PM |

### Keywords monitoreadas

```
573234802743 · 573107241341 · 573135841053 · 573124144099 · 573173645711
573183363756 · 573183363767 · 573157167788 · 573233052259 · 573165278214
```

---

## Estructura del proyecto

```
email-automation/
│
├── src/                          # Código fuente TypeScript
│   ├── index.ts                  # Punto de entrada principal
│   ├── login.ts                  # Script de login manual
│   │
│   ├── auth/
│   │   ├── auth.ts               # Configuración MSAL y obtención de tokens
│   │   └── deviceLogin.ts        # Flujo de autenticación Device Code
│   │
│   ├── config/
│   │   └── env.ts                # Validación y carga de variables de entorno
│   │
│   ├── services/
│   │   ├── mailReader.ts         # Lee correos desde Microsoft Graph
│   │   ├── mailSender.ts         # Reenvía correos con adjuntos
│   │   └── mailMove.ts           # Mueve correos a carpeta "Procesados"
│   │
│   └── utils/
│       ├── TimeRange.ts          # Verifica si una hora está en franja activa
│       ├── tokenStorage.ts       # Lectura y escritura del token en disco
│       └── types/
│           └── type.ts           # Interfaces TypeScript (Mail, TokenData, etc.)
│
├── dist/                         # Código compilado (generado por tsc, no editar)
├── storage/                      # Token de sesión (generado automáticamente, en .gitignore)
├── logs/                         # Logs de PM2 (generado automáticamente)
├── docs/
│   └── Azure.setup.md            # Guía completa de configuración en Azure
│
├── ecosystem.config.js           # Configuración de PM2
├── tsconfig.json                 # Configuración de TypeScript
├── package.json
├── .env                          # Variables de entorno (no subir al repo)
└── .gitignore
```

---

## Requisitos previos

- **Node.js** v20 o superior
- **npm**
- Cuenta Microsoft con acceso a la bandeja de entrada a monitorear
- Aplicación registrada en **Microsoft Entra ID** (ver [docs/Azure.setup.md](docs/Azure.setup.md))

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JPeralta-dev/email-automation.git
cd email-automation

# Instalar dependencias
npm install
```

---

## Configuración

Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:

```env
CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLIENT_SECRET=tu_client_secret_aqui
TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REDIRECT_URI=http://localhost:8000/callback
```

| Variable | Dónde encontrarla |
|---|---|
| `CLIENT_ID` | Azure Portal → tu app → **Application (client) ID** |
| `CLIENT_SECRET` | Azure Portal → tu app → **Certificados y secretos** |
| `TENANT_ID` | Azure Portal → tu app → **Directory (tenant) ID** |
| `REDIRECT_URI` | Debe coincidir con la configurada en Azure → Autenticación |

> Para una guía paso a paso de cómo obtener estos valores desde cero, ver [docs/Azure.setup.md](docs/Azure.setup.md).

---

## Uso

### Primera vez (requiere login interactivo)

```bash
npm run start
```

Al no existir sesión guardada, la app mostrará un código de dispositivo:

```
🔐 AUTORIZACIÓN REQUERIDA
Para iniciar sesión, usa un navegador para abrir https://microsoft.com/devicelogin
e ingresa el código: XXXXXXXX
```

1. Abre el navegador en [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin)
2. Ingresa el código
3. Inicia sesión con la cuenta empresarial
4. La sesión queda guardada en `storage/token.json`
5. La app comienza a monitorear automáticamente

### Usos posteriores

```bash
npm run start   # arranca directo sin pedir login
```

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run start` | Compila y ejecuta (login automático si no hay sesión) |
| `npm run dev` | Modo desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm run login` | Login manual independiente |

---

## Despliegue con PM2

PM2 mantiene la app corriendo en segundo plano y la reinicia automáticamente si falla.

### Instalación de PM2

```bash
npm install -g pm2
```

### Primer despliegue

```bash
# 1. Hacer login primero (una sola vez)
npm run start
# Completar el login, luego Ctrl+C

# 2. Compilar
npm run build

# 3. Arrancar con PM2
pm2 start ecosystem.config.js

# 4. Guardar para que reinicie con el sistema
pm2 save
pm2 startup
```

### Comandos útiles de PM2

```bash
pm2 status                        # Ver estado de la app
pm2 logs email-automation         # Ver logs en tiempo real
pm2 restart email-automation      # Reiniciar
pm2 stop email-automation         # Detener
pm2 delete email-automation       # Eliminar de PM2
```

### Logs

Los logs se guardan en:

```
logs/out.log      # Logs normales
logs/error.log    # Errores
```

---

## Configuración Azure

Para registrar la aplicación en Microsoft Entra ID desde cero, consulta la guía completa:

📄 **[docs/Azure.setup.md](docs/Azure.setup.md)**

Incluye todos los pasos: registro de la app, permisos, manifest, client secret, admin consent y troubleshooting de errores comunes.

---

## Personalización

### Cambiar keywords monitoreadas

En `src/index.ts`:

```typescript
const KEYWORDS = [
  "573234802743",
  // agregar o quitar números aquí
];
```

### Cambiar destinatario

En `src/index.ts`:

```typescript
const DESTINATION_EMAIL = "correo@destino.com";
```

### Cambiar franjas horarias

En `src/utils/TimeRange.ts`:

```typescript
const morningStart = 5 * 60 + 45;   // 5:45 AM
const morningEnd   = 8 * 60 + 50;   // 8:50 AM
const afternoonStart = 17 * 60 + 45; // 5:45 PM
const afternoonEnd   = 18 * 60 + 50; // 6:50 PM
```

### Cambiar carpeta de destino

En `src/services/mailMove.ts`:

```typescript
const folderId = await getOrCreateFolder(accessToken, "Procesados");
// cambiar "Procesados" por el nombre que quieras
```
