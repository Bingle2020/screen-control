<template>
    <DatePicker
        :open="open"
        :value="value3"
        type="date"
        @on-change="handleChange"
        @on-clear="handleClear"
        >
        <a href="javascript:void(0)" @click="handleClick">
            <Icon type="ios-calendar-outline"></Icon>
             <template v-if="value3 === ''">{{intime}}</template>
            <template v-else>{{ value3 }}</template>
        </a>
    </DatePicker>
</template>
<script>
    export default {
        props:['intime'],
        data () {
            return {
                open: false,
                value3: '',
            }
        },
        methods: {
            handleClick () {
                this.open = !this.open;
            },
            handleChange (date) {
                this.value3 = date;
                console.log(this.value3)
                this.open = false;
                this.$emit('func',this.value3)
            },
            handleClear () {
                this.open = false;
            },
            
        }
    }
</script>
<style lang="scss">
.ivu-select-dropdown{
    background-color:#00183D
}
    
</style>
