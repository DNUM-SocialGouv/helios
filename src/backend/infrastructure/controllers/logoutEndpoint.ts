import appCache from "../../cacheProvider";

export async function logoutEndpoint(): Promise<void> {
    try {
        return appCache.flushAll();

    } catch (error) {
        throw error;
    }
}