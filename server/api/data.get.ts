import { readStore } from './utils/store'

export default defineEventHandler(() => {
  return readStore()
})