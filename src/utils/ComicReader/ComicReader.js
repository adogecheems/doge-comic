import fs from 'fs';
import isImg from '../tools/isImg';
import fileSort from '../tools/fileSort';

const SEGMENT_SIZE = 8;

export default class ComicReader {
    constructor(node, options = {}) {
        this.node = node;
        this.index = options.index || 0;
        this.offset = options.offset || 0;
        this.scale = options.scale || 1;
        this.manualScaled = false;

        this.urls = [];
        this.urlsSegments = [];
        this.segment = [];
    }

    async load() {
        if (this.node.type === 'file') {
            this.urls = [`file://${this.node.path}`];
        } else {
            const files = await fs.readdir(this.node.path, { withFileTypes: true });
            this.urls = files
                .filter(node => node.isFile() && isImg(node.name))
                .sort(fileSort)
                .map(node => `file://${this.node.path}/${node.name}`);
        }

        this.urlsSegments = [];
        for (let i = 0; i < this.urls.length; i += SEGMENT_SIZE) {
            this.urlsSegments.push(this.urls.slice(i, i + SEGMENT_SIZE));
        }
        this.refresh();
    }

    refresh() {
        this.segment = this.urlsSegments[this.index] || [];
    }

    getSegmentCount() {
        return this.urlsSegments.length;
    }

    prev() {
        if (this.index > 0) {
            this.index--;
            this.refresh();
        }
    }

    next() {
        if (this.index < this.getSegmentCount() - 1) {
            this.index++;
            this.refresh();
        }
    }

    go(index) {
        if (index >= 0 && index < this.getSegmentCount()) {
            this.index = index;
            this.refresh();
        }
    }

    getOffset() { return this.offset * this.scale; }
    setOffset(y) { this.offset = Math.floor(y / this.scale); }

    getProgress() { return { index: this.index, offset: this.offset, scale: this.scale, manualScaled: this.manualScaled }; }
    setProgress(p) {
        if (!p) return;

        this.index = p.index || 0;
        this.offset = p.offset || 0;
        this.manualScaled = p.manualScaled || false;
        if (this.manualScaled) this.scale = p.scale;
    }
}