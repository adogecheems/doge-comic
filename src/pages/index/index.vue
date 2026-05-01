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
                <IndexButton class="index-button" :icon="require('../../assets/folder.png?base64')" text="本地文件"
                    @click="openLink('filemanager')" />
                <IndexButton class="index-button" :icon="require('../../assets/love.png?base64')" text="我的收藏"
                    @click="openLink('favorite')" />
                <IndexButton class="index-button" :icon="require('../../assets/history.png?base64')" text="完整历史"
                    @click="openLink('history')" />
            </div>
            <div class="content">
                <div class="index-card" :style="{width: coverWidth, height: coverHeight}" @click="openLink('store')">
                    <image style="width: 37vh; height: 37vh;" :src="require('../../assets/books2.png?base64')" />
                    <text class="index-card-text">漫画库</text>
                </div>
                <ComicCard class="comic-card" :style="{width: coverWidth, height: coverHeight}" v-for="(item, index) in showingList" :key="index" :node="item.node"
                    @click="open(item.node)" />
            </div>
        </scroller>
    </div>
</template>

<script>
const env = $falcon.env;
const w = env.deviceWidth;
const h = env.deviceHeight;

import ButtonColumn from "../../components/button-column.vue";
import ComicCard from "../../components/comic-card.vue";
import IconButton from "../../components/icon-button.vue";
import IndexButton from "../../components/index-button.vue";

import Storage from "../../utils/Storage/Storage.js";

const setting = new Storage();

export default {
    name: 'index',
    components: {
        IndexButton,
        ButtonColumn,
        IconButton,
        ComicCard
    },
    data() {
        return {
            history: [],
            vw: w - 0.39 * h,
            vh: h,
        }
    },
    async created() {
        this.history = await setting.getAllItems();
    },
    computed: {
        showingList() {
            return this.history.slice(1 - this.lineConut).reverse();
        },
        lineConut() {
            return Math.floor(this.vw / (0.87 * this.vh));
        },
        coverWidth() {
            return this.vw / this.lineConut - 0.07 * this.vh - 1;
        },
        coverHeight() {
            return this.coverWidth * 1.25;
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

.index-button {
    flex: 1;
    margin-right: 6vh;
}

.content {
    margin-top: 7vh;
    flex-direction: row;
    flex-wrap: wrap;
}

.comic-card {
    margin: 0 7vh 7vh 0;
}

.index-card {
    margin: 0 7vh 7vh 0;
    background-color: #ffffff;
    border-radius: 6vh;
    align-items: center;
    justify-content: center;
}

.index-card:active {
    opacity: 0.6;
}

.index-card-text {
    margin-top: 8vh;
    font-size: 10vh;
    color: @link;
}
</style>