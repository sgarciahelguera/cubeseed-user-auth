declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            SECRET_KEY: string;
            DB_HOST: string;
            DB_USER: string;
            DB_PASSWORD: string;
        }
    }
}

export {}
