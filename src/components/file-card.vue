<template>
    <div class="card" @click="$emit('click')">
        <div class="wrapper">
            <image class="icon" v-show="node.isDir && !node.isComic" :src="require('../assets/folder.png?base64')" />
            <image class="icon" v-show="node.isDir && node.isComic" :src="require('../assets/images.png?base64')" />
            <image class="icon" v-show="!node.isDir" :src="require('../assets/image.png?base64')" />
            <text class="name">{{ node.name }}</text>
        </div>
        <text class="size">{{ node.size }}</text>
    </div>
</template>

<script>
export default {
    name: "FileCard",
    props: {
        node: { type: Object, required: true },
    },
};
</script>

<style lang="less" scoped>
@import "../styles/md-color.less";

.card {
    height: 30vh;
    background-color: @neutral;
    border-radius: 6vh;
    padding: 3vh 7vh;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
}

.card:active {
    opacity: 0.6;
}

.wrapper {
    flex-direction: row;
    align-items: center;
}

.icon {
    width: 15vh;
    height: 15vh;
    margin-right: 6vh;
}

.name {
    font-size: 10vh;
    color: @on-neutral;
}

.size {
    font-size: 8vh;
    color: @outline;
}
</style>