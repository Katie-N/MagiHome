<template>
    <div>
        <!-- bg-img -->
         <!-- Explanation -->
        hot potato
        Select the wizards who will be playing
        When the light turns your color, you must cast your wand to pass it to the next player. 
        If the timer runs out and your color is on the lamp, you are out.
        <!-- Start Game -->
        who is playing?
        <form v-on:submit="startGame">
            <div v-for="player in players">
                <input name="players" :id="player.wandID" type="checkbox" />
                {{ player.username }}
            </div>
            <button type="submit">Start Game</button>
        </form>
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