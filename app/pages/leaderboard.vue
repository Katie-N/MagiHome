<template>
    <div>
        <img src="/leaderboard/bulletinBoard.jpg" alt="" class="w-screen h-screen absolute -z-10">
        <div class="bg-[url(/leaderboard/scroll.png)] h-screen md:p-12 absolute left-0 right-0 m-auto bg-contain bg-no-repeat bg-center">
            <div class="flex flex-col align-center h-full justify-center md:justify-around py-12">
                <p v-for="player in players" class="font-whisper text-5xl md:text-8xl text-center">{{player.username}}: {{ player.score }}</p>
            </div>
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