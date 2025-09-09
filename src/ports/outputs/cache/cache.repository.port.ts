/* eslint-disable */
export interface CacheRepositoryPort {
    setKey(key: string, value: Record<any, any>): void;
    getKey(key: string): any;
}

export const CACHE_REPOSITORY_PORT = Symbol("CacheRepositoryPort");
