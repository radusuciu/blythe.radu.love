<script setup lang="ts">

defineProps({
    name: {
        type: String,
        required: true,
    }
})

defineEmits(['yes', 'no'])


</script>

<template>
    <span>
        <span class="mr-4" style="vertical-align: middle">
            <span class="is-italic">Is this you:</span> <strong class="has-text-info">{{ name }}</strong>?
        </span>
        <span class="buttons is-inline">
            <button @click="$emit('yes')" class="button is-outlined is-success">Yes</button>
            <button @click="$emit('no')" class="button is-outlined is-danger">No</button>
        </span>
    </span>
</template>
