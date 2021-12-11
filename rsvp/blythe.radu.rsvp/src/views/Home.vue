<script setup lang="ts">

import { ref, reactive, computed } from 'vue'
import '../../node_modules/bulma/css/bulma.css'

import FindGuest from '@/components/FindGuest.vue'
import PartyResponse from '@/components/PartyResponse.vue'
import PlusOneResponse from '@/components/PlusOneResponse.vue'
import SingleResponse from '@/components/SingleResponse.vue'


const guest = ref({})
const responded = ref(false)

const responseComponent = computed(() => {
    if (guest.value.hasPlusOne) {
        return PlusOneResponse
    } else if (guest.value.hasOwnProperty('party')) {
        return PartyResponse
    }

    return SingleResponse
})


function onFoundGuest(foundGuest) {
    guest.value = foundGuest
    responded.value = true
}

function onWrongGuest(guest) {
    responded.value = true
}

</script>

<template>
    <transition name="fade" mode="out-in">
        <FindGuest
            v-if="!responded"
            @rightGuest="onFoundGuest"
            @wrongGuest="onWrongGuest"
        />

        <component :is="responseComponent"
            v-else
            :guest="guest"
            @wrongGuest="responded = false"
        ></component>
    </transition>
</template>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>