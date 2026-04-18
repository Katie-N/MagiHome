import { gameState } from '../utils/gameState'
import { getPlayerColor, getPlayer } from '../utils/store'
const runtimeConfig = useRuntimeConfig()


export default defineEventHandler(async (event) => {
  const { wandID } = await readBody(event)
  if (gameState.gameType !== 'hotPotato') {
    throw createError({ statusCode: 400, message: 'Not a hot potato game' })
  }
  console.log(wandID)

  // ... hot potato logic
  if (gameState.active) {
    // Make sure these are valid
    // If someone not in the game cast their wand, ignore it.
    // || !(wandID in gameState.players)
    if (!gameState.players || !gameState.currentHolder) {
      console.log("game state didn't get properly defined")
      return
    }
    if (!gameState.players.includes(wandID)) {
      console.log("youre not playing " + wandID + " not in " + gameState.players)
      return
    }

    // Get the wandID of the next player
    let nextPlayerIndex = gameState.players.indexOf(gameState.currentHolder) + 1 
    if (gameState.players.length <= nextPlayerIndex) {
        nextPlayerIndex = 0
    }
  
    if (gameState.currentHolder != wandID) {
      console.log("OOPS, not your turn! ")
      let loser = getPlayer(wandID)
      if (loser) {
        console.log(loser?.username)
        lightUpNextPlayer(loser.color)
      } else {
        console.log("Unknown which player was too quick")
        lightUpNextPlayer("white")
      }      
      playSoundEffect("Im sorry magi deep.mp3")
      gameState.active = false
      return
    }

    gameState.currentHolder = gameState.players[nextPlayerIndex]

    // light up with the next player's color.
    playSoundEffect("sparkle3.mp3")
    let newColor = getPlayerColor(gameState.currentHolder)
    lightUpNextPlayer(newColor)
  } else {
    console.log("Go home alexander.")
  }
  
})

// Play a sound effect that is already presen in HA media folder. 
async function playSoundEffect(mediaName: string) {
  // TODO: Later add support for playing the sparkle effect defined in playerDB
                                                                           
  const response = await $fetch('http://192.168.12.98:8123/api/services/media_player/play_media', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + runtimeConfig.bearer_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "entity_id": "media_player.googlehome2431",
      "media_content_id": "media-source://media_source/local/" + mediaName,
      "media_content_type": "music"
    }),
  })
  return response
}

// Play a sound effect that is already presen in HA media folder. 
async function lightUpNextPlayer(newColor: string) {
  // TODO: Later add support for playing the sparkle effect defined in playerDB

  const response = await $fetch('http://192.168.12.98:8123/api/services/light/turn_on', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + runtimeConfig.bearer_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "entity_id": "light.wiz_bulb",
      "color_name": newColor
    }),
  })
  return response
}