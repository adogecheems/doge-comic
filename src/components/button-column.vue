<template>
    <div class="wrapper" @click="$emit('click')">
        <slot />
    </div>
</template>

<style lang="less" scoped>
.wrapper {
    height: 100vh;
    padding: 7vh 12vh 7vh 5vh;
    flex-direction: column;
    justify-content: space-between;
}
</style>

<script>
export default {
    name: 'ButtonColumn',
}
</script>