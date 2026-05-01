<template>
    <div class="card" @click="$emit('click')">
        <image resize="contain" class="icon" :src="icon"/>
        <text class="text">{{ text }}</text>
    </div>
</template>

<script>
export default {
    name: 'IndexButton',
    props: {
        text: { type: String, required: true },
        icon: { type: String, required: true },
    },
}
</script>

<style lang="less" scoped>
@import url(../styles/md-color.less);

.card {
    height: 30vh;
    background-color: @neutral;
    border-radius: 6vh;
    padding: 3vh 7vh;
    align-items: center;
    flex-direction: row;
}

.card:active {
    opacity: 0.6;
}

.icon {
    width: 15vh;
    height: 15vh;
    margin-right: 6vh;
}

.text {
    font-size: 10vh;
    color: @on-neutral;
}
</style>