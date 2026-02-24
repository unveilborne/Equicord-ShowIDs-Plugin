import definePlugin, { OptionType } from "@utils/types";

let chatObserver: MutationObserver | null = null;
let updateTimeout: number | null = null;

export default definePlugin({
    name: "ShowIDs",
    description: "Visually displays User IDs next to usernames in chat. Customizable colors. Double-click to copy.",
    authors: [{ name: "ryuzaki", id: 0n }],

    settings: {
        badgeColor: {
            type: OptionType.COLOR,
            default: "#5865F2", 
            description: "Choose the background color for the ID badge."
        }
    },

    getSetting(key: string, defaultValue: any): any {
        // @ts-ignore
        const val = this.settings?.[key];
        return val !== undefined ? val : defaultValue;
    },

    injectBadges() {
        let rawColor = this.getSetting("badgeColor", "#5865F2");
        let bgColor = typeof rawColor === "number" ? `#${rawColor.toString(16).padStart(6, '0')}` : rawColor;
        
        if (!bgColor) bgColor = "#5865F2";

        document.querySelectorAll('h3').forEach(header => {
            const usernameSpan = header.querySelector('[id^="message-username-"]');
            if (!usernameSpan) return;

            if (header.querySelector('.custom-id-badge')) return;

            const messageContainer = header.closest('li') || header.closest('[role="article"]') || header.parentElement?.parentElement;
            if (!messageContainer) return;

            const avatar = messageContainer.querySelector('img[src*="/avatars/"], img[src*="/users/"]') as HTMLImageElement;
            
            if (avatar && avatar.src) {
                const match = avatar.src.match(/\/(?:avatars|users)\/(\d+)/);
                if (match && match[1]) {
                    const userId = match[1];

                    const badge = document.createElement('span');
                    badge.className = 'custom-id-badge';
                    
                    badge.innerText = `ID: ${userId}`;
                    badge.style.backgroundColor = bgColor;
                    badge.style.color = '#FFFFFF';
                    badge.style.padding = '2px 6px';
                    badge.style.borderRadius = '4px';
                    badge.style.marginLeft = '6px';
                    badge.style.fontSize = '10px';
                    badge.style.fontWeight = '700';
                    badge.style.display = 'inline-flex';
                    badge.style.alignItems = 'center';
                    badge.style.verticalAlign = 'middle';
                    badge.style.textTransform = 'uppercase';
                    badge.style.cursor = 'pointer';
                    badge.style.userSelect = 'none';

                    // --- NEW FIX: Swallow all mouse events so Discord ignores them ---
                    const preventDiscordEvents = (e: Event) => {
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    };

                    badge.addEventListener('mousedown', preventDiscordEvents);
                    badge.addEventListener('mouseup', preventDiscordEvents);
                    badge.addEventListener('click', preventDiscordEvents);
                    // -----------------------------------------------------------------

                    let isCopied = false;

                    badge.addEventListener('dblclick', (e) => {
                        e.stopPropagation();
                        e.stopImmediatePropagation(); // Ensure double-click is also fully swallowed
                        
                        if (isCopied) return;

                        navigator.clipboard.writeText(userId).then(() => {
                            isCopied = true;
                            
                            const previousColor = badge.style.backgroundColor;
                            
                            badge.innerText = 'COPIED!';
                            badge.style.backgroundColor = '#23a559'; 
                            
                            setTimeout(() => {
                                if (badge) {
                                    badge.innerText = `ID: ${userId}`;
                                    badge.style.backgroundColor = previousColor; 
                                    isCopied = false;
                                }
                            }, 1000);
                        });
                    });

                    if (usernameSpan.nextSibling) {
                        header.insertBefore(badge, usernameSpan.nextSibling);
                    } else {
                        header.appendChild(badge);
                    }
                }
            }
        });
    },

    start() {
        console.log("[ShowIDs] Starting plugin by ryuzaki...");

        const boundInject = this.injectBadges.bind(this);

        setTimeout(boundInject, 1500);

        chatObserver = new MutationObserver(() => {
            if (updateTimeout) cancelAnimationFrame(updateTimeout);
            updateTimeout = requestAnimationFrame(() => {
                boundInject();
            });
        });
        
        chatObserver.observe(document.body, { childList: true, subtree: true });
    },

    stop() {
        if (chatObserver) {
            chatObserver.disconnect();
            chatObserver = null;
        }
        document.querySelectorAll('.custom-id-badge').forEach(badge => badge.remove());
        console.log("[ShowIDs] Plugin stopped.");
    }
});