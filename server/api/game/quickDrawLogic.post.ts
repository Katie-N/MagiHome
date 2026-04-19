import { changeStatusLight } from '../data.post'
import { gameState } from '../utils/gameState'
import { getPlayerColor, getPlayer, addScoreToPlayer } from '../utils/store'
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    let { wandID } = await readBody(event)
    console.log(wandID)
    if (!gameState.active) {
        return
    }

    if (gameState.falseStart) {
        console.log("You cheater!" + wandID)
        return
    }

    if (gameState.currentHolder == null) {
        gameState.currentHolder = wandID
        console.log("You won " + wandID)
        addScoreToPlayer(wandID, 50)
        changeStatusLight(getPlayerColor(wandID))
        // Give some time for the slower magi to cast their wands before ending the game
        setTimeout(() => {
            gameState.active = false
        }, 3000);
    } else {
        console.log("Too slow " + wandID)
    }
})