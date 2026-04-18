import { readPlayerDB } from './utils/store'

export default defineEventHandler(() => {
  return readPlayerDB()
})