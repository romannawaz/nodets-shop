import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY_ACCESS_TOKEN = process.env.SECRET_KEY_ACCESS_TOKEN || "";
const SECRET_KEY_REFRESH_TOKEN = process.env.SECRET_KEY_REFRESH_TOKEN || "";

const ACCESS_TOKEN_EXCPIRES_IN = process.env.ACCESS_TOKEN_EXCPIRES_IN || "5m";
const REFRESH_TOKEN_EXCPIRES_IN = process.env.REFRESH_TOKEN_EXCPIRES_IN || "8h";

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.f2lh8.mongodb.net/?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
  token_key: {
    access: SECRET_KEY_ACCESS_TOKEN,
    refresh: SECRET_KEY_REFRESH_TOKEN,
  },
  token_expires_in: {
    access: ACCESS_TOKEN_EXCPIRES_IN,
    refresh: REFRESH_TOKEN_EXCPIRES_IN,
  },
};
