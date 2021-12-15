<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FindGuest from '@/components/FindGuest.vue'
import { Guest } from '../api/guest'


const router = useRouter()
const responded = ref(false)

function onRightGuest(foundGuest) {
    responded.value = true
    console.log(foundGuest)
    router.push({ name: 'response', params: { guestId: foundGuest.id }})
}

function onWrongGuest() {
    responded.value = true
}

</script>

<template>
    <FindGuest
        @rightGuest="onRightGuest"
        @wrongGuest="onWrongGuest"
    />
</template>
