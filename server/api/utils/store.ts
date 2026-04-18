import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const FILE_PATH = join(process.cwd(), 'data.json')

type Player = {
  username: string
  score: number
  // add more fields here
}

type Database = Record<string, Player>

export function readStore(): Database {
  if (!existsSync(FILE_PATH)) return {}
  return JSON.parse(readFileSync(FILE_PATH, 'utf-8'))
}

export function writeStore(db: Database) {
  writeFileSync(FILE_PATH, JSON.stringify(db, null, 2))
}

// Get a single player by wandID — returns null if not found
export function getPlayer(wandID: string): Player | null {
  const db = readStore()
  return db[wandID] ?? null
}

// Check if a wandID exists
export function hasPlayer(wandID: string): boolean {
  const db = readStore()
  return wandID in db
}

// Add or overwrite a player
export function setPlayer(wandID: string, data: Player) {
  const db = readStore()
  db[wandID] = data
  writeStore(db)
}

// Update specific fields on an existing player
export function updatePlayer(wandID: string, updates: Partial<Player>) {
  const db = readStore()
  if (!(wandID in db)) throw new Error(`Player ${wandID} not found`)
  db[wandID] = { ...db[wandID], ...updates }
  writeStore(db)
}