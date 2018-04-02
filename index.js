import {isFunction, isObject} from './src/utils/util';

const STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    ERROR: 'error',
    SIMPLE: 'simple'
};

const customCommit = {
    [STATUS.SIMPLE]: ({commit}, type, payload) => commit(type, {payload, isCustom: true}),
    [STATUS.PENDING]: ({commit}, type, payload) => commit(`${type}_PENDING`, {payload, isCustom: true}),
    [STATUS.SUCCESS]: ({commit}, type, payload, params) => commit(`${type}_SUCCESS`, {payload, params, isCustom: true}),
    [STATUS.ERROR]: ({commit}, type, payload, params) => commit(`${type}_ERROR`, {payload, params, isCustom: true})
};

const customMutation = {
    [STATUS.SIMPLE](type, isExecutes = [], mutation) {
        isExecutes.includes(STATUS.SIMPLE) && isFunction(mutation) && mutation();
    },
    [STATUS.PENDING](type, isExecutes = [], mutation) {
        isExecutes.includes(STATUS.PENDING) && isFunction(mutation) && mutation();
    },
    [STATUS.SUCCESS](type, isExecutes = [], mutation) {
        isExecutes.includes(STATUS.SUCCESS) && isFunction(mutation) && mutation();
    },
    [STATUS.ERROR](type, isExecutes = [], mutation) {
        isExecutes.includes(STATUS.ERROR) && isFunction(mutation) && mutation();
    }
};

const simpleActionCreator = (type, payloadCreator) => (store, payload) => {
    isFunction(payloadCreator) && payloadCreator();
    customCommit.simple(store, type, payload);
};

const promiseActionCreator = (type, payloadCreator, ignoreCaught = false) => (store, params) => {
    const promise = ignoreCaught ?
        payloadCreator(params, store).catch(err => ({caught: true, err})) :
        payloadCreator(params, store);
    
    return new Promise((resolve, reject) => {
        if (promise) {
            customCommit.pending(store, type, params);
            return promise.then(data => {
                if (!(isObject(data) && data.caught)) {
                    customCommit.success(store, type, data, params);
                    resolve(data);
                }
            }).catch(error => {
                customCommit.error(store, type, error, params);
                reject(error);
            });
        } else {
            resolve();
        }
    });
};

const createMutation = (type, status, mutation) => (state, origin) => {
    let payload = origin, params = null;
    if (origin.isCustom) {
        payload = origin.payload;
        params = origin.params;
    }
    if (isFunction(mutation)) {
        customMutation[status](type, [STATUS.SUCCESS, STATUS.SIMPLE], () => {
            mutation(state, payload, params);
        });
    } else {
        mutation[status](state, payload, params);
        customMutation[status](type);
    }
};

export const createAction = (type, payloadCreator, ignoreCaught) => {
    if (isFunction(payloadCreator)) {
        return promiseActionCreator(type, payloadCreator, ignoreCaught);
    } else {
        return simpleActionCreator(type, payloadCreator);
    }
};

export const handleMutations = mutations => {
    Object.keys(mutations).forEach(type => {
        mutations[`${type}_PENDING`] = createMutation(type, STATUS.PENDING, mutations[type]);
        mutations[`${type}_SUCCESS`] = createMutation(type, STATUS.SUCCESS, mutations[type]);
        mutations[`${type}_ERROR`] = createMutation(type, STATUS.ERROR, mutations[type]);
        mutations[type] = createMutation(type, STATUS.SIMPLE, mutations[type]);
    });
    return mutations;
};