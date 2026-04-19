import { gameState } from '../utils/gameState'
import { getPlayerColor } from '../utils/store'
import { playSoundEffect, changeStatusLight } from '../data.post'

// expects gameType: string
// wandID: string for the player who's turn it is
// players: [string] list of wandIDs of players
export default defineEventHandler(async (event) => {
  const { gameType, wandID, players } = await readBody(event)

  gameState.active = true
  gameState.gameType = gameType
  gameState.currentHolder = wandID
  gameState.players = players

  if (gameType == "hotPotato") {
    initHotPotato(wandID)
  } else if (gameType == "quickDraw") {
    initQuickDraw()
  }

  return { success: true }
})

function initHotPotato(firstPlayer) {
  changeStatusLight(getPlayerColor(firstPlayer))
}

async function initQuickDraw() {
  changeStatusLight("darkSlateGray")
  console.log("should be black")

  gameState.falseStart = true
  let resp = await playSoundEffect("321.mp3")
  setTimeout(() => {
    changeStatusLight("white")
    console.log("GO")
    gameState.falseStart = false
  }, 3500);
}