<template>
    <div>
        <!-- bg-img -->
        <div class="absolute w-screen flex flex-row bottom-0 justify-between items-baseline" >
            <img src="/games/wizard silhouette 2.png" alt="" class="h-3/4">
            <img src="/games/wizard silhouette.png" alt="" class="h-3/4">
        </div>
        <!-- <img src="/wizard hot potato.webp" alt="" class="w-screen h-screen absolute -z-10"> -->
        <!-- Explanation -->
        <h1 class="text-9xl text-center font-whisper">Wizard Duel</h1>
        <div class="w-screen flex flex-row ">
            <p class="flex-auto text-right text-2xl">
                Wait for the signal, then cast your wand before your opponents!
            </p>
            <!-- Start Game -->
            <form v-on:submit="startGame" class="flex-auto">
                <div v-for="player in players">
                    <input name="players" :id="player.wandID" type="checkbox" />
                    {{ player.username }}
                </div>
                <button type="submit">Start Game</button>
            </form>
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

function startGame(event) {
    event.preventDefault()
    // Select all checked checkboxes with a specific name or class
    const checkedElements = document.querySelectorAll('input[name="players"]:checked');

    // Convert NodeList to an array of string values
    const selectedPlayers = [...checkedElements].map(checkbox => checkbox.id);
    console.log(selectedPlayers)

    $fetch("/api/game/start", {
        method: 'POST',
        body: JSON.stringify({
            "gameType": "quickDraw",
            "players": selectedPlayers,
            "wandID": null
        })   
    })
}
</script>