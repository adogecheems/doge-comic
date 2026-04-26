<template>
    <div class="card">
        <div class="line">
            <text class="title">{{ text }}</text>
            <text class="value">{{ display }}</text>
        </div>
        <seekbar class="seekbar" :min="min" :max="max" :step="step" :value="value" active-color="#004a77"
            background-color="#8e918f" handle-color="#e3e3e3" :track-size="0.03 * vh" :handle-size="0.12 * vh"
            @change="onChange" @changing="onChanging" />
    </div>
</template>

<script>
export default {
    name: "SeekbarCard",
    props: {
        text: { type: String, required: true },
        min: { type: Number, required: false, default: 0 },
        max: { type: Number, required: false, default: 100 },
        step: { type: Number, required: false, default: 1 },
        value: { type: Number, required: false, default: 0 },
        scale: { type: Number, required: false, default: 1 }
    },
    data() {
        return {
            vh: $falcon.env.deviceHeight,
            value: null
        }
    },
    computed: {
        display() {
            let display = (this.value * this.scale).toFixed(1);
            return display.endsWith('.0') ? display.slice(0, -2) : display;
        }
    },
    methods: {
        onChange(e) {
            this.$emit('change', e);
        },
        onChanging(e) {
            this.value = e.detail.value;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../styles/md-color.less";

.card {
    padding: 8vh;
    border-radius: 8vh;
    background-color: @neutral;
}

.title {
    font-size: 10vh;
    color: @on-neutral
}

.line {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3vh;
}

.seekbar {
    flex: 1;
}

.value {
    margin-right: 3vh;
    font-size: 9vh;
    color: @outline;
}
</style>