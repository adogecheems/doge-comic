import fs from 'fs';
import isImg from '../tools/isImg';
import fileSort from '../tools/fileSort';

function formatSize(size) {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

export default class FileManager {
    constructor(root = "/userdisk/Favorite") {
        this._stack = root.split('/').filter(Boolean);
        this._version = 0;

        this.loading = true;
        this.error = false;
        this.nodeList = [];

        this._refresh();
    }

    get cwd() {
        return '/' + this._stack.join('/');
    }

    getPath(node, root = this.cwd) {
        return `${root}/${node.name || node}`;
    }

    async getStat(node, root = this.cwd) {
        return await fs.stat(this.getPath(node, root));
    }

    async _refresh() {
        const version = ++this._version;
        this.loading = true;
        this.error = false;

        try {
            const list = await Promise.all(
                (await fs.readdir(this.cwd, { withFileTypes: true }))
                    .map(async node => ({
                        name: node.name,
                        size: node.isDirectory()
                            ? null
                            : formatSize((await this.getStat(node)).size),
                        isDir: node.isDirectory()
                    }))
            );

            if (version !== this._version) return;

            const processedList = await Promise.all(
                list.map(async node => {
                    if (node.isDir) {
                        const preRead = await fs.readdir(this.getPath(node));
                        const imgs = preRead.filter(isImg);

                        if (preRead.length > 0 && imgs.length / preRead.length > 0.8) {
                            let size = formatSize((await Promise.all(preRead
                                .map(async n => (await this.getStat(n, `${this.cwd}/${node.name}`)).size)))
                                .reduce((sum, size) => sum + size));

                            return { ...node, isComic: true, size }
                        }

                        return node;
                    } else {
                        if (isImg(node.name)) return node;
                    }
                })
            );

            this.nodeList = processedList
                .filter(Boolean)
                .sort(fileSort);

        } catch (e) {
            if (version !== this._version) return;
            this.nodeList = [];
            this.error = true;
        }

        if (version === this._version) { this.loading = false; }
    }

    chooseFile(index) {
        const node = this.nodeList[index];
        if (!node) return null;

        if (node.isDir && !node.isComic) {
            this._stack.push(node.name);
            this._refresh();
            return null;
        }

        return {
            path: this.getPath(node),
            type: node.isDir ? 'folder' : 'file'
        };
    }

    goBack() {
        if (this._stack.length <= 1) return false;

        this._stack.pop();
        this._refresh();
        return true;
    }
}
