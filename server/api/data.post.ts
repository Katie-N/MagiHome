import { readPlayerDB, writePlayerDB, hasPlayer, getSensor, getPlayer, Sensor } from './utils/store'
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
    //  Pass to game handler
  // Else if wand has been registered:
  if (hasPlayer(body.wandID)){
    // Take appropriate action based on sensor ID and custom wand config (if applicable)
    let sensor = getSensor(body.sensorID)
    if (sensor) {
      return await callHAAPI(sensor, body.wandID)
    } else {
      console.log("Sensor ID " + body.sensorID + " is not in our database")
    }
  }

  // Else
  else {
  // If the wand registration page is open, populate it with the detected wand ID (is this possible??)
    console.log("register your wand, magi")
  }

    // Also consider a sole sensor specifically for wand registration. Then anytime data from that sensor comes in, you know its to register a wand or check your stats
})

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