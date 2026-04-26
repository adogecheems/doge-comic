<template>
    <div :class="{'toast-show': show}" class="toast">
        <text class="toast-text">{{ text }}</text>
    </div>
</template>

<script>
export default {
    name: 'Toast',
    data() {
        return {
            show: false,
            text: ''
        }
    },
    created() {
        this.onToast = (e) => {
            this.text = e.data.text;
            this.show = true;

            setTimeout(() => {
                this.show = false;
            }, 1000);
        }

        $falcon.on('toast', this.onToast);
    },
    beforeDestroy() {
        $falcon.off('toast', this.onToast);
    }
}
</script>

<style lang="less" scoped>
@import "../styles/md-color.less";

.toast {
    position: fixed;
    width: 100%;
    height: 22vh;
    left: 0;
    bottom: 0;
    background-color: #ff8f9e;
    opacity: 0.9;
    justify-content: center;
    align-items: center;
    transform: translateY(100%);
    transition:  transform 0.3s ease-in-out;
}

.toast-show {
    transform: translateY(0);
}

.toast-text {
    color: #ffffff;
    font-size: 10vh;
}
</style>
