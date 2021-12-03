<template>
    <div class="page-header">
        <section class="main-header">
            <h2>{{title}}</h2>
            <div class="extra-slot">
                <slot name="extra"></slot>
            </div>
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
.page-header {
    margin-bottom: 25px;

    .main-header {
        > h2 {
            font-size: 40px;
            line-height: 40px;
            font-weight: 600;
            margin-bottom: 0;
        }
        
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }

    .extra-slot {
        color: rgba(0, 0, 0, .64);
        font-size: 14px;
    }
}
</style>