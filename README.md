# IG Stalker - Instagram Story Stalker Automation Tool!

**Ig-Stalker** is an automation tool that allows users to anonymously view public Instagram stories and receive notifications when new stories are posted.

_This project is intended for educational purposes, demonstrating the use of publicly available APIs to build useful applications._

## Features & How It Works

- **Anonymous Instagram Story Viewer:** View public Instagram stories without logging into Instagram, using a third-party publicly available API.
- **Telegram Notifications:** Get instant notifications via Telegram whenever a new story is posted by the target user.
- **Automatic Story Checking:** A cron job runs every 3 hours to check for new stories, ensuring you never miss an update.
- **Efficient Bandwidth Usage:** Instead of sending story content, the tool shares story URLs, saving bandwidth and improving efficiency.
- **Cloudflare KV:** Unique story IDs are stored in Cloudflare KV to prevent duplicate notifications and avoid spamming your Telegram channel.

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/sujjeee/ig-stalker.git
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Copy the `.dev.vars.example` to `.dev.vars` and update the variables.

   ```bash
   cp .dev.vars.example .dev.vars
   ```

4. Start the development server

   ```bash
   pnpm dev
   ```

## How do I deploy this?

```bash
pnpm run deploy
```

Make sure you have the Cloudflare CLI (Wrangler) set up.
