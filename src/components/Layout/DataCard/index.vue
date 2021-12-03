<template>
    <section class="data-card" :style="style">
        <slot></slot>
    </section>
</template>

<script>
export default {
    props: {
        bgColor: {
            type: String,
            default: '#fff',
        }
    },
    computed: {
        style () {
            return 'background-color: ' + this.bgColor + ';';
        }
    }
}
</script>

<style scoped lang="scss">
.data-card {
    position: relative;
    
    background-color: #fff;
    border-radius: 8px;
    width: 100%;
    padding: 8px;
    min-height: 96px;
}
</style>
