import dotenv from 'dotenv';

dotenv.config();

const TOKEN_KEY = process.env.TOKEN_KEY!;

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.f2lh8.mongodb.net/?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
    token_key: TOKEN_KEY,
};
