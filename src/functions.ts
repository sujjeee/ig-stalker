import { Env } from "./types"

function processStories(data: any) {
  if (!data.result || !Array.isArray(data.result)) {
    console.error("Invalid data structure")
    return []
  }

  return data.result.map((story: any) => {
    const isVideo = "video_versions" in story
    const mediaUrl = isVideo
      ? story.video_versions[0].url
      : story.image_versions2.candidates[0].url

    return { id: story.pk, url: mediaUrl }
  })
}

export async function getInstaStory(username: string, env: Env) {
  try {
    const response = await fetch(`${env.BASE_IG_URL}/${username}`)
    const data = await response.json()

    const proccessedData = processStories(data)
    return proccessedData
  } catch (error) {
    console.error("Error fetching Instagram story:", error)
    return []
  }
}

interface SendTelegramMediaProps {
  media: {
    id: string
    url: string
  }
  env: Env
}

export async function sendTelegramMedia({
  env,
  media,
}: SendTelegramMediaProps) {
  const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN
  const CHAT_ID = env.TELEGRAM_CHAT_ID

  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error("Telegram bot token or chat ID is missing")
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  const payload = {
    chat_id: CHAT_ID,
    text: media.url,
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (response.ok) {
      console.log(`Media URL sent successfully!`)
      // Store the story ID in KV after successful send
      await env.IG_STALKER_KV.put(media.id, "sent", { expirationTtl: 86400 })
    } else {
      console.error(`Error sending media URL:`, data)
    }
  } catch (error) {
    console.error("Error occurred:", error)
  }
}
