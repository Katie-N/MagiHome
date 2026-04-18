<template>
    <div>
        <p class="">this is a leaderboard</p>
        <div class="flex flex-col align-center">
            <p v-for="player in players">{{player.username}}: {{ player.score }}</p>
        </div>
    </div>
</template>

<script setup>
// Refresh the player database (data and refresh are keywords returned by useFetch. They can't be renamed)
const { data, refresh } = await useFetch('/api/player', {
    // No need to watch. We are polling.
    watch: false,
})

// Recomputes automatically whenever data changes
const players = computed(() => {
    if (!data.value) return []
    return Object.entries(data.value)
        .map(([key, value]) => ({ wandID: key, ...value }))
        .sort((a, b) => b.score - a.score)
})

// Auto-refresh every 0.5s
onMounted(() => setInterval(refresh, 500))
</script>