import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type Setter<T> = (value: T) => void;

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: Setter<T[K]>;
};

type ValueTypes = string | number | Array<number | string> | null;


export function useQueryParams<T extends Record<string, ValueTypes>>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryState = useMemo(() => {
    const obj = { ...defaults };

    Object.keys(defaults).forEach((key) => {
      const param = searchParams.get(key);
      if (param !== null) {
        const defaultValue = defaults[key as keyof T];

        if (typeof defaultValue === 'number') {
          obj[key as keyof T] = Number(param) as T[keyof T];
        } else if (param === 'null') {
          obj[key as keyof T] = null as T[keyof T];
        } else if (Array.isArray(defaultValue)) {
          obj[key as keyof T] = searchParams.getAll(key) as T[keyof T];
        } else {
          obj[key as keyof T] = param as T[keyof T];
        }
      }
    });

    return obj as T;
  }, [searchParams, defaults]);

  const querySetters = useMemo(() => {
    const setters = {} as Setters<T>;

    Object.keys(defaults).forEach((key) => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      const setterName = `set${capitalizedKey}` as keyof Setters<T>;

      (setters[setterName] as Setter<T[typeof key]>) = (value) => {        
        const newParams = new URLSearchParams(searchParams);
        if (
          value === null ||
          value === '' ||
          value === defaults[key as keyof T]
        ) {
          newParams.delete(key);
        } else if (Array.isArray(defaults[key as keyof T])) {
          newParams.delete(key);
          (value as Array<string | number>).forEach((item) => {
            newParams.append(key, item.toString());
          });
        } else {
          newParams.set(key, String(value));
        }
        newParams.sort();

        setSearchParams(newParams);
      };
    });

    return setters;
  }, [searchParams, setSearchParams, defaults]);

  const clearQuery = () => setSearchParams(new URLSearchParams());

  return { queryState, clearQuery, querySetters };
}
