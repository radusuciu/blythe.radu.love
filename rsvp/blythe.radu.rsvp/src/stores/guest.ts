// modeled after example:
// https://github.com/posva/pinia/blob/75430315d2dc704ecd3f3e1f169b0dd1d39e3c11/packages/playground/src/stores/nasa-pod.ts

import { ref, watch, unref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'
import { getGuest, Guest } from '../api/guest'
import { useCachedRequest } from '../composables/useCachedRequest'


export const useGuestStore = defineStore('guest', () => {
    const guestId = ref<string>('')

    watch(guestId, (guestId) => {
        console.log('guestId changed', guestId)
        if (guestId) {
            fetchGuest(guestId)
        }
    })

    console.log('set up store')

    const {
        data: guest,
        error,
        isLoading,
        isReady,
    } = useCachedRequest(guestId, getGuest)

    function fetchGuest(guestId: string) {
        console.log('getting guest')
        error.value = undefined
        isLoading.value = true

        return getGuest(guestId)
            .then((guestData) => {
                console.log('success', guestData)
                guest.value = guestData
            })
            .catch((err) => {
                error.value = err
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    return {
        guestId,
        guest,
        error,
        isReady,
        isLoading,
    }


})

// export const useGuestStore = defineStore('guest', () => {
//     const guestId = ref<string>('')

//     watch(guestId, fetchGuest)

//     const {
//         data: guest,
//         error,
//         isLoading,
//         isReady,
//     } = useCachedRequest(guestId, getGuest)

//     function fetchGuest(guestId: string) {
//         error.value = undefined
//         isLoading.value = true

//         return getGuest(guestId)
//             .then((guestData) => {
//                 guest.value = guestData
//             })
//             .catch((err) => {
//                 error.value = err
//             })
//             .finally(() => {
//                 isLoading.value = false
//             })
//     }

// })


if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGuestStore, import.meta.hot))
}