<template>
    <div class="container" style="flex-direction: row;">
        <ButtonColumn>
            <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
            <IconButton :icon="require('../../assets/delete.png?base64')" @click="clear" />
        </ButtonColumn>
        <scroller style="flex: 1;" over-scroll="50px" over-fling="50px" class="scroller">
            <text class="title">我的收藏</text>
            <text v-show="history.length === 0" class="loading">什么也没有喵...</text>
            <div class="list">
                <HistoryCard class="card" v-for="(item, index) in history" :key="index"
                    :node="item.node" :time="item.time" @click="open(item.node, item.progress)" />
            </div>
        </scroller>
    </div>
</template>

<script>
import ButtonColumn from "../../components/button-column.vue";
import HistoryCard from "../../components/history-card.vue";
import IconButton from "../../components/icon-button.vue";

import Storage from "../../utils/Storage/Storage.js";

const setting = new Storage();

export default {
    name: 'Favorite',
    components: {
        ButtonColumn,
        IconButton,
        HistoryCard,
    },
    data() {
        return {
            history: [],
        }
    },
    methods: {
        back() {
            this.$page.finish();
        },
        clear() {
            setting.clearItems('favorite').then(() => {
                this.history = [];
            });
        },
        open(node, index) {
            $falcon.navTo('reader', { node: JSON.stringify(node), index });
        },
        onShow() {
            setting.getAllItems('favorite').then(items => {
                this.history = items;
            });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
@import "../../styles/md-color.less";

.list {
    padding-right: 7vh;
    flex-direction: column-reverse;
}

.card {
    margin-bottom: 4vh;
}
</style>