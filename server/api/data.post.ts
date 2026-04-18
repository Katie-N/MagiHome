import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const FILE_PATH = join(process.cwd(), 'data.json')

function writeStore(items: any[]) {
  writeFileSync(FILE_PATH, JSON.stringify(items, null, 2))
}

function readStore(): any[] {
  if (!existsSync(FILE_PATH)) return []
  return JSON.parse(readFileSync(FILE_PATH, 'utf-8'))
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const items = readStore()
  items.push(body)
  writeStore(items)
  return { success: true }
})