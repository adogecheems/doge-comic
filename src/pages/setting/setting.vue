<template>
    <div class="container">
        <ButtonColumn>
            <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
        </ButtonColumn>
        <scroller style="flex: 1;" show-scrollbar="false" over-scroll="50px" over-fling="50px">
            <text class="title">设置</text>
            <SeekbarCard min="5" max="20" step="1" :value="scale * 10" scale="0.1" @change="onScaleChange"
                text="默认图片缩放" class="card" />
                <SeekbarCard min="300" max="3000" step="100" :value="syncTime" scale="0.001" @change="onSyncTimeChange"
                text="（高级）渲染同步时间" class="card" />
            <SettingCard item="（高级）启用调试模式" desc="" class="card">
                <Toggle v-if="!loading" :defaultValue="isDebug" @click="switchDebugMode" />
            </SettingCard>
        </scroller>
    </div>
</template>

<script>
import ButtonColumn from "../../components/button-column.vue";
import IconButton from "../../components/icon-button.vue";
import SeekbarCard from "../../components/seekbar-card.vue";
import SettingCard from "../../components/setting-card.vue";
import Toggle from "../../components/toggle.vue";

import Setting from "../../utils/Setting/Setting.js";

const setting = new Setting();

export default {
    name: 'setting',
    components: {
        ButtonColumn,
        IconButton,
        SeekbarCard,
        SettingCard,
        Toggle
    },
    data() {
        return {
            loading: true,
            scale: 1,
            syncTime: 2000,
            isDebug: false
        }
    },
    methods: {
        back() {
            this.$page.finish();
        },
        onShow() {
            setting.getScale().then(scale => {
                this.scale = scale;
                this.loading = false;
            }),
            setting.getSyncTime().then(time => {
                this.syncTime = time;
            })
            setting.isDebugMode().then(debug => {
                this.isDebug = debug;
            });
        },
        onScaleChange(e) {
            setting.setScale(e.detail.value / 10);
        },
        onSyncTimeChange(e) {
            setting.setSyncTime(e.detail.value);
        },
        switchDebugMode(checked) {
            setting.setDebugMode(checked);
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../styles/md-color.less";
@import "../../styles/common.less";

.card {
    margin: 0 6vh 6vh 0;
}
</style>