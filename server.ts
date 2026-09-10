import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Knowledge base summary for Game Vault Forum RAG
const VAULT_KNOWLEDGE_SUMMARY = `
=== GAME VAULT FORUM OFFICIAL KNOWLEDGE BASE ===
Website: Game Vault Forum (www.gamevault.forum)
Tagline: Your Vault for Everything Gaming.
Channel: Game Vault official YouTube channel (@GameVaultForum)

GAMES CATALOG (Verified in Game Vault Database):
1. Elden Ring (ID: 'elden-ring', Genre: RPG/Action, Platforms: PC, PS5, Xbox Series X/S, Developer: FromSoftware, Rating: 9.8/10, Link: /games/elden-ring)
   - Expansions: Shadow of the Erdtree. Open-world Soulsborne masterpiece, challenging boss design, Scadutree blessings.
2. World of Warships (ID: 'world-of-warships', Genre: Strategy/Simulation/Tactical Naval, Platforms: PC, Developer: Wargaming, Rating: 8.9/10, Link: /games/world-of-warships)
   - Key mechanics: Armor angling, concealment mechanics, citadel penetrations, tactical fleet positioning, destroyer smokescreens.
3. Cyberpunk 2077 (ID: 'cyberpunk-2077', Genre: RPG/Action/Open World, Platforms: PC, PS5, Xbox Series X/S, Developer: CD Projekt RED, Rating: 9.2/10, Link: /games/cyberpunk-2077)
   - Patch 2.1 overhaul, Phantom Liberty DLC, Ray Tracing Overdrive, Dogtown vertical combat.
4. Helldivers 2 (ID: 'helldivers-2', Genre: Action/Multiplayer/Co-op PvE, Platforms: PC, PS5, Developer: Arrowhead, Rating: 9.0/10, Link: /games/helldivers-2)
   - 4-player squad co-op, Galactic War liberation map, stratagem management, friendly fire, Automaton and Terminid fronts.
5. PUBG Mobile (ID: 'pubg-mobile', Genre: Battle Royale/Multiplayer/Action, Platforms: Mobile/PC Emulator, Developer: Krafton/Tencent, Rating: 8.5/10, Link: /games/pubg-mobile)
   - 100-player drops, Erangel/Miramar rotations, circle positioning, squad tactical comms.
6. Black Myth: Wukong (ID: 'black-myth-wukong', Genre: Action/RPG, Platforms: PC, PS5, Developer: Game Science, Rating: 9.1/10, Link: /games/black-myth-wukong)
   - Journey to the West lore, staff combat stances, spell transformations, rich mythic boss encounters.
7. Baldur's Gate 3 (ID: 'baldurs-gate-3', Genre: RPG/Strategy, Platforms: PC, PS5, Xbox, Developer: Larian Studios, Rating: 9.9/10, Link: /games/baldurs-gate-3)
   - Turn-based D&D 5e mechanics, massive branching narrative, co-op multiplayer, companion quests.
8. Hades II (ID: 'hades-2', Genre: Action/Roguelike, Platforms: PC, Developer: Supergiant Games, Rating: 9.4/10, Link: /games/hades-2)
   - Melinoë, underworld magic, Olympian boons, high replayability.

PUBLISHED ARTICLES & REVIEWS & GUIDES (Verified on Game Vault):
- Article: "Why World of Warships Is More Interesting Than I Expected" (Link: /articles/why-world-of-warships-is-more-interesting-than-i-expected, ID: 'art-1')
- Article: "Cyberpunk 2077 in 2026: The Complete Overhaul Journey & Mod Ecosystem" (Link: /articles/cyberpunk-2077-in-2026-complete-overhaul-journey, ID: 'art-2')
- Review: "Elden Ring: Shadow of the Erdtree Review — The Pinnacle of Expansion Craft" (Score: 10/10, Link: /reviews/elden-ring-shadow-of-the-erdtree-review, ID: 'rev-1')
- Review: "Helldivers 2 Review — Pure Chaotic Cooperative Brilliance" (Score: 9.0/10, Link: /reviews/helldivers-2-review, ID: 'rev-2')
- Guide: "World of Warships: Armor Angling, Penetration Mechanics & Concealment Mastery" (Link: /guides/world-of-warships-armor-angling-penetration-guide, ID: 'gui-1')
- Guide: "Elden Ring: Scadutree Fragment Route & Boss Progression Order" (Link: /guides/elden-ring-scadutree-fragment-route-boss-progression, ID: 'gui-2')
- Guide: "Helldivers 2: Super Helldive Stratagem Loadout & Galactic War Tactics" (Link: /guides/helldivers-2-super-helldive-stratagems-tactics, ID: 'gui-3')

CONNECTED YOUTUBE VIDEOS (Game Vault Channel):
- "Enjoying PUBG Mobile on a Good Morning" (11:45, ID: 'vid-pubg-morning', YouTube ID: 'O4jKXRh0HEY')
- "Elden Ring: Shadow of the Erdtree — Ultimate Deep Dive & Lore Analysis" (24:18, ID: 'vid-1', YouTube ID: 'K_03fnT8j0A')
- "Why World of Warships Is More Interesting Than I Expected — Tactical Analysis" (18:45, ID: 'vid-2', YouTube ID: 'q73K94x2P6M')
- "Cyberpunk 2077 in 2026: The Complete Overhaul Journey" (21:04, ID: 'vid-3', YouTube ID: 'UnA7tepsc7s')
- "Helldivers 2 — Galactic War Strategy & Team Mechanics Masterclass" (16:30, ID: 'vid-4', YouTube ID: 'lP_8hPq2VnQ')

PC HARDWARE & REQUIREMENTS DATABASE:
- Tools Available:
  * PC Game Requirements Checker (/tools/pc-game-requirements-checker)
  * Gaming PC Builder (/tools/gaming-pc-builder) - Supports USD ($) and NGN (₦) budgets!
  * Gaming Username Generator (/tools/gaming-username-generator)
  * Game Finder (/tools)
  * Game Comparison Tool (/tools)
- Recommended PC Component Standards:
  * Entry 1080p ($600 - $800 / ₦900k - ₦1.2M): Ryzen 5 5600 / Core i5-12400F + RX 6600 / RTX 3060 + 16GB DDR4 + 1TB NVMe + 650W Bronze
  * Sweet Spot 1440p ($1,000 - $1,400 / ₦1.5M - ₦2.1M): Ryzen 5 7600X / Core i5-13600KF + RTX 4070 Super / RX 7800 XT + 32GB DDR5-6000 + 2TB Gen4 + 750W Gold
  * High-End 4K / Enthusiast ($1,800+ / ₦2.8M+): Ryzen 7 7800X3D + RTX 4080 Super / RX 7900 XTX + 32GB/64GB DDR5 + 850W+ Gold

12-POINT LOW FPS TROUBLESHOOTING CHECKLIST:
1. Render Resolution vs Display Native (e.g. check for unintended 4K rendering or DSR/VSR)
2. Heavy Graphics Settings (Volumetric fog, ray tracing, shadow resolution, screen space reflections)
3. GPU Utilization (Is GPU pinned at 99-100% or underutilized due to CPU bottleneck?)
4. CPU Utilization & Per-Core Bottlenecks (Modern games can choke on a single maxed thread)
5. RAM Capacity & Dual-Channel Config (Check for single-channel penalty or RAM starvation)
6. VRAM Overflow (Texture quality exceeding GPU VRAM causing heavy paging to system RAM)
7. GPU/CPU Operating Temperatures (Thermal throttling when GPU exceeds 83-86°C or CPU exceeds 90-95°C)
8. Background Applications & Bloatware (Antivirus scans, browser tabs, Discord hardware acceleration overlays)
9. Display Driver State (Clean install using DDU or latest game-ready driver)
10. Windows Power Management Plan (Ensure High Performance or Balanced rather than Power Saver)
11. Storage Drive Performance (Ensure game is installed on an NVMe/SSD, check drive fill percentage >90%)
12. Thermal Throttling / Dust Build-up (Inspect heatsinks, fan curves, and airflow direction)
Always explain: "Based on what you've told me, these are the most likely causes." Never claim certainty without full hardware metrics.
`;

const SYSTEM_INSTRUCTION = `
You are Vault AI — the official AI Gaming Assistant of Game Vault Forum (www.gamevault.forum).
Tagline: "Your AI Gaming Assistant. Ask. Discover. Compare. Troubleshoot. Play smarter."

PERSONALITY & TONE:
- Helpful, knowledgeable, friendly, gaming-focused, straightforward, and objective.
- Identify yourself as: "Vault AI — the Game Vault Forum gaming assistant."
- Avoid excessive slang, hype, or emojis; avoid pretending to be a biological human.
- Provide crisp, highly readable markdown answers with headings, bullet points, and comparison tables when appropriate.

STRICT ACCURACY RULES (NO HALLUCINATIONS):
- Reference the verified Game Vault Forum knowledge base whenever applicable.
- Never invent games, reviews, benchmarks, hardware prices, or partnerships that do not exist.
- If reliable information is unavailable, clearly state: "I don't have reliable information for that yet."
- For PC hardware prices, note: "Prices fluctuate based on region and retailer; check current verified listings before purchasing."
- Refuse any request involving cheating, hacking, aimbots, account theft, or illegal piracy.

STRUCTURED METADATA TAGS:
To help the Game Vault Forum UI render interactive rich cards, you may append one or more structured tags at the bottom of your answer:
- Games: [CARD_GAME:elden-ring], [CARD_GAME:world-of-warships], [CARD_GAME:cyberpunk-2077], [CARD_GAME:helldivers-2], [CARD_GAME:pubg-mobile], [CARD_GAME:black-myth-wukong], [CARD_GAME:baldurs-gate-3], [CARD_GAME:hades-2]
- Articles/Guides: [CARD_ARTICLE:art-1], [CARD_ARTICLE:art-2], [CARD_GUIDE:gui-1], [CARD_GUIDE:gui-2], [CARD_GUIDE:gui-3], [CARD_REVIEW:rev-1], [CARD_REVIEW:rev-2]
- Videos: [CARD_VIDEO:vid-pubg-morning], [CARD_VIDEO:vid-1], [CARD_VIDEO:vid-2], [CARD_VIDEO:vid-3], [CARD_VIDEO:vid-4]
- Hardware: [CARD_HW:gpu-4070s], [CARD_HW:cpu-7800x3d], [CARD_HW:cpu-7600x], [CARD_HW:gpu-7800xt]
- Sources: [SOURCE:Game Vault Forum — World of Warships Guide|/guides/world-of-warships-armor-angling-penetration-guide]

${VAULT_KNOWLEDGE_SUMMARY}
`;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Game Vault Forum Backend',
      time: new Date().toISOString(),
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Admin status endpoint
  app.get('/api/vault-ai/admin-status', (_req, res) => {
    res.json({
      status: 'operational',
      assistantName: 'Vault AI',
      primaryModel: 'gemini-3.8-flash',
      fallbackModel: 'gemini-3.1-flash-lite',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      knowledgeBase: {
        gamesIndexed: 8,
        articlesIndexed: 7,
        videosIndexed: 5,
        hardwareComponents: 32,
        pcRequirementsIndexed: 8,
      },
      features: {
        gameRecommendations: true,
        pcBuilderIntegration: true,
        requirementsCheckerIntegration: true,
        fpsTroubleshooting: true,
        youtubeIntegration: true,
        sourceCitations: true,
      },
      limits: {
        guestDailyLimit: 20,
        registeredDailyLimit: 'unlimited',
      },
    });
  });

  // Vault AI chat endpoint
  app.post('/api/vault-ai/chat', async (req, res) => {
    const { message, history = [], context = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message string required' });
    }

    const ai = getGeminiClient();

    // Prepare contextual prompt
    let contextualPrefix = '';
    if (context.currentPage) {
      contextualPrefix += `[User is currently viewing Game Vault page: ${context.currentPage}]\n`;
    }
    if (context.selectedGame) {
      contextualPrefix += `[Context: Game '${context.selectedGame}']\n`;
    }
    if (context.userPcSpec) {
      contextualPrefix += `[User PC Specs: CPU: ${context.userPcSpec.cpu || 'N/A'}, GPU: ${context.userPcSpec.gpu || 'N/A'}, RAM: ${context.userPcSpec.ram || 'N/A'}GB, VRAM: ${context.userPcSpec.vram || 'N/A'}GB]\n`;
    }
    if (context.builderBudget) {
      contextualPrefix += `[Target PC Build Budget: ${context.builderBudget}]\n`;
    }

    const userPrompt = contextualPrefix ? `${contextualPrefix}\nUser Question: ${message}` : message;

    // Convert past history if available
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        if (item.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.content }] });
        } else if (item.role === 'assistant' || item.role === 'model') {
          contents.push({ role: 'model', parts: [{ text: item.content }] });
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    // Call Gemini with primary model, fall back if busy
    if (ai) {
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let lastError: any = null;

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
              topP: 0.9,
            },
          });

          const rawText = response.text || '';
          const parsed = extractTagsAndCleanText(rawText);

          return res.json({
            reply: parsed.cleanText,
            sources: parsed.sources,
            cardIds: parsed.cardIds,
            modelUsed: model,
          });
        } catch (err: any) {
          lastError = err;
          console.warn(`Vault AI attempt with model ${model} failed:`, err?.message || err);
          // try next model
        }
      }

      console.error('All Gemini model calls failed:', lastError);
    }

    // Fallback: Smart local knowledge response generator
    const fallbackResponse = generateLocalKnowledgeResponse(message, context);
    return res.json({
      reply: fallbackResponse.reply,
      sources: fallbackResponse.sources,
      cardIds: fallbackResponse.cardIds,
      modelUsed: 'local-knowledge-engine',
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Game Vault Forum Full-Stack Server running on port ${PORT}`);
  });
}

function extractTagsAndCleanText(raw: string) {
  const sources: Array<{ title: string; url: string }> = [];
  const cardIds: {
    games: string[];
    articles: string[];
    videos: string[];
    hardware: string[];
  } = {
    games: [],
    articles: [],
    videos: [],
    hardware: [],
  };

  let cleanText = raw;

  // Extract [SOURCE:Title|Url]
  cleanText = cleanText.replace(/\[SOURCE:([^|]+)\|([^\]]+)\]/g, (_match, title, url) => {
    sources.push({ title: title.trim(), url: url.trim() });
    return '';
  });

  // Extract [CARD_GAME:id]
  cleanText = cleanText.replace(/\[CARD_GAME:([^\]]+)\]/g, (_match, id) => {
    if (!cardIds.games.includes(id.trim())) cardIds.games.push(id.trim());
    return '';
  });

  // Extract [CARD_ARTICLE:id] or [CARD_GUIDE:id] or [CARD_REVIEW:id]
  cleanText = cleanText.replace(/\[CARD_(?:ARTICLE|GUIDE|REVIEW):([^\]]+)\]/g, (_match, id) => {
    if (!cardIds.articles.includes(id.trim())) cardIds.articles.push(id.trim());
    return '';
  });

  // Extract [CARD_VIDEO:id]
  cleanText = cleanText.replace(/\[CARD_VIDEO:([^\]]+)\]/g, (_match, id) => {
    if (!cardIds.videos.includes(id.trim())) cardIds.videos.push(id.trim());
    return '';
  });

  // Extract [CARD_HW:id]
  cleanText = cleanText.replace(/\[CARD_HW:([^\]]+)\]/g, (_match, id) => {
    if (!cardIds.hardware.includes(id.trim())) cardIds.hardware.push(id.trim());
    return '';
  });

  // Clean trailing spaces and lines
  cleanText = cleanText.trim();

  // If no explicit sources were found, infer from content
  if (sources.length === 0) {
    if (cleanText.toLowerCase().includes('world of warships')) {
      sources.push({
        title: 'Game Vault Forum — World of Warships Tactical Guide',
        url: '/guides/world-of-warships-armor-angling-penetration-guide',
      });
    }
    if (cleanText.toLowerCase().includes('elden ring')) {
      sources.push({
        title: 'Game Vault Forum — Elden Ring Expansion Review',
        url: '/reviews/elden-ring-shadow-of-the-erdtree-review',
      });
    }
    if (cleanText.toLowerCase().includes('helldivers')) {
      sources.push({
        title: 'Game Vault Forum — Helldivers 2 Stratagem Guide',
        url: '/guides/helldivers-2-super-helldive-stratagems-tactics',
      });
    }
    if (cleanText.toLowerCase().includes('pc requirements') || cleanText.toLowerCase().includes('fps')) {
      sources.push({
        title: 'Game Vault Forum — PC Game Requirements Checker',
        url: '/tools/pc-game-requirements-checker',
      });
    }
  }

  return { cleanText, sources, cardIds };
}

// Fallback response engine for local knowledge
function generateLocalKnowledgeResponse(query: string, context: any) {
  const q = query.toLowerCase();

  if (q.includes('fps') || q.includes('stutter') || q.includes('lag') || q.includes('performance')) {
    return {
      reply: `### Vault AI Performance Diagnostics

Based on what you've described, gaming performance drops and low FPS typically stem from a few primary hardware and software bottlenecks. Here is the systematic 12-point checklist to investigate:

1. **Render Resolution vs Native Display**: Ensure your game is not rendering above native (e.g. 4K DSR on a 1440p monitor).
2. **Heavy Graphics Presets**: Drop Volumetric Fog, Screen Space Reflections, and Ray Tracing one notch.
3. **GPU Utilization**: Check if GPU is pinned at 99%. If it is hovering around 50-70%, your CPU is bottlenecking the frame pacing.
4. **VRAM Overflow**: When game textures exceed your graphics card VRAM, heavy paging to system RAM causes sudden 1-second freezes.
5. **Operating Temperatures**: Use HWMonitor or MSI Afterburner to check if CPU exceeds 90°C or GPU exceeds 84°C (Thermal Throttling).
6. **Background App Interference**: Close Discord hardware acceleration, browser video tabs, or active antivirus scans.

*Tip: You can benchmark your exact hardware against game requirements in our PC Requirements Checker.*`,
      sources: [
        { title: 'Game Vault Forum — PC Game Requirements Checker', url: '/tools/pc-game-requirements-checker' },
        { title: 'Game Vault Forum — Hardware Diagnostics', url: '/tools/gaming-pc-builder' },
      ],
      cardIds: { games: [], articles: [], videos: [], hardware: ['gpu-4070s'] },
    };
  }

  if (q.includes('build') || q.includes('pc') || q.includes('gpu') || q.includes('budget') || q.includes('1000') || q.includes('1500000')) {
    return {
      reply: `### Vault AI PC Hardware Recommendation

For balanced 1080p and 1440p gaming within typical sweet-spot budgets ($1,000 - $1,400 or ₦1,500,000 - ₦2,100,000), here is our verified balanced component harmony:

- **CPU**: AMD Ryzen 5 7600X or Intel Core i5-13600KF (Excellent single-core frame times, 6-core/12-thread or hybrid architecture).
- **GPU**: NVIDIA GeForce RTX 4070 Super 12GB or AMD Radeon RX 7800 XT 16GB (Unmatched 1440p rasterization & DLSS 3.5 / FSR 3 support).
- **Motherboard**: B650 AM5 Socket (Supports future Zen 5 CPU upgrades).
- **RAM**: 32GB DDR5-6000 CL30 Dual-Channel.
- **Storage**: 2TB NVMe PCIe 4.0 SSD (7,000+ MB/s read speed).
- **Power Supply**: 750W 80+ Gold certified modular unit.

You can inspect the complete component list and verify 10-point socket compatibility directly in our Gaming PC Builder tool below.`,
      sources: [
        { title: 'Game Vault Forum — Gaming PC Builder', url: '/tools/gaming-pc-builder' },
      ],
      cardIds: { games: [], articles: [], videos: [], hardware: ['cpu-7600x', 'gpu-4070s'] },
    };
  }

  if (q.includes('world of warships') || q.includes('warships')) {
    return {
      reply: `### World of Warships Analysis & Tactical Insights

World of Warships is a deep naval tactical strategy and simulation title featured extensively on the Game Vault platform.

**Key Mechanics to Master:**
- **Armor Angling**: Angling your bow 15–30 degrees dramatically increases the effective armor thickness against incoming AP (Armor Piercing) shells, causing deflections.
- **Concealment Management**: Turn off anti-air guns when attempting to disengage from smoke screen cover.
- **Citadel Targeting**: Aim at the waterline beneath smoke funnels and main turrets for maximum kinetic damage.

Check out our full tactical guide and video breakdown below!`,
      sources: [
        { title: 'Game Vault Forum — World of Warships Armor & Gunnery Guide', url: '/guides/world-of-warships-armor-angling-penetration-guide' },
        { title: 'Game Vault Forum — Why World of Warships Is More Interesting Than Expected', url: '/articles/why-world-of-warships-is-more-interesting-than-i-expected' },
      ],
      cardIds: {
        games: ['world-of-warships'],
        articles: ['art-1'],
        videos: ['vid-2'],
        hardware: [],
      },
    };
  }

  // General recommendation
  return {
    reply: `### Vault AI Gaming Recommendation

Welcome to Vault AI! Based on Game Vault Forum's verified gaming library, here are top recommendations tailored across gaming tastes:

- **Elden Ring & Shadow of the Erdtree** (RPG / Soulsborne, Score: 9.8/10) — The definitive dark fantasy open-world adventure.
- **Helldivers 2** (Co-op PvE Shooter, Score: 9.0/10) — High-octane squad strategy and planetary liberation missions.
- **Cyberpunk 2077** (Action RPG / Sci-Fi, Score: 9.2/10) — Night City fully revitalized with patch 2.1 and Phantom Liberty.
- **World of Warships** (Tactical Naval Action, Score: 8.9/10) — Deep positioning, ballistic calculations, and fleet warfare.

Would you like me to compare any of these titles, check if your PC can run them, or build an optimized gaming rig for your budget?`,
    sources: [
      { title: 'Game Vault Forum — Games Catalog', url: '/games' },
      { title: 'Game Vault Forum — PC Requirements Checker', url: '/tools/pc-game-requirements-checker' },
    ],
    cardIds: {
      games: ['elden-ring', 'helldivers-2', 'cyberpunk-2077', 'world-of-warships'],
      articles: ['art-1', 'art-2'],
      videos: ['vid-1'],
      hardware: [],
    },
  };
}

startServer();
