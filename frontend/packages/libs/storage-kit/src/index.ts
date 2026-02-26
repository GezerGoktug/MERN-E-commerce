
const setItem = <T>(storageType: "sessionStorage" | "localStorage", key: string, value: T) => window[storageType].setItem(key, JSON.stringify(value));

const getItem = <T>(storageType: "sessionStorage" | "localStorage", key: string): { value: T, expired: number } => JSON.parse(window[storageType].getItem(key) as string);

const removeItem = (storageType: "sessionStorage" | "localStorage", key: string) => window[storageType].removeItem(key);

const setLocalStorage = <T>(key: string, value: T, expired = 1000 * 60 * 60 * 24 * 15) => setItem(
    "localStorage",
    key,
    { value, expired: new Date().getTime() + expired }
)

const setSessionStorage = <T>(key: string, value: T, expired = 1000 * 60 * 60 * 12) => setItem(
    "sessionStorage",
    key,
    { value, expired: new Date().getTime() + expired }
)


const getSessionStorage = <T>(key: string, defaultVal: T) => {
    const val = getItem<T>("sessionStorage", key);
    if (new Date().getTime() > val.expired) {
        return defaultVal;
    }
    return val.value;
}

const getLocalStorage = <T>(key: string, defaultVal: T) => {
    const val = getItem<T>("localStorage", key);
    if (!val?.value || new Date().getTime() > val.expired) {
        return defaultVal;
    }
    return val.value;
}

const removeSessionStorage = (key: string) => removeItem("sessionStorage", key);

const removeLocalStorage = (key: string) => removeItem("localStorage", key);


export { getLocalStorage, getSessionStorage, setLocalStorage, setSessionStorage, removeLocalStorage, removeSessionStorage };