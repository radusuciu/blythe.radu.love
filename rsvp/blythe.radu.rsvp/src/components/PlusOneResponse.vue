<script setup lang="ts">

import { confetti } from 'party-js'
import { nextTick, ref, computed } from 'vue'
import AttendanceQuestion from './AttendanceQuestion.vue'
import AttendanceQuestionRow from './AttendanceQuestionRow.vue'
import Question from './Question.vue'
import invitees from '../data/invitees.json'

const props = defineProps({
    guest: {
        type: Object,
        required: true,
    }
})

defineEmits(['wrongGuest'])

const guestCanMakeIt = ref(false)
const guestAnswered = ref(false)
const showTextbox = ref(false)
const answeredQuestion = ref(false)
const guestHasPlusOne = ref(false)
const plusOneNameInput = ref<null | { focus: () => null }>(null)
const plusOneName = ref('')

const dietaryRestrictionsText = computed(() => {
    if (guestHasPlusOne.value) {
        return 'Do you or your plus one have any dietary restrictions?'
    }

    return 'Do you have any dietary restrictions?'
})


function onGuestHasPlusOne() {
    guestHasPlusOne.value = true
    console.log(plusOneNameInput.value)
    nextTick(() => plusOneNameInput.value?.focus())
}

function yass(event) {
    confetti(event.target)
}

</script>

<template>
    <div>
        <h1 class="title">
            Hi <strong class="has-text-info">{{ guest.name }}</strong>! <span @click="$emit('wrongGuest')" style="vertical-align:top" class="is-size-6 has-text-grey-light is-clickable">(not you?)</span>
        </h1>
        <p class="subtitle">
            Would you please tell us if you're able to make it? If you encounter any issues or have questions, please email us at <a href="mailto:rsvp@blythe.radu.love">rsvp@blythe.radu.love</a>.
        </p>

        <div class="box">
            <Question
                class="columns"
                question="Are you able to make it?"
                question-class="column"
                answer-buttons-class="column"
                @yes="yass($event); guestAnswered = true; guestCanMakeIt = true"
                @no="guestAnswered = true; guestCanMakeIt = false"
            />
            <Question
                v-if="!guestAnswered || guestCanMakeIt"
                class="columns"
                question="Will you be bringing a plus one?"
                question-class="column"
                answer-buttons-class="column"
                @yes="onGuestHasPlusOne"
                @no="guestHasPlusOne = false"
            />
            <transition name="fade">
                <div v-if="guestHasPlusOne" class="columns is-vcentered">
                    <span class="column mr-4">What is the name of your plus one?</span>
                    <span class="column">
                        <input ref="plusOneNameInput" v-model="plusOneName" class="input" type="text">
                    </span>
                </div>
            </transition>
            <template v-if="guestAnswered && guestCanMakeIt">
                <hr>
                <transition name="fade" mode="out-in">
                    <Question
                        v-if="!answeredQuestion || !showTextbox"
                        class="has-text-centered is-italic"
                        :question="dietaryRestrictionsText"
                        @yes="showTextbox = true; answeredQuestion = true"
                        @no="answeredQuestion = true"
                    />
                    <div v-else-if="showTextbox" class="has-text-grey">
                        <p>Please note any dietary restrictions and we'll do our best to accomodate you.
                        </p>
                        <textarea class="textarea is-size-5 mt-2" rows="1"></textarea>
                    </div>
                </transition>
            </template>
        </div>

        <button :disabled="false" class="is-large is-primary button is-pulled-right">Submit My Response</button>
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