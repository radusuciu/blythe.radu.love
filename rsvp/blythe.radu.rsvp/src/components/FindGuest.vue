<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useCachedRequest } from '../composables/useCachedRequest'
import { findGuest, Guest } from '../api/guest'
import IdentityQuestion from '@/components/IdentityQuestion.vue'
import { useDebounce } from '@vueuse/core'


defineEmits(['rightGuest', 'wrongGuest'])

const searchInput = ref<null | { focus: () => null }>(null)
const searchTerm = ref('')
const debouncedTerm = useDebounce(searchTerm, 200)

const {
    data,
    error,
    isLoading,
    isReady,
} = useCachedRequest(debouncedTerm, findGuest)

onMounted(() => {
    searchInput.value?.focus()
})

// TODO: if we had a unique match and the user keeps typing maybe stop making requests
// or maybe just keep that last good match up if further input makes us unable to find
// a good match

</script>

<template>
    <div>
        <h1 class="title">Hello lovely guest</h1>
        <p class="subtitle">
            Thank you for responding!
        </p>
        <div class="block">
            <p class="">
                First, let's find your invite, could we please have your name?
            </p>
            <div class="control is-medium" :class="{ 'is-loading': isLoading }">
                <input ref="searchInput" autofocus type="text"
                    class="input is-primary is-medium"
                    placeholder="Just start typing!"
                    v-model="searchTerm"
                >
            </div>
            <transition name="fade">
                <p v-show="isLoading" class="is-pulled-right has-text-right is-size-6 is-italic has-text-grey">
                    loading
                </p>
            </transition>
        </div>
        <div class="block">
            <div class="">
                <transition name="fade" mode="out-in">
                    <IdentityQuestion
                        v-if="error === undefined && data?.uniqueMatch"
                        :disabled="isLoading"
                        :name="data.guest.name"
                        @yes="$emit('rightGuest', data.guest)"
                        @no="$emit('wrongGuest')"
                    />
                </transition>
            </div>
            <p class=""></p>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>