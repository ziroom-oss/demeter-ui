<template>
    <div class="border-card">
        <h3>{{title}}</h3>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            defualt: '',
        }
    },
}
</script>

<style lang="scss" scoped>
.border-card {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 20px 8px 8px;
    border-radius: 12px;

    >h3 {
        position: absolute;
        left: 20px;
        top: 0px;
        transform: translateY(-50%);
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 0;
        background-color: #fff;
    }
}
</style>
