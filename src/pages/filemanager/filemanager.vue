<template>
    <div class="container" style="flex-direction: row;">
        <ButtonColumn>
            <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
            <IconButton :icon="require('../../assets/home.png?base64')" @click="home" />
        </ButtonColumn>
        <scroller style="flex: 1;" over-scroll="50px" over-fling="50px" class="scroller">
            <scroller scroll-direction="horizontal" show-scrollbar="false">
                <text class="title">{{ manager.cwd }}</text>
            </scroller>
            <text v-if="manager.error" class="error">啊勒,出错了喵!</text>
            <text v-else-if="manager.loading" class="loading">少女祈祷中...</text>
            <text v-else-if="manager.nodeList.length === 0" class="loading">什么也没有喵...</text>
            <div v-else class="file-list">
                <FileCard class="file-card" v-for="(node, index) in manager.nodeList" :key="node.name" :node="node"
                    @click="open(index)" />
            </div>
        </scroller>
    </div>
</template>

<script>
import ButtonColumn from "../../components/button-column.vue";
import FileCard from "../../components/file-card.vue";
import IconButton from "../../components/icon-button.vue";

import FileManager from "../../utils/FileManager/FileManager.js";

export default {
    name: 'filemanager',
    components: {
        ButtonColumn,
        IconButton,
        FileCard,
    },
    data() {
        return {
            manager: new FileManager(),
        }
    },
    methods: {
        openLink(link) {
            $falcon.navTo(link);
        },
        home() {
            this.$page.finish();
        },
        back() {
            if (!this.manager.goBack()) {
                this.$page.finish();
            }
        },
        open(index) {
            let node = this.manager.chooseFile(index);

            if (node.path) {
                $falcon.navTo('reader', { node: JSON.stringify(node) });
            }
        },
        onShow() {
            this._backpressed = () => {
                this.back();
            }

            this.$page.$npage.setSupportBack(false);
            this.$page.$npage.on("backpressed", this._backpressed);
        },
        onHide() {
            this.$page.$npage.setSupportBack(true);
            this.$page.$npage.off("backpressed", this._backpressed);
        },
    }
}
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
@import "../../styles/md-color.less";

.file-list {
    padding-right: 7vh;
}

.file-card {
    margin-bottom: 4vh;
}

.error {
    font-size: 12vh;
    text-align: center;
    color: @secondary;
}
</style>