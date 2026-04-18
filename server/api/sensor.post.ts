import { setSensor } from "./utils/store"

// Expects post requests with the form:
/* {
    sensorID: number,
    data {
        apiServices: "media_player/play_media", "light/turn_on", etc.
        colorChanging: Bool // If its true then make sure to add the player's fav color into the body.
        body: {required fields depending on device type}
    }
} */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    setSensor(body.sensorID, body.data)
})