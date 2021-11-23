<script setup lang="ts">

import { ref } from 'vue'


defineProps({
    question: {
        type: String,
        required: true,
    }
})

const emit = defineEmits(['yes', 'no'])

const answered = ref(false)
const answeredYes = ref(false)
const answeredNo = ref(false)

function yes() {
    answered.value = true
    answeredYes.value = true
    emit('yes')
}

function no() {
    answered.value = true
    answeredNo.value = true
    emit('no')
}


</script>

<template>
    <span>
        <span class="mr-4" style="vertical-align: middle">
            {{ question }}
        </span>
        <span class="buttons is-inline">
            <button @click="yes" :class="answeredYes ? 'is-active': 'is-outlined'" class="button is-success">Yes</button>
            <button @click="no" :class="answeredNo ? 'is-active': 'is-outlined'" class="button is-danger">No</button>
        </span>
    </span>
</template>
