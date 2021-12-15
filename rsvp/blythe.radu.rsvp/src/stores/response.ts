import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { recordResponse, GuestResponse } from '../api/guest'

export const useResponseStore = defineStore('response', () => {

    const data = ref<object | undefined>()
    const isLoading = ref(false)
    const isReady = ref(false)
    const error = ref<Error | undefined>()

    const responses: GuestResponse[] = []

    

    function send() {

    }

    return {
        data,
        isLoading,
        isReady,
        error,
        responses,
        send,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useResponseStore, import.meta.hot))
}