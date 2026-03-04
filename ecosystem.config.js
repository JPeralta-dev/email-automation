module.exports = {
  apps: [
    {
      name: "email-automation",
      script: "./dist/index.js",

      // ⚙️ Modo ejecución
      exec_mode: "fork",
      instances: 1,

      // 🔄 Reinicios
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 5000,

      // 🧠 Recursos
      max_memory_restart: "300M",

      // 📝 Logs
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      // 🌎 Variables de entorno
      env: {
        NODE_ENV: "production",
        TZ: "America/Bogota",
      },
    },
  ],
};
