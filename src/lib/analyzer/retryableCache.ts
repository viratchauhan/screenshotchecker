/** Share pending initialization, but never retain a rejected promise. */
export function retryableCache<T>() {
  const cache = new Map<string, Promise<T>>();
  return (key: string, create: () => Promise<T>): Promise<T> => {
    const existing = cache.get(key);
    if (existing) return existing;
    const pending = Promise.resolve().then(create).catch(error => {
      if (cache.get(key) === pending) cache.delete(key);
      throw error;
    });
    cache.set(key, pending);
    return pending;
  };
}
