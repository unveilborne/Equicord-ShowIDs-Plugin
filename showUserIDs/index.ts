import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    badgeColor: {
        type: OptionType.SELECT,
        description: "Choose the background color for the ID badge.",
        options: [
            { label: "Transparent (Default)", value: "transparent", default: true },
            { label: "Black", value: "#000000" },
            { label: "Discord Blue", value: "#5865F2" },
            { label: "Green", value: "#23A559" },
            { label: "Red", value: "#DA373C" },
            { label: "White", value: "#FFFFFF" },
            { label: "Yellow", value: "#FEE75C" }
        ]
    },
    copiedColor: {
        type: OptionType.SELECT,
        description: "Choose the background color when an ID is copied.",
        options: [
            { label: "Transparent (Default)", value: "transparent", default: true },
            { label: "Black", value: "#000000" },
            { label: "Discord Blue", value: "#5865F2" },
            { label: "Green", value: "#23A559" },
            { label: "Red", value: "#DA373C" },
            { label: "White", value: "#FFFFFF" },
            { label: "Yellow", value: "#FEE75C" }
        ]
    },
    ignoreBots: {
        type: OptionType.BOOLEAN,
        default: true, 
        description: "Hide the ID badge for Bot and App accounts."
    }
});

let chatObserver: MutationObserver | null = null;
let updateTimeout: number | null = null;

export default definePlugin({
    name: "ShowIDs",
    description: "Displays User IDs next to chat usernames. Features color drop-downs, smart text contrast, and double-click to copy.",
    
    // REPLACE '0' WITH YOUR ACTUAL DISCORD USER ID (Keep the 'n' at the end!)
    authors: [{ name: "ryuzaki", id: 0n }], 

    settings, 

    injectBadges() {
        let bgColor = settings.store.badgeColor;
        let ignoreBots = settings.store.ignoreBots ?? true;
        
        if (!bgColor) bgColor = "transparent"; 

        // Smart Text Color Logic for the Resting Badge
        let textColor = '#FFFFFF';
        if (bgColor === "#FFFFFF" || bgColor === "#FEE75C") {
            textColor = "#000000"; 
        } else if (bgColor === "transparent") {
            textColor = "#FFFFFF"; 
        }

        document.querySelectorAll('.custom-id-badge').forEach(badge => {
            const el = badge as HTMLElement;
            if (el.getAttribute('data-original-bg') !== bgColor && el.innerText !== 'COPIED!') {
                el.style.backgroundColor = bgColor;
                el.style.color = textColor;
                
                el.setAttribute('data-original-bg', bgColor);
                el.setAttribute('data-original-text', textColor);
            }
        });

        document.querySelectorAll('h3').forEach(header => {
            const usernameSpan = header.querySelector('[id^="message-username-"]');
            if (!usernameSpan) return;

            const messageContainer = header.closest('li') || header.closest('[role="article"]') || header.parentElement?.parentElement;
            if (!messageContainer) return;

            const isBot = messageContainer.querySelector('[class*="botTag"], [class*="appTag"], [class*="botText"], [aria-label*="Bot"], [aria-label*="App"]');
            if (ignoreBots && isBot) return;

            if (header.querySelector('.custom-id-badge')) return;

            const avatar = messageContainer.querySelector('img[src*="/avatars/"], img[src*="/users/"]') as HTMLImageElement;
            
            if (avatar && avatar.src) {
                const match = avatar.src.match(/\/(?:avatars|users)\/(\d+)/);
                if (match && match[1]) {
                    const userId = match[1];

                    const badge = document.createElement('span');
                    badge.className = 'custom-id-badge';
                    
                    badge.setAttribute('data-original-bg', bgColor);
                    badge.setAttribute('data-original-text', textColor);
                    
                    badge.innerText = `ID: ${userId}`;
                    badge.style.backgroundColor = bgColor;
                    badge.style.color = textColor;
                    
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

                    const preventDiscordEvents = (e: Event) => {
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    };

                    badge.addEventListener('mousedown', preventDiscordEvents);
                    badge.addEventListener('mouseup', preventDiscordEvents);
                    badge.addEventListener('click', preventDiscordEvents);

                    let isCopied = false;

                    badge.addEventListener('dblclick', (e) => {
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        if (isCopied) return;

                        navigator.clipboard.writeText(userId).then(() => {
                            isCopied = true;
                            
                            // Fetch the custom copied color directly from settings
                            let copyBgColor = settings.store.copiedColor || "transparent";
                            let copyTextColor = '#FFFFFF';
                            
                            // Smart text color for the copied state
                            if (copyBgColor === "#FFFFFF" || copyBgColor === "#FEE75C") {
                                copyTextColor = "#000000"; 
                            } else if (copyBgColor === "transparent") {
                                copyTextColor = "#FFFFFF"; 
                            }

                            badge.innerText = 'COPIED!';
                            badge.style.backgroundColor = copyBgColor; 
                            badge.style.color = copyTextColor; 
                            
                            setTimeout(() => {
                                if (badge) {
                                    badge.innerText = `ID: ${userId}`;
                                    badge.style.backgroundColor = badge.getAttribute('data-original-bg') || bgColor;
                                    badge.style.color = badge.getAttribute('data-original-text') || textColor;
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
    }
});
