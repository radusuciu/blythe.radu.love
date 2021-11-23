<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import IdentityQuestion from './IdentityQuestion.vue'
import invitees from '../data/invitees.json'

defineEmits(['rightGuest', 'wrongGuest'])

const searchInput = ref(null)
const searchTerm = ref('')

function searchForGuest(name: string) {
    const matches = invitees.filter(i => i.name.toLowerCase().includes(name.toLowerCase()))

    // TODO: check if all of the matches have identical names
    // and if they do, we should handle that.. we need a disambiguation
    // field in the data to support this
    if (matches.length === 1) {
        return matches[0]
    }
}

const foundGuest = computed(() => {
    return searchForGuest(searchTerm.value)
})

onMounted(() => {
    searchInput.value.focus()
})

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
            <input ref="searchInput" autofocus type="text"
                class="input is-primary is-medium"
                placeholder="Just start typing!"
                v-model="searchTerm"
            >
        </div>
        <div class="block">
            <div class="">
                <transition name="fade">
                    <IdentityQuestion
                        v-if="foundGuest"
                        :name="foundGuest.name"
                        @yes="$emit('rightGuest', foundGuest)"
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