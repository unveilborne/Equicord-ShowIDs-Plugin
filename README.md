# ShowIDs for Equicord 
*made by Ryuzaki*

Yo, so I finally got fed up with Discord’s internal classes breaking every single time they push a tiny update, so I whipped up this "bulletproof" Equicord plugin. It basically just sticks User IDs right next to names in chat so you don't have to go profile hunting like a Fed lmao.

### Why this one actually hits:
* **Discord-Proof:** Discord loves scrambling their Webpack modules just to mess with us, but this plugin literally does not care. It uses pure DOM observation to snatch IDs straight from avatar URLs. If they have a PFP, it works. Big brain moves only. 
* **Dual Color Control & Transparency:** You can actually customize the resting badge color *and* the "copied" state color separately in the settings. I set both to a super clean "Transparent" by default, but you can drop-down to Black, Discord Blue, Green, whatever. I even made it smart enough to swap the text color automatically depending on your background so it stays readable. We love accessibility.
* **Double-Click to Copy:** If you need an ID fast, and ban anyone ASAP, just double-click the badge. I added a custom event blocker too, so you don't accidentally "Reply" to someone while you're just tryna copy their ID. Absolute lifesaver.
* **No Bot Spam:** It automatically ignores bot/app accounts so your chat doesn't look like a wall of numbers, but you can toggle that off if you’re into that. 
* **Clean Sidebar:** It only injects into the actual chat messages. Your member list stays original and clean. No clutter here.

### How to get it running:
1. **Throw** the `showUserIDs` folder into your `src/userplugins/` directory.
2. Open your terminal in your main Equicord folder.
3. Run `pnpm build`
4. Run `pnpm inject`
5. Completely restart Discord!

# Development Note:
Full transparency: I am definitely NOT a TypeScript wizard lmao. I basically treated the AI like my personal slave to handle the syntax. 

I really only built this for my own personal gain and because I thought it'd be fun to see if I could beat Discord's obfuscation, but I figured I'd share it since it actually works. I was the director, the AI was the slave. I came up with the logic, wrestled with the CSS until it didn't look like trash, and spent way too long squashing that double-click bug. 

It works perfectly on my machine, but if any of you senior devs wanna peek under the hood and tell me why my code is messy, please hit me with a Pull Request. I’m just out here tryna learn.
