<template>
    <section class="data">
        <h4><i class="bar" :style="'background: ' + barColor"></i><span>{{title}}</span></h4>
        <strong :title="value">{{value || '-'}}</strong>
        <p :title="subValue">{{subValue || '-'}}</p>
    </section>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '标题'
        },
        value: {
            type: [Number, String],
            default: ''
        },
        subValue: {
            type: [Number, String],
            default: ''
        },
        barColor: {
            type: String,
            default: '',
        }
    }
}


</script>

<style scoped lang="scss">
.data {
    width: 100%;
    color: rgba(0, 0, 0, 0.86);
    font-weight: 500;
    >h4 {
        font-size: 14px;
        line-height: 24px;
        margin-bottom: 0;
        white-space: nowrap;

        .bar {
            display: inline-block;
            width: 4px;
            height: 12px;
            background: linear-gradient(180deg, #AE65F4 0%, #7635E6 100%);
            border-radius: 2px;
            margin-right: 8px;
            vertical-align: middle;
        }
        >span {
            vertical-align: middle;
        }
    }
    >strong {
        display: block;
        width: 100%;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        font-size: 24px;
        line-height: 32px;
    }
    >p {
        width: 100%;
        margin-bottom: 0;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        font-size: 14px;
        color: rgba(0, 0, 0, 0.44);
        line-height: 24px;
    }
}
</style>
