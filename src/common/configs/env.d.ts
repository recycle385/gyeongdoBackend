declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: string;

    BACKEND_URL: string;

    REDIS_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: string;

    REDIS_PASSWORD?: string;
    REDIS_ARGS?: string;
  }
}
