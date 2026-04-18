import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const playerDBFilePath = join(process.cwd(), 'playerDB.json')
const sensorDBFilePath = join(process.cwd(), 'sensorDB.json')

type Player = {
  username: string
  color: string
  sparkleSound: number
  score: number
  // add more fields here
}

export type Sensor = {
  entity_id: string
  apiService: string
  colorChanging: boolean
  apiBody: object
  // add more fields here
}

type playerDatabase = Record<string, Player>
type sensorDatabase = Record<string, Sensor>

export function readPlayerDB(): playerDatabase {
  if (!existsSync(playerDBFilePath)) return {}
  return JSON.parse(readFileSync(playerDBFilePath, 'utf-8'))
}

export function writePlayerDB(db: playerDatabase) {
  writeFileSync(playerDBFilePath, JSON.stringify(db, null, 2))
}

export function readSensorDB(): sensorDatabase {
  if (!existsSync(sensorDBFilePath)) return {}
  return JSON.parse(readFileSync(sensorDBFilePath, 'utf-8'))
}

export function writeSensorDB(db: sensorDatabase) {
  writeFileSync(sensorDBFilePath, JSON.stringify(db, null, 2))
}

export function setSensor(sensorID: string, data: Sensor) {
    const db = readSensorDB()
    db[sensorID] = data
    writeSensorDB(db)
}

// Get a single sensor by sensorID — returns null if not found
export function getSensor(sensorID: string): Sensor | null {
  const db = readSensorDB()
  return db[sensorID] ?? null
}

// Get a single player by wandID — returns null if not found
export function getPlayer(wandID: string): Player | null {
  const db = readPlayerDB()
  return db[wandID] ?? null
}

// Check if a wandID exists
export function hasPlayer(wandID: string): boolean {
  const db = readPlayerDB()
  return wandID in db
}

// Add or overwrite a player
export function setPlayer(wandID: string, data: Player) {
  const db = readPlayerDB()
  db[wandID] = data
  writePlayerDB(db)
}

// Update specific fields on an existing player
export function updatePlayer(wandID: string, updates: Partial<Player>) {
  const db = readPlayerDB()
  if (!(wandID in db)) throw new Error(`Player ${wandID} not found`)
  db[wandID] = { ...db[wandID], ...updates }
  writePlayerDB(db)
}