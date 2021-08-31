export const waitAndFlatten = async <T>(promiseArray: Array<Promise<T[]>>): Promise<T[]> => {
  const resolved = await Promise.all(promiseArray);
  const flattened = resolved.flat();

  return flattened;
}
