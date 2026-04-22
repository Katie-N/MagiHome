import { gameState } from './utils/gameState'
import { readPlayerDB, writePlayerDB, hasPlayer, getSensor, getPlayer, Sensor, addScoreToPlayer } from './utils/store'
const runtimeConfig = useRuntimeConfig()

// Expects data of the form:
// {
//   "sensorID": number,
//   "wandID": number 
// }
// curl -X POST http://localhost:3000/api/sensor   -H "Content-Type: application/json"   -d '{"sensorID": 0, "wandID": 0 }'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // First check if a game is in progress.   
  // If there is a game in progress:
  if (gameState.active) {
    //  Pass to game handler
    passToGame(body)
  } else if (hasPlayer(body.wandID)){ // Else if wand has been registered:
    // Take appropriate action based on sensor ID and custom wand config (if applicable)
    let sensor = getSensor(body.sensorID)
    if (sensor) {
      // Play the sparkle sound effect.
      // If the speaker is used by the sensor it will not play the sparkle 
      playSoundEffect("sparkle1.mp3")
      let status = await callHAAPI(sensor, body.wandID)

      addScoreToPlayer(body.wandID, 10)
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'sensorID ' + body.sensorID + " is not in our database",
      })
    }
  }
  // Else
  else {
  // If the wand registration page is open, populate it with the detected wand ID (is this possible??)
    console.log("register your wand, magi")
    throw createError({
      statusCode: 400,
      statusMessage: 'wandID ' + body.wandID + " is not in our database",
    })
  }

    // Also consider a sole sensor specifically for wand registration. Then anytime data from that sensor comes in, you know its to register a wand or check your stats
})

// Call a HA API to perform an action on a device (turn on a light, turn on a smart plug, etc.)
async function callHAAPI(sensor: Sensor, wandID: string) {
  // If the sensor is color changing, use the wand caster's color
  if (sensor.colorChanging) {
    let newColor
    let playerData = getPlayer(wandID)
    if (playerData) {
      newColor = playerData.color
    }
    sensor.apiBody.color_name = newColor ?? "white" // default to white if the wand caster's color cannot be found
  }
  // Perform HA action 
  const response = await $fetch('http://192.168.12.98:8123/api/services/' + sensor.apiService, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + runtimeConfig.bearer_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sensor.apiBody),
  })
  return response
}

// Play a sound effect that is already presen in HA media folder. 
export async function playSoundEffect(mediaName: string) {
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

async function passToGame(eventBody) {
  if (gameState.gameType == "hotPotato") {
    const response = await $fetch("/api/game/passPotato", {
      method: 'POST',
      body: eventBody
    })
    return response
  } else if (gameState.gameType == "quickDraw") {
    const response = await $fetch("/api/game/quickDrawLogic", {
      method: 'POST',
      body: eventBody
    })
    return response
  }
}

export async function changeStatusLight(newColor: string) {
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