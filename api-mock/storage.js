const _store = {};

function clone(value) {
    if (typeof value === 'object') {
        return JSON.parse(JSON.stringify(value));
    }
    return value;
}

export default {

    async getStorage(key) {
        if (typeof key !== 'string') {
            throw new Error('invalid key');
        }

        if (!_store.hasOwnProperty(key)) {
            return null;
        }

        return clone(_store[key]);
    },

    async setStorage(key, value) {
        if (typeof key !== 'string') {
            throw new Error('invalid key');
        }

        _store[key] = clone(value);
        return 0;
    },

    async getStorageKeys() {
        return Object.keys(_store);
    },

    async removeStorage(key) {
        if (typeof key !== 'string') {
            throw new Error('invalid key');
        }

        delete _store[key];
        return 0;
    },

    async clearStorage() {
        const keys = Object.keys(_store);
        for (let i = 0; i < keys.length; i++) {
            delete _store[keys[i]];
        }
        return 0;
    }

};