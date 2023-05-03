declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            secretKey: string;
        }
    }
}

export {}
