<script setup lang="ts">

import party from 'party-js'
import { ref, computed } from 'vue'


const props = defineProps({
    name: {
        type: String,
        required: true,
    }
})

const emit = defineEmits(['yes', 'no'])

const coming = ref(null)

const nameSlug = computed(() => {
    return props.name.toLowerCase().replace(' ', '-')
})

function onYes(event: MouseEvent) {
    console.log('yes')
    party.confetti(event.target as HTMLElement)
    emit('yes')
}

function onNo(event: MouseEvent) {
    emit('no')
}

</script>

<template>
    <tr>
        <td>
            <span :class="{'has-text-success': coming === true, 'has-text-grey': coming === false }">
                {{ name }}
            </span>
        </td>
        <td>
            <div class="control is-size-5">
                <label class="radio">
                    <input @click="onYes" :name="nameSlug" type="radio" :value="true" v-model="coming">
                    Yes
                </label>
            </div>
        </td>
        <td>
            <div class="control is-size-5">
                <label class="radio">
                    <input @click="onNo" :name="nameSlug" type="radio" :value="false" v-model="coming">
                    No
                </label>
            </div>
        </td>
    </tr>
</template>
