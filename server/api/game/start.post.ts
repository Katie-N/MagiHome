import { gameState } from '../utils/gameState'

// expects gameType: string
// wandID: string for the player who's turn it is
// players: [string] list of wandIDs of players
export default defineEventHandler(async (event) => {
  const { gameType, wandID, players } = await readBody(event)

  gameState.active = true
  gameState.gameType = gameType
  gameState.currentHolder = wandID
  gameState.players = players

  return { success: true }
})