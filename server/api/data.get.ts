import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(() => {
const FILE_PATH = join(process.cwd(), 'data.json')

  if (!existsSync(FILE_PATH)) return []
  return JSON.parse(readFileSync(FILE_PATH, 'utf-8'))
})