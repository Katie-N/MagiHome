type GameType = 'hotPotato' | 'russianRoulette' | 'quickDraw'

type GameState = {
  active: boolean
  gameType: GameType | null
  currentHolder: string | null  // wandID of whoever is "it"
  players: Array<string> | null // list of wandID of whoever is playing
  // add more fields as needed per game type
}

export const gameState: GameState = {
  active: false,
  gameType: null,
  currentHolder: null,
  players: null
}

export function resetGame() {
  gameState.active = false
  gameState.gameType = null
  gameState.currentHolder = null
  gameState.players = null
}