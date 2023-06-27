// below this, have to call at client because of localStorage
// call this in useEffect()

export const loadNickname = (): Promise<string> => {
  return loadPromise("nickname", "", (item) => item);
};
export const saveNickname = (nickname: string): Promise<string> => {
  return savePromise("nickname", nickname, (item) => item);
};

export const loadPromise = <T>(
  key: string,
  init: T,
  fromString: (item: string) => T
): Promise<T> => {
  return new Promise((resolve) => {
    let itemStr = localStorage.getItem(key);
    if (itemStr) {
      resolve(fromString(itemStr));
    } else {
      resolve(init);
    }
  });
};

export const savePromise = <T>(key: string, value: T, toStr: (item: T) => string): Promise<T> => {
  return new Promise((resolve) => {
    localStorage.setItem(key, toStr(value));
    resolve(value);
  });
};
