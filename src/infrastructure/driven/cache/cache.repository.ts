/* eslint-disable */

import {CacheRepositoryPort} from "../../../ports/outputs/cache/cache.repository.port";

export class CacheRepository implements CacheRepositoryPort {
    getKey(key: string) {}

    setKey(key: string, value: Record<any, any>): void {}
}
