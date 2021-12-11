<script setup lang="ts">

defineProps({
    name: String
})
</script>

<template>
    <div class="thanks">
        <h1 class="title">Thanks for responding <strong class="has-text-info">{{ name }}</strong>!</h1>
        <p class="subtitle">
            If you have any questions, please email us at <a href="mailto:rsvp@blythe.radu.love">rsvp@blythe.radu.love</a>
        </p>

        <p class="is-size-1 has-text-centered">ʘ︵ʘ</p>
        <p>We're sad you won't be able to make it, but thank you again for letting us know. If anything changes, please feel free RSVP again.</p>
    </div>
</template>

<style>
#app {
    height: 100%;
}
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

<style scoped>
.thanks {
}
</style>