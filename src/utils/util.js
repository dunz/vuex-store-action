export const isFunction = v => typeof v === 'function';

export const isObject = obj => (obj && typeof obj === 'object' ? true : false);

export const getObject = (obj = {}) => (
    isObject(obj) ? obj : {}
);

export const getArray = (iteratee = []) => {
    if (Array.isArray(iteratee)) {
        return iteratee ? Array.from(iteratee) : [];
    } else {
        return [];
    }
};

export const arrayMap = (list = [], mapper) => {
    const arr = getArray(list);
    return arr.map(mapper);
};