class MockDirent {
    constructor(name, type, size = 0) {
        this.name = name;
        this.type = type; // 'file' | 'dir'
        this.size = size;
    }

    isDirectory() {
        return this.type === 'dir';
    }
    isFile() {
        return this.type === 'file';
    }
}

const mockFileTree = {
    "/userdisk": [
        new MockDirent("Pictures", "dir"),
        new MockDirent("笔记.txt", "file"),
    ],
    "/userdisk/Favorite": [
        new MockDirent("icon.png", "file"),
    ]
};

const fs = {
    async readdir(path, options = {}) {
        if (!mockFileTree[path]) {
            throw new Error("Path not found: " + path);
        }

        if (options.withFileTypes) {
            return mockFileTree[path];
        }

        return mockFileTree[path].map(node => node.name);
    },
    async stat(path) {
        if (mockFileTree[path]) {
            return {
                size: 0
            };
        }

        const parts = path.split('/').filter(Boolean);
        const name = parts.pop();
        const dirPath = '/' + parts.join('/');

        const dir = mockFileTree[dirPath];
        if (!dir) {
            throw new Error("Path not found: " + path);
        }

        const node = dir.find(item => item.name === name);
        if (!node) {
            throw new Error("File not found: " + path);
        }

        return {
            size: node.size
        };
    }
};

export default fs;
