# ShowIDs for Equicord 
*made by Ryuzaki*

Yo, so I finally got fed up with Discord’s internal classes breaking every single time they push a tiny update, so I whipped up this "bulletproof" Equicord plugin. It basically just sticks User IDs right next to names in chat so you don't have to go profile hunting like a Fed lmao.

### Why this one actually hits:
* **Discord-Proof:** Discord loves scrambling their Webpack modules just to mess with us, but this plugin literally does not care. It uses pure DOM observation to snatch IDs straight from avatar URLs. If they have a PFP, it works. Big brain moves only. 
* **Color options:** You can actually customize the badge colors in the settings (Black, Discord Blue, Green, whatever). I even made it smart enough to swap the text color automatically so it stays readable. We love accessibility.
* **Double-Click to Copy:** If you need an ID fast, and ban anyone ASAP, just double-click the badge. I added a custom event blocker too, so you don't accidentally "Reply" to someone while you're just tryna copy their ID. Absolute lifesaver.
* **No Bot Spam:** It automatically ignores bot/app accounts so your chat doesn't look like a wall of numbers, but you can toggle that off if you’re into that. 
* **Clean Sidebar:** It only injects into the actual chat messages. Your member list stays original and clean. No clutter here.

### How to get it running:
1.  **Throw** the `showUserIDs` folder into your `src/userplugins/` directory.

# Development Note:
> I built this plugin using an AI pair programmer. While the AI handled the TypeScript syntax, I drove the architecture, made the UI/UX decisions, and did extensive QA testing and debugging to ensure the DOM-observation logic successfully bypasses Discord's recent Webpack obfuscation. If you are an experienced developer and see room for optimization, Pull Requests are absolutely welcome!
