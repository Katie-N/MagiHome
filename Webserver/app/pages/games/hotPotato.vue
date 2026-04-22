<template>
    <div>
        <!-- bg-img -->
        <img src="/wizard hot potato.webp" alt="" class="w-screen h-screen absolute -z-10">
        <!-- Explanation -->
        <h1 class="text-9xl text-center font-whisper">hot potato</h1>
        <div class="w-screen flex flex-row ">
            <p class="flex-auto text-right text-2xl">
                When the light turns your color, you must cast your wand to pass it to the next player. <br>
                If the timer runs out and your color is on the lamp, you are out. If you don't lose, you will get points.
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
            "gameType": "hotPotato",
            "players": selectedPlayers,
            "wandID": selectedPlayers[0]
        })   
    })
}
</script>