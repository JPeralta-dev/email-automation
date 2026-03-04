# Guía de Configuración Azure — email-automation

Guía completa para registrar y configurar la aplicación en Azure AD empresarial y ponerla en producción.

---

## Índice

1. [Registro de la aplicación en Azure Portal](#1-registro-de-la-aplicación-en-azure-portal)
2. [Configuración de permisos (API Permissions)](#2-configuración-de-permisos-api-permissions)
3. [Configuración de autenticación (Authentication)](#3-configuración-de-autenticación-authentication)
4. [Editar el Manifest](#4-editar-el-manifest)
5. [Crear el Client Secret](#5-crear-el-client-secret)
6. [Consentimiento de administrador (Admin Consent)](#6-consentimiento-de-administrador-admin-consent)
7. [Configurar variables de entorno (.env)](#7-configurar-variables-de-entorno-env)
8. [Primer login y prueba](#8-primer-login-y-prueba)
9. [Para cuentas de otros usuarios de la empresa](#9-para-cuentas-de-otros-usuarios-de-la-empresa)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Registro de la aplicación en Azure Portal

1. Ingresa a [https://portal.azure.com](https://portal.azure.com) con una cuenta que tenga permisos de administrador en el tenant empresarial.

2. En el menú lateral izquierdo o en el buscador superior, busca y selecciona **"Microsoft Entra ID"**.

3. En el menú izquierdo de Microsoft Entra ID, selecciona **"App registrations"**.

4. Haz clic en **"+ New registration"**.

4. Completa el formulario:
   - **Name:** `email-automation` (o el nombre que prefieras)
   - **Supported account types:** Selecciona:
     > ✅ **Accounts in this organizational directory only (Single tenant)**
     >
     > *(Si necesitas que usuarios de otras empresas también puedan usarlo, elige "Multitenant")*
   - **Redirect URI:** Selecciona `Web` y escribe `http://localhost:8000/callback`

5. Haz clic en **"Register"**.

6. Una vez creada, anota los siguientes valores (los necesitarás en el `.env`):
   - **Application (client) ID** → `CLIENT_ID`
   - **Directory (tenant) ID** → `TENANT_ID`

---

## 2. Configuración de permisos (API Permissions)

1. En el menú izquierdo de tu app, ve a **"API permissions"**.

2. Haz clic en **"+ Add a permission"**.

3. Selecciona **"Microsoft Graph"** → **"Delegated permissions"**.

4. Busca y activa los siguientes permisos:

   | Permiso | Descripción |
   |---|---|
   | `Mail.Read` | Leer correos |
   | `Mail.ReadWrite` | Leer y modificar correos (mover a carpetas) |
   | `Mail.Send` | Enviar correos |
   | `offline_access` | Mantener sesión activa (refresh token) |
   | `User.Read` | Leer perfil del usuario |

5. Haz clic en **"Add permissions"**.

> ⚠️ Los permisos son **Delegated** (actúan en nombre del usuario logueado), NO Application. Esto es correcto para el flujo Device Code que usa esta app.

---

## 3. Configuración de autenticación (Authentication)

1. En el menú izquierdo ve a **"Authentication"**.

2. En la sección **"Platform configurations"**, verifica que exista `Web` con la redirect URI `http://localhost:8000/callback`. Si no existe, agrégala con **"+ Add a platform"** → **"Web"**.

3. Agrega también esta redirect URI adicional:
   ```
   https://login.microsoftonline.com/common/oauth2/nativeclient
   ```

4. En la sección **"Advanced settings"**:
   - **Allow public client flows:** Activa esta opción en **"Yes"**

   > Esto es necesario para que el Device Code Flow funcione correctamente.

5. Haz clic en **"Save"**.

---

## 4. Editar el Manifest

1. En el menú izquierdo ve a **"Manifest"**.

2. Busca y edita los siguientes campos dentro del JSON:

   ```json
   "accessTokenAcceptedVersion": 2,
   ```

   ```json
   "allowPublicClient": true,
   ```

   Si vas a usar **solo cuentas del tenant empresarial** (recomendado para empresa):
   ```json
   "signInAudience": "AzureADMyOrg",
   ```

   Si quieres permitir cuentas personales Microsoft también:
   ```json
   "signInAudience": "AzureADandPersonalMicrosoftAccount",
   ```

3. Haz clic en **"Save"**.

> ⚠️ El campo `accessTokenAcceptedVersion: 2` es obligatorio para que los tokens sean compatibles con Microsoft Graph v1.0.

---

## 5. Crear el Client Secret

1. En el menú izquierdo ve a **"Certificates & secrets"**.

2. Haz clic en **"+ New client secret"**.

3. Completa:
   - **Description:** `email-automation-secret`
   - **Expires:** Elige el tiempo que prefieras (recomendado: 12 meses)

4. Haz clic en **"Add"**.

5. **¡Copia el valor inmediatamente!** Solo se muestra una vez. Este es tu `CLIENT_SECRET`.

---

## 6. Consentimiento de administrador (Admin Consent)

Para que la app funcione en un entorno empresarial, un administrador del tenant debe otorgar consentimiento a los permisos.

1. Ve a **"API permissions"**.

2. Haz clic en el botón **"Grant admin consent for [nombre del tenant]"**.

3. Confirma en el diálogo que aparece.

4. Verifica que todos los permisos muestren el estado **"Granted for [tenant]"** con un ✅ verde.

> Si no tienes permisos de administrador, deberás pedirle al administrador del tenant que realice este paso. Sin el admin consent, los usuarios del tenant verán una pantalla de error al intentar autenticarse.

---

## 7. Configurar variables de entorno (.env)

Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:

```env
CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLIENT_SECRET=tu_client_secret_aqui
TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REDIRECT_URI=http://localhost:8000/callback
```

- `CLIENT_ID` → Application (client) ID del paso 1
- `CLIENT_SECRET` → El secret creado en el paso 5
- `TENANT_ID` → Directory (tenant) ID del paso 1
- `REDIRECT_URI` → Debe coincidir exactamente con lo configurado en Azure

> ⚠️ El archivo `.env` está en `.gitignore` y **nunca debe subirse al repositorio**.

---

## 8. Primer login y prueba

Una vez configurado todo, ejecuta:

```bash
npm run start
```

La primera vez que no haya sesión guardada, la app mostrará automáticamente un código de dispositivo:

```
🔐 AUTORIZACIÓN REQUERIDA
To sign in, use a web browser to open the page https://microsoft.com/devicelogin
and enter the code XXXXXXXX to authenticate.
```

1. Abre el navegador y ve a [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin).
2. Ingresa el código que aparece en la terminal.
3. Inicia sesión con la cuenta empresarial que quieres usar.
4. Acepta los permisos solicitados.
5. La app guardará el token en `storage/token.json` y comenzará a monitorear los correos automáticamente.

Los próximos arranques con `npm run start` no pedirán login mientras el refresh token sea válido (hasta 90 días de inactividad en cuentas empresariales).

---

## 9. Para cuentas de otros usuarios de la empresa

Si otra persona de la empresa necesita usar la app con **su propia cuenta**:

1. Borra el archivo `storage/token.json`.
2. Ejecuta `npm run start`.
3. La app pedirá login nuevamente y el nuevo usuario sigue el proceso del paso 8.

> La app opera siempre en nombre del usuario autenticado. Cada usuario tiene su propio token y ve solo sus propios correos.

Si en cambio necesitas que la app acceda a **múltiples buzones al mismo tiempo** sin intervención del usuario, se requiere cambiar a permisos de tipo **Application** (no Delegated) y usar client credentials flow — esto requiere permisos adicionales de administrador.

---

## 10. Troubleshooting

### Error: `AADSTS50011` — Redirect URI mismatch
Verifica que la `REDIRECT_URI` en el `.env` sea exactamente igual a la configurada en Azure → Authentication.

### Error: `AADSTS65001` — No consent
El administrador no ha otorgado consentimiento. Repite el paso 6.

### Error: `401 Unauthorized` en Graph API
- Verifica que `accessTokenAcceptedVersion` sea `2` en el Manifest.
- Verifica que `allowPublicClient` sea `true`.
- Borra `storage/token.json` y vuelve a hacer login.

### Error: `AADSTS7000218` — Public client not allowed
Activa **"Allow public client flows"** en Authentication → Advanced settings.

### Token expira constantemente
Asegúrate de que el scope `offline_access` esté incluido en los permisos y en el `deviceCodeRequest` dentro de `deviceLogin.ts`.

### Error: `ErrorInvalidIdMalformed` al mover correos
El ID del mensaje puede estar corrupto. Verifica que el campo `id` venga correctamente desde `getEmailsFromTimeRange` y que no esté siendo transformado.

---

## Resumen rápido de checklist

- [ ] App registrada en Azure Portal
- [ ] Permisos: `Mail.Read`, `Mail.ReadWrite`, `Mail.Send`, `offline_access`, `User.Read`
- [ ] Redirect URI configurada: `http://localhost:8000/callback` y `nativeclient`
- [ ] Allow public client flows: **Yes**
- [ ] Manifest: `accessTokenAcceptedVersion: 2`
- [ ] Client Secret creado y guardado
- [ ] Admin consent otorgado
- [ ] `.env` configurado con los valores correctos
- [ ] `storage/` en `.gitignore`
- [ ] `npm run start` ejecutado y login completado