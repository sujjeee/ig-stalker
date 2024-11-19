import { Hono } from "hono"
import { cors } from "hono/cors"
import { Env } from "./types"
import { z } from "zod"
import { bearerAuth } from "hono/bearer-auth"
import { zValidator } from "@hono/zod-validator"
import { getInstaStory, sendTelegramMedia } from "./functions"

const app = new Hono<{ Bindings: Env }>()

app.use("*", cors())

const usernameSchema = z.object({
  username: z.string().max(120, { message: "Invalid username!" }),
})

app.post(
  "/",
  zValidator("json", usernameSchema),
  bearerAuth({
    verifyToken: async (token, c) => {
      return token === c.env.TOKEN
    },
  }),
  async (c) => {
    const { username } = await c.req.json()

    if (!username) {
      return c.json({ error: "Username is required" }, 400)
    }

    try {
      const stories = await getInstaStory(username, c.env)

      if (stories.length === 0) {
        return c.json({ message: "No stories found" }, 200)
      }

      let sentCount = 0

      for (const story of stories) {
        const existingStory = await c.env.IG_STALKER_KV.get(story.id)
        if (!existingStory) {
          await sendTelegramMedia({
            media: story,
            env: c.env,
          })
          sentCount++
        }
      }

      return c.json({
        message: "Stories processed",
        sent: sentCount,
        total: stories.length,
      })
    } catch (error) {
      console.error("Error:", error)
      return c.json(
        { error: "An error occurred while processing the request" },
        500,
      )
    }
  },
)

export default app
