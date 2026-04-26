import storage from 'storage';

function getNow() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default class Setting {
    async _get(key) {
        try {
            const value = await storage.getStorage(key);
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    }

    async _set(key, value) {
        try {
            await storage.setStorage(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    async addItem(node, progress, target = 'history') {
        let history = await this._get(target);
        if (!history) {
            history = [];
        }

        if (target === 'history') {
            history = history.filter(item => item.node.path !== node.path);
        }
        history.push({ node, progress, time: getNow() });

        await this._set(target, history);
    }

    async getItem(node, target = 'history') {
        let history = await this._get(target);
        if (!history) {
            return null;
        }

        const item = history.find(item => item.node.path === node.path);
        if (!item) {
            return null;
        }

        return item.progress;
    }

    async clearItems(target = 'history') {
        await this._set(target, []);
    }

    async getAllItems(target = 'history') {
        let history = await this._get(target);
        if (!history) {
            return [];
        }

        return history;
    }

    async setScale(scale) {
        if (scale >= 0.5 && scale <= 2) {
            await this._set('scale', scale);
        }
    }

    async getScale() {
        if (await this._get('scale')) {
            return await this._get('scale');
        } else {
            await this._set('scale', 1);
            return 1;
        }
    }

    async setSyncTime(syncTime) {
        if (syncTime >= 300 && syncTime <= 3000) {
            await this._set('syncTime', syncTime);
        }
    }

    async getSyncTime() {
        if (await this._get('syncTime')) {
            return await this._get('syncTime');
        } else {
            await this._set('syncTime', 1000);
            return 1000;
        }
    }

    async setDebugMode(isDebug) {
        if (isDebug === true || isDebug === false) {
            await this._set('isDebug', isDebug);
        }
    }

    async isDebugMode() {
        if (await this._get('isDebug')) {
            return await this._get('isDebug');
        } else {
            await this._set('isDebug', false);
            return false;
        }
    }
}