<template>
    <div class="button" @click="$emit('click')">
        <image class="icon" :src="icon" />
    </div>
</template>

<script>
export default {
    name: 'IconButton',
    props: {
        icon: { type: String, required: true }
    },
}
</script>

<style lang="less" scoped>
@import "../styles/md-color.less";

.button {
    width: 22vh;
    height: 22vh;
    border-radius: 7vh;
    justify-content: center;
    align-items: center;
    background-color: @neutral;
}

.button:active {
    opacity: 0.6;
}

.icon {
    width: 60%;
    height: 60%;
}
</style>