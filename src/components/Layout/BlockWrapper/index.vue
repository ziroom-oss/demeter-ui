<template>
    <div class="wrapper">
        <section class="header">
            <h2>{{title}}</h2>
            <div class="extra">
                <slot name="extra"></slot>
            </div>
        </section>
        <section class="content">
            <slot></slot>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '主标题'
        },
    },
    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.wrapper {

    .header {
        margin-bottom: 16px;
        > h2 {
            font-size: 24px;
            line-height: 28px;
            font-weight: 600;
            margin-bottom: 0;
        }
        
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }

    .extra {
        color: rgba(0, 0, 0, .64);
        font-size: 14px;
    }
}
</style>