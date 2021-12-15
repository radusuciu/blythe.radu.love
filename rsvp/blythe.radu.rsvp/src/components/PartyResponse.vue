<script setup lang="ts">

import { ref, computed } from 'vue'
import AttendanceQuestionRow from './AttendanceQuestionRow.vue'
import Question from './Question.vue'
import { Guest, GuestResponse } from '../api/guest'


const props = defineProps({
    guest: {
        type: Object as () => Guest,
        required: true,
    }
})

const emit = defineEmits(['wrongGuest', 'response'])


// TODO: sort guest before rest of party
const showTextbox = ref(false)
const answeredQuestion = ref(false)
const responseSelected = ref(false)
const dietaryRestrictions = ref('')

const party = [props.guest, ...props.guest.party]

const responses = {}


function guestIsComing(guest: Guest) {
    responses[guest.id] = {
        
    }
}

function guestIsNotComing(guest: Guest) {

}


function onResponse() {
    emit('response')
}


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
                        v-for="g in party"
                        :name="g.name"
                        @yes="guestIsComing(g); responseSelected = true"
                        @no="guestIsNotComing(g); responseSelected = true"
                    />
                </tbody>
            </table>
            <transition name="fade" mode="out-in">
                <Question
                    v-if="!answeredQuestion || !showTextbox"
                    class="has-text-centered is-italic"
                    question="Do you or anyone in your party have any dietary restrictions?"
                    @yes="showTextbox = true; answeredQuestion = true"
                    @no="answeredQuestion = true"
                />
                <div v-else-if="showTextbox" class="has-text-grey">
                    <p>Please note any dietary restrictions and we'll do our best to accomodate you.
                    </p>
                    <textarea v-model="dietaryRestrictions" class="textarea is-size-5 mt-2" rows="1"></textarea>
                </div>
            </transition>
        </div>

        <button
            :disabled="!responseSelected"
            class="is-large is-primary button is-pulled-right"
            @click="onResponse"
        >
            Submit My Response
        </button>
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