<template>
    <div class="toggle" @click="toggle">
        <div class="track" :class="{ 'track-on': checked }"></div>
        <div class="thumb" :class="{ 'thumb-on': checked }"></div>
    </div>
</template>

<script>
export default {
    name: 'Toggle',
    props: {
        defaultValue: { type: Boolean, default: false }
    },
    data() {
        return {
            checked: this.defaultValue
        }
    },
    methods: {
        toggle() {
            this.checked = !this.checked
            this.$emit('click', this.checked)
        }
    }
}
</script>

<style scoped lang="less">
@import "../styles/md-color.less";

.toggle {
    position: relative;
    width: 32vh;
    height: 18vh;
}

.track {
    position: absolute;
    top: 3vh;
    left: 0;
    width: 100%;
    height: 12vh;
    border-radius: 6vh;
    background-color: @outline;
    transition: background-color 0.15s ease-in-out;
}

.track-on {
    background-color: @primary;
}

.thumb {
    position: absolute;
    top: 1vh;
    left: 2vh;
    width: 16vh;
    height: 16vh;
    border-radius: 100vh;
    background-color: @on-neutral;
    transition: all 0.15s ease-in-out;
}

.thumb-on {
    transform: translateX(14vh);
    background-color: @on-primary;
}
</style>