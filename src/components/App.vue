<template>
    <div class="test">
        <input type="text" v-model="message"/>
        <span>{{message}}</span>
        <button @click="clickMe">ClickHere</button>
    </div>
</template>
