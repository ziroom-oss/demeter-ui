<template>
    <section class="block-card">
        <div class="header">
            <div class="title">
                <i class="icon"></i>
                <!-- @Todo component is icon 组件 -->
                <h3 class="text">{{title}}</h3>
            </div>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '标题'
        },
    },
}
</script>

<style scoped lang="scss">
.block-card {
    background-color: #fff;
    border-radius: 16px;
    width: 100%;
    padding: 16px;
    .header {
        margin-bottom: 14px;
    }
    .title {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: flex-start;

        h3 {
            margin-bottom: 0;
        }

        .icon {
            display: block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }

        .text {
            color: #000;
            font-size: 16px;
            font-weight: 600;
            line-height: 28px;
        }
    }
}
</style>
