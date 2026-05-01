<template>
    <div class="container">
        <ButtonColumn>
            <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
        </ButtonColumn>
        <scroller style="flex: 1;" over-scroll="50px" over-fling="50px" show-scrollbar="false">
            <text class="title">漫画库</text>
            <text v-if="loading" class="loading">少女祈祷中...</text>
            <text v-else-if="store.length === 0" class="loading">什么也没有喵...</text>
            <div v-else class="content">
                <ComicCard :style="{width: width, height: height}" class="comic-card" v-for="(node, index) in store" :key="index" :node="node"
                    @click="open(node)" />
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

import traverseImages from "../../utils/FileManager/traverseImages";

export default {
    name: 'store',
    components: {
        IndexButton,
        ButtonColumn,
        IconButton,
        ComicCard
    },
    data() {
        return {
            loading: true,
            store: [],
            vw: w - 0.39 * h,
            vh: h,
        }
    },
    async created() {
        this.store = await traverseImages();
        this.loading = false;
    },
    computed: {
        width() {
            let count = Math.floor(this.vw / (0.87 * this.vh));
            return this.vw / count - 0.07 * this.vh - 1;
        },
        height() {
            return this.width * 1.25;
        }
    },
    methods: {
        back() {
            this.$page.finish();
        },
        open(node) {
            $falcon.navTo('reader', { node: JSON.stringify(node) });
        },
    }
};
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
@import "../../styles/md-color.less";

.content {
    flex-direction: row;
    flex-wrap: wrap;
}

.comic-card {
    width: 80vh;
    height: 100vh;
    margin: 0 7vh 7vh 0;
}
</style>