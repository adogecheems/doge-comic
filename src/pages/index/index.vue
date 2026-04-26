<template>
    <div class="container">
        <ButtonColumn>
            <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
            <IconButton :icon="require('../../assets/setting.png?base64')" @click="openLink('setting')" />
            <IconButton :icon="require('../../assets/info.png?base64')" @click="openLink('info')" />
        </ButtonColumn>
        <scroller style="flex: 1;" over-scroll="50px" over-fling="50px" show-scrollbar="false">
            <text class="title">Doge漫画</text>
            <div class="options-line">
                <MainCard class="main-card" :icon="require('../../assets/folder.png?base64')" text="本地文件"
                    @click="openLink('filemanager')" />
                <MainCard class="main-card" :icon="require('../../assets/love.png?base64')" text="我的收藏"
                    @click="openLink('favorite')" />
                <MainCard class="main-card" :icon="require('../../assets/history.png?base64')" text="完整历史"
                    @click="openLink('history')" />
            </div>
            <div class="content">
                <HistoryCard class="history-card" v-for="(item, index) in history" :key="index" :node="item.node"
                    time="" @click="open(item.node)" :style="{ width: 0.499 * vw - 0.06 * vh  }" />
            </div>
        </scroller>
    </div>
</template>

<script>
const env = $falcon.env;
const w = env.deviceWidth;
const h = env.deviceHeight;

import ButtonColumn from "../../components/button-column.vue";
import HistoryCard from "../../components/history-card.vue";
import IconButton from "../../components/icon-button.vue";
import MainCard from "../../components/main-card.vue";

import Setting from "../../utils/Setting/Setting";

const setting = new Setting();

export default {
    name: 'index',
    components: {
        MainCard,
        ButtonColumn,
        IconButton,
        HistoryCard
    },
    data() {
        return {
            history: [],
            vw: w - 0.39 * h,
            vh: h,
        }
    },
    methods: {
        openLink(link) {
            $falcon.navTo(link);
        },
        back() {
            this.$page.finish();
        },
        open(node) {
            $falcon.navTo('reader', { node: JSON.stringify(node) });
        },
        onShow() {
            setting.getAllItems().then(items => {
                this.history = items;
            });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
@import "../../styles/md-color.less";

.options-line {
    flex-direction: row;
    justify-content: space-between;
}

.main-card {
    flex: 1;
    margin-right: 6vh;
}

.content {
    margin-top: 6vh;
    flex-direction: row;
    flex-wrap: wrap;
}

.history-card {
    margin: 0 6vh 6vh 0;
}
</style>