<script setup lang="ts">

import { confetti } from 'party-js'
import { ref } from 'vue'
import AttendanceQuestion from './AttendanceQuestion.vue'
import AttendanceQuestionRow from './AttendanceQuestionRow.vue'
import Question from './Question.vue'

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

function yass(event: MouseEvent) {
    confetti(event.target as HTMLElement)
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
            <transition name="fade" mode="out-in" v-if="guestAnswered && guestCanMakeIt">
                <Question
                    v-if="!answeredQuestion || !showTextbox"
                    class="columns"
                    question="Do you have any dietary restrictions?"
                    question-class="column"
                    answer-buttons-class="column"
                    @yes="showTextbox = true; answeredQuestion = true"
                    @no="answeredQuestion = true"
                />
                <div v-else-if="showTextbox" class="has-text-grey">
                    <p>Please note any dietary restrictions and we'll do our best to accomodate you.
                    </p>
                    <textarea class="textarea is-size-5 mt-2" rows="1"></textarea>
                </div>
            </transition>
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