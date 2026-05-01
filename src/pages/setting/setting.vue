<template>
    <div class="container">
        <ButtonColumn>
            <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
        </ButtonColumn>
        <scroller style="flex: 1;" show-scrollbar="false" over-scroll="50px" over-fling="50px">
            <text class="title">设置</text>
            <SeekbarCard min="5" max="20" step="1" :value="scale * 10" scale="0.1" @change="onScaleChange" text="默认图片缩放"
                class="card" />
            <SettingCard item="可隐藏的侧边栏" desc="" class="card">
                <Toggle v-if="!loading" :defaultValue="hidableSidebar" @click="switchHidableSidebar" />
            </SettingCard>
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

import Storage from "../../utils/Storage/Storage.js";

const setting = new Storage();

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
            isDebug: false,
            hidableSidebar: false
        }
    },
    async created() {
        this.scale = await setting.get('scale');
        this.syncTime = await setting.get('syncTime');
        this.isDebug = await setting.get('isDebug');
        this.hidableSidebar = await setting.get('hidableSidebar');
        this.loading = false;
    },
    methods: {
        back() {
            this.$page.finish();
        },
        onScaleChange(e) {
            setting.set('scale', e.detail.value / 10);
        },
        onSyncTimeChange(e) {
            setting.set('syncTime', e.detail.value);
        },
        switchDebugMode(checked) {
            setting.set('isDebug', checked);
        },
        switchHidableSidebar(checked) {
            setting.set('hidableSidebar', checked);
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