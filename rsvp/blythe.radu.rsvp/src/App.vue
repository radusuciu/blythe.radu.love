<script setup lang="ts">

import { ref, reactive } from 'vue'
import './../node_modules/bulma/css/bulma.css'

import FindGuest from './components/FindGuest.vue'
import PartyResponse from './components/PartyResponse.vue'

const guest = ref({})
const responded = ref(false)


function onFoundGuest(foundGuest) {
    guest.value = foundGuest
    responded.value = true
}

function onWrongGuest(guest) {
    responded.value = true
}

</script>

<template>
    <div class="container is-max-desktop">
        <transition name="fade" mode="out-in">
            <FindGuest
                v-if="!responded"
                @rightGuest="onFoundGuest"
                @wrongGuest="onWrongGuest"
            />
            <PartyResponse
                v-else
                :guest="guest"
                @wrongGuest="responded = false"
            />
        </transition>
    </div>
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