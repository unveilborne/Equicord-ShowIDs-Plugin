# Equicord-ShowIDs-Plugin
ShowIDs for Equicord 🏷️
*Created by Ryuzaki*

A bulletproof, custom Equicord plugin that visually displays User IDs directly next to usernames in the chat window. 

### Features
* **Bypasses Scrambled Classes:** Uses pure DOM observation to find avatars and extract IDs directly from Discord's image URLs, meaning it won't break when Discord updates their internal Webpack modules.
* **Customizable Colors:** Features a built-in Equicord settings panel so you can change the background color of the ID badge to match your theme.
* **Double-Click to Copy:** Double-click any ID badge to instantly copy it to your clipboard. It features a custom event-blocker so it won't accidentally trigger Discord's native reply feature!
* **Smart Filtering:** Strictly applies only to chat messages; it keeps your member list sidebar clean.

### How to Install
1. Drop the `showUserIDs` folder into your `src/userplugins/` directory.
2. Open your terminal in the main Equicord folder.
3. Run `pnpm build`
4. Run `pnpm inject`
5. Completely restart Discord!

# Development Note:
> I built this plugin using an AI pair programmer. While the AI handled the TypeScript syntax, I drove the architecture, made the UI/UX decisions, and did extensive QA testing and debugging to ensure the DOM-observation logic successfully bypasses Discord's recent Webpack obfuscation. If you are an experienced developer and see room for optimization, Pull Requests are absolutely welcome!
