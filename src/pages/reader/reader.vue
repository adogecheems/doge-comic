<template>
    <div>
        <div class="container">
            <ButtonColumn>
                <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
                <IconButton :icon="require('../../assets/love.png?base64')" @click="love" />
                <IconButton :icon="require('../../assets/menu.png?base64')" @click="openMenu" />
            </ButtonColumn>
            <div style="flex: 1;">
                <scroller over-scroll="50px" over-fling="50px" @scroll="setOffset">
                    <div ref="start" :style="{ height: loadingImage ? 16000 : null }">
                        <div v-show="!loading && !loadingImage">
                            <PageTurningButton :icon="require('../../assets/back.png?base64')" v-if="reader.index !== 0"
                                text="上一页" @click="reader.prev(); go('end')" style="margin: 6vh 4vh 7vh 0;" />
                            <scroller show-scrollbar="false" scroll-direction="horizontal" over-scroll="50px"
                                over-fling="50px">
                                <div>
                                    <richtext :key="reader.index">
                                        <template v-for="url in reader.segment">
                                            <image :style="{ width: width }" :src="url" /><br>
                                        </template>
                                    </richtext>
                                </div>
                            </scroller>
                            <PageTurningButton ref="end" :icon="require('../../assets/next.png?base64')"
                                v-if="reader.index < reader.urlsSegments.length - 1" text="下一页" @click="reader.next()"
                                style="margin: 7vh 4vh 6vh 0;" />
                        </div>
                    </div>
                </scroller>
            </div>
            <div class="loading-area" v-show="loading || loadingImage">
                <text class="loading">少女祈祷中...</text>
            </div>
        </div>
        <Toast />
        <Drawer v-if="!loading">
            <scroller style="height: 100%;" over-scroll="50px" over-fling="50px" show-scrollbar="false">
                <text class="lower-title">阅读设置</text>
                <SeekbarCard min="1" :max="reader.getSegmentCount()" step="1" :value="reader.index + 1"
                    @change="onProgressChange" text="阅读分片" style="margin-bottom: 6vh;" />
                <SeekbarCard min="5" max="20" step="1" :value="reader.scale * 10" scale="0.1" @change="onScaleChange"
                    text="图片缩放" style="margin-bottom: 10vh;" />
            </scroller>
        </Drawer>
        <div v-if="isDebug"
            style="position: absolute; top: 0; right: 0; padding: 8vh; background-color: #000000; opacity: 0.7;">
            <text style="font-size: 6vh; color: white;">
                index: {{ reader.index }},
                offset: {{ reader.offset }},
                scale: {{ reader.scale }},
                loadingImage: {{ loadingImage }},
                debugValue: {{ debugValue }}
            </text>
        </div>
    </div>
</template>

<script>
const env = $falcon.env;
const w = env.deviceWidth;
const h = env.deviceHeight;

import ButtonColumn from "../../components/button-column.vue";
import Drawer from "../../components/drawer.vue";
import IconButton from "../../components/icon-button.vue";
import SeekbarCard from "../../components/seekbar-card.vue";
import PageTurningButton from "../../components/page-turning-button.vue";
import Toast from "../../components/toast.vue";
import ComicReader from "../../utils/ComicReader/ComicReader.js";
import Setting from "../../utils/Setting/Setting.js";

const setting = new Setting();

export default {
    components: {
        ButtonColumn,
        Drawer,
        IconButton,
        Toast,
        SeekbarCard,
        PageTurningButton
    },
    data() {
        return {
            loading: true,
            reader: null,
            vw: w - 0.39 * h,
            vh: h,
            loadingImage: true,
            debugValue: 'none',
            isDebug: false,
        }
    },
    async created() {
        this.isDebug = await setting.isDebugMode();

        let node = JSON.parse(this.$page.options.node);
        this.reader = new ComicReader(node, { scale: await setting.getScale() });

        if (this.$page.options.progress) {
            this.reader.setProgress(JSON.parse(this.$page.options.progress));
        } else {
            if (await setting.getItem(node)) {
                this.reader.setProgress(await setting.getItem(node));
            }
        }

        await this.reader.load();
        this.loading = false;

        this.go('start', this.reader.getOffset());
    },
    computed: {
        width() {
            return this.vw * this.reader.scale;
        }
    },
    methods: {
        back() {
            this.$page.finish();
        },
        love() {
            setting.addItem(this.reader.node, this.reader.getProgress(), 'favorite').then(() => {
                $falcon.trigger('toast', { text: '书签已保存' });
            });
        },
        openMenu() {
            $falcon.trigger('drawer', { show: true });
        },
        onHide() {
            setting.addItem(this.reader.node, this.reader.getProgress())
        },
        onProgressChange(e) {
            this.reader.go(e.detail.value - 1);
        },
        onScaleChange(e) {
            this.reader.scale = e.detail.value / 10;
            this.go('start', this.reader.getOffset());
        },
        setOffset(event) {
            if (this.loadingImage) return;
            this.reader.setOffset(event.contentOffset.y);
        },
        async go(ref, offset = 0) {
            this.loadingImage = true;
            await new Promise(async resolve => { setTimeout(resolve, offset ? await setting.getSyncTime() : 0) });
            this.loadingImage = false;
            await new Promise(resolve => this.$page.$dom.scrollToElement(this.$refs[ref], { offset }));
        },
    }
}
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
@import "../../styles/md-color.less";

.loading-area {
    position: absolute;
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
}

.content {
    width: 100%;
    font-size: 10vh;
    line-height: 14vh;
    margin-top: 1.5vh;
    color: @on-neutral;
}

.lower-title {
    margin: 10vh 0 10vh 0;
    font-size: 11vh;
    color: @outline;
}
</style>
