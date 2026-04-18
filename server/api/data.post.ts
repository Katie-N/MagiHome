import { readStore, writeStore, hasPlayer } from './utils/store'
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = readStore()
  
  // if (hasPlayer(body.wandID)) {
  //   // update user stats in db

  // } else {
  //   // Add user to db
  // }

  // Play 
  const response = await $fetch('http://192.168.12.98:8123/api/services/media_player/play_media', {
    method: 'POST',
    headers: {
      'Authorization': runtimeConfig.bearer_token,
      'Content-Type': 'application/json'
    },
    // body: '{"entity_id": "media_player.googlehome2431", "media_content_id": "media-source://media_source/local/Click.m4a", "media_content_type": "music"}',
    body: JSON.stringify({
      'entity_id': 'media_player.googlehome2431',
      'media_content_id': 'media-source://media_source/local/katieWins.mp3',
      'media_content_type': 'music'
    }),
  })
})