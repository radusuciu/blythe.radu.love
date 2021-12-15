<script lang="ts" setup>

import { computed, ref, toRefs } from 'vue'
import { getGuest, Guest } from '../api/guest'
import { useCachedRequest } from '../composables/useCachedRequest'
import PartyResponse from '@/components/PartyResponse.vue'
import PlusOneResponse from '@/components/PlusOneResponse.vue'
import SingleResponse from '@/components/SingleResponse.vue'
import { useRouter } from 'vue-router'
import { useGuestStore } from '../stores/guest'
import { useResponseStore } from '../stores/response'


const props = defineProps({
    guestId: {
        type: String,
        required: true,
    }
})

const router = useRouter()
const guestStore = useGuestStore()
const responseStore = useResponseStore()


const {
    guest,
    guestId,
    error,
    isLoading,
    isReady,
} = toRefs(guestStore)

console.log(guest, guestId, error, isLoading, isReady)
guestId.value = props.guestId

const responseComponent = computed(() => {
    if (guest.value.hasPlusOne) {
        return PlusOneResponse
    } else if (guest.value.hasOwnProperty('party')) {
        return PartyResponse
    }

    return SingleResponse
})

function onWrongGuest() {
    router.push({ name: 'home' })
}

function onResponse() {
    console.log()
}

</script>

<template>
    <component v-if="guest" :is="responseComponent"
        :guest="guest"
        @wrongGuest="onWrongGuest"
        @response="onResponse"
    ></component>
</template>
