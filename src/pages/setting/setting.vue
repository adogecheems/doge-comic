<template>
    <div class="container">
        <ButtonColumn>
            <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
        </ButtonColumn>
        <scroller style="flex: 1;" show-scrollbar="false" over-scroll="50px" over-fling="50px">
            <text class="title">设置</text>
            <SeekbarCard min="5" max="20" step="1" :value="scale * 10" scale="0.1" @change="onScaleChange" text="默认图片缩放"
                class="card" />
            <SettingCard item="可隐藏的侧边栏" desc="右划可以再次呼出侧边栏" class="card">
                <Toggle v-if="!loading" :defaultValue="hidableSidebar" @click="switchHidableSidebar" />
            </SettingCard>
            <SettingCard item="启用调试模式" desc="在阅读器界面显示调试信息" class="card">
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
    margin: 0 6vh 5vh 0;
}
</style>