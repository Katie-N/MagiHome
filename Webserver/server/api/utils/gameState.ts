type GameType = 'hotPotato' | 'russianRoulette' | 'quickDraw'

type GameState = {
  active: boolean
  gameType: GameType | null
  currentHolder: string | null  // wandID of whoever is "it"
  players: Array<string> | null // list of wandID of whoever is playing
  falseStart: boolean // if the game is active but players shouldn't be casting yet (like during the countdown) use the falseStart flag to catch it in game logic
  // add more fields as needed per game type
}

export const gameState: GameState = {
  active: false,
  gameType: null,
  currentHolder: null,
  players: null,
  falseStart: false
}

export function resetGame() {
  gameState.active = false
  gameState.gameType = null
  gameState.currentHolder = null
  gameState.players = null
  gameState.falseStart = false
}