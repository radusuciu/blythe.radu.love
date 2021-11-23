<script setup lang="ts">

import { ref } from 'vue'
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

// TODO: sort guest before rest of party
const party = invitees.filter(i => i.party === props.guest.party)
const showTextbox = ref(false)
const answeredQuestion = ref(false)

</script>

<template>
    <div>
        <h1 class="title">
            Hi <strong class="has-text-info">{{ guest.name }}</strong>! <span @click="$emit('wrongGuest')" style="vertical-align:top" class="is-size-6 has-text-grey-light is-clickable">(not you?)</span>
        </h1>
        <p class="subtitle">
            Would you please tell us if you're able to make it? You may also answer for others in your party. If you encounter any issues or have questions, please email us at <a href="mailto:rsvp@blythe.radu.love">rsvp@blythe.radu.love</a>.
        </p>

        <div class="box">
            <table class="table container">
                <thead>
                    <tr>
                        <th>Guest Name</th>
                        <th colspan="2" class="has-text-centered">Are they coming?</th>
                    </tr>
                </thead>
                <tbody>
                    <AttendanceQuestionRow 
                        v-for="guest in party"
                        :name="guest.name"
                    />
                </tbody>
            </table>
            <transition name="fade" mode="out-in">
                <Question
                    v-if="!answeredQuestion || !showTextbox"
                    question="Do you or anyone in your party have any dietary restrictions?"
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