<template>
    <div class="card" @click="$emit('click')">
        <image class="preview" resize="cover" :src="preview" />
        <div style="flex: 1;">
            <text class="name">{{ node.path.split('/').pop() }}</text>
            <text class="time">{{ time }}</text>
        </div>
    </div>
</template>

<script>
import fs from 'fs';
import isImg from '../utils/tools/isImg';
import fileSort from '../utils/tools/fileSort';

export default {
    name: "HistoryCard",
    props: {
        node: { type: Object, required: true },
        time: { type: String, required: true },
    },
    data() {
        return {
            preview: '',
        }
    },
    async created() {
        if (this.node.type === 'file') {
            this.preview = `file://${this.node.path}`;
        } else {
            let img = (await fs.readdir(this.node.path, { withFileTypes: true }))
                .filter(file => file.isFile() && isImg(file.name))
                .sort(fileSort)[0];

            this.preview = img ? `file://${this.node.path}/${img.name}` : '';
        }
    }
};
</script>

<style lang="less" scoped>
@import "../styles/common.less";
@import "../styles/md-color.less";

.card {
    background-color: @neutral;
    border-radius: 6vh;
    padding: 4vh 5vh;
    align-items: center;
    flex-direction: row;
}

.card:active {
    opacity: 0.6;
}

.preview {
    width: 30vh;
    height: 30vh;
    border-radius: 4vh;
    margin-right: 10vh;
}

.name {
    font-size: 10vh;
    color: @on-neutral;
}

.time {
    font-size: 8vh;
    color: @outline;
}
</style>