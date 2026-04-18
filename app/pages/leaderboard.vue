<template>
    <div>
        <p class="">this is a leaderboard</p>
        <div class="flex flex-col align-center">
            <p v-for="player in players">{{player.username}}: {{ player.score }}</p>
        </div>
    <pre v-for="(item, i) in data" :key="i">{{ item }}</pre>

    </div>
</template>

<script setup>
    let players = {
        0: {
            username: "3Screams",
            score: 1000,
            favoriteColor: "Pink"
        },
        1: {
            username: "Fireball7s",
            score: -200,
            favoriteColor: "Red"
        }
    }
const { data, refresh } = await useFetch('/api/data', {
  // Poll every 3 seconds for new data
  watch: false,
})

// Auto-refresh every 3s
onMounted(() => setInterval(refresh, 3000))
</script>