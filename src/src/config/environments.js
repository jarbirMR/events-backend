const envs = {
    PORT: parseInt(process.env.PORT || "3000"),
    DEFAULT_AVATAR: process.env.DEFAULT_AVATAR,
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: parseInt(process.env.DB_PORT || "3311"),
    DB_USER: process.env.DB_USER || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_NAME: process.env.DB_NAME || "",
    JWT_SEED: process.env.JWT_SEED || "",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_HOST: process.env.EMAIL_HOST || "",
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT || "465"),
    
  };
  
  module.exports = envs;