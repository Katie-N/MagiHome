import { setPlayer } from "./utils/store"

// curl -X POST http://localhost:3000/api/player   -H "Content-Type: application/json"   -d '{"wandID": "0", "data": {"username":"3Screams", "color":"pink", "score": 0} }'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    setPlayer(body.wandID, body.data)
})