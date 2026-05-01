<template>
        <image class="cover" resize="cover" :src="cover" @click="$emit('click')"/>
</template>

<script>
import fs from 'fs';
import isImg from '../utils/tools/isImg';
import fileSort from '../utils/tools/fileSort';

export default {
    name: "ComicCard",
    props: {
        node: { type: Object, required: true },
    },
    data() {
        return {
            cover: '',
        }
    },
    async created() {
        if (this.node.type === 'file') {
            this.cover = `file://${this.node.path}`;
        } else {
            let img = (await fs.readdir(this.node.path, { withFileTypes: true }))
                .filter(file => file.isFile() && isImg(file.name))
                .sort(fileSort)[0];

            this.cover = img ? `file://${this.node.path}/${img.name}` : '';
        }
    }
};
</script>

<style lang="less" scoped>
@import "../styles/common.less";
@import "../styles/md-color.less";

.cover {
    border-radius: 6vh;
}

.cover:active {
    opacity: 0.6;
}

</style>