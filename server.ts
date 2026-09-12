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
Tagline: "Your Vault for Everything Gaming. Watch. Play. Discuss. Discover."
Founder: Joel Ayuba
Official YouTube Channel: @GameVaultForum

SITE STRUCTURE & NAVIGATION DIRECTORY:
1. Home (/) — Featured showcase, trending gameplay videos, editor's choice reviews, tactical guides, community spotlight, and quick tool access.
2. Videos (/videos) — Official Game Vault YouTube video catalog with embedded player, high-res thumbnails, duration, category badges, and comments.
3. Articles (/articles) — Editorial essays, gaming culture analysis, industry trends, modding ecosystems, and game design deep-dives.
4. Reviews (/reviews) — Scored reviews (e.g. 10/10, 9.2/10) with pros & cons, performance verdicts, graphics analysis, and platform breakdowns.
5. Guides (/guides) — Tactical masterclasses (e.g. World of Warships armor angling, Elden Ring Scadutree routes, Helldivers 2 Super Helldive loadouts).
6. Games Catalog (/games) — Verified database of games with specs, trailers, community ratings, developer/publisher info, release dates, and hardware requirements.
7. Forum (/forum) — Community discussion hub with categories:
   - General Gaming: Broad gaming news, discussions, game announcements, industry talk.
   - PC Building & Tech: Hardware recommendations, rig builds, bottleneck fixes, overclocking, troubleshooting.
   - Game Guides & Strategies: Walkthroughs, boss battle tactics, optimal character builds, fleet maneuvers.
   - Competitive Gaming & Esports: Tournaments, meta strategies, ranked climbs, weapon tier lists.
   - Off-Topic Vault: Chill gamer chatter, setups, gaming gear, anime, general discussion.
   - New Topic Creation: (/forum/new) — Create rich discussion topics with formatting, tags, and category selection.
8. Tools Hub (/tools) — 3 Core Interactive Gaming Tools:
   - PC Game Requirements Checker (/tools/pc-game-requirements-checker): Test user CPU, GPU, RAM, and VRAM against verified minimum & recommended requirements for any game with pass/warn/fail indicators.
   - Gaming PC Builder (/tools/gaming-pc-builder): Interactive custom rig builder with 10-point socket compatibility verification (AM4, AM5, LGA1700, LGA1851), PSU wattage calculator, balance score gauge, and dual currency (USD $ and Nigerian Naira ₦).
   - Gaming Username Generator (/tools/gaming-username-generator): Instant distinctive gamertag generator across styles (Cyberpunk, Tactical, Mythic, Anime, Stealth, Pro Esports) with prefix/suffix customizers and copy-to-clipboard.
   - Vault AI Assistant (/tools/vault-ai): Intelligent AI Copilot for gaming Q&A, hardware advice, performance troubleshooting, and site navigation.
9. Community & Policy Pages:
   - About (/about): Information on founder Joel Ayuba, mission, YouTube channel links, and platform vision.
   - Contact (/contact): Direct contact form for inquiries, feedback, partnerships, and bug reports.
   - Community Guidelines (/guidelines): Rules for respectful engagement, anti-toxicity, anti-cheating, and constructive discussions.
   - Terms of Service (/terms), Privacy Policy (/privacy), Cookie Policy (/cookies), Sitemap (/sitemap).

VISITOR (GUEST) VS. REGISTERED MEMBER (USER) ARCHITECTURE:
- Visitors (Guests):
  * Can freely browse all games, watch videos, read guides, read reviews, inspect forum threads, and use all 3 interactive tools without registering.
  * Can ask Vault AI up to 20 queries per day.
  * CANNOT: Post new forum topics, post comments on articles/videos, like or bookmark content, or save custom profiles.
  * How to join: Click "Join Forum" or "Sign In" at the top header or use [ACTION:auth|Create Free Account / Sign In|open]. Registration is 100% free with email or Google sign-in.
- Registered Members (Users):
  * Unlocked features: Create forum topics (/forum/new), reply and comment on discussions, like articles/videos/topics, bookmark items to their private profile, earn reputation badges, and get unlimited Vault AI queries with synchronized conversation history.
  * Vault AI assists members with personalized greetings, topic drafting, custom hardware matching, and saved build recommendations.

GAMES CATALOG (Verified in Game Vault Database):
1. Elden Ring (ID: 'elden-ring', Genre: RPG/Action/Soulsborne, Platforms: PC, PS5, Xbox Series X/S, Developer: FromSoftware, Rating: 9.8/10, Link: /games/elden-ring)
   - Expansions: Shadow of the Erdtree. Open-world Soulsborne masterpiece, challenging boss design, Scadutree blessings.
2. World of Warships (ID: 'world-of-warships', Genre: Strategy/Simulation/Tactical Naval, Platforms: PC, Developer: Wargaming, Rating: 8.9/10, Link: /games/world-of-warships)
   - Key mechanics: Armor angling (15-30 deg bow bounce), concealment mechanics, citadel penetrations, tactical fleet positioning, destroyer smokescreens.
3. Cyberpunk 2077 (ID: 'cyberpunk-2077', Genre: RPG/Action/Open World, Platforms: PC, PS5, Xbox Series X/S, Developer: CD Projekt RED, Rating: 9.2/10, Link: /games/cyberpunk-2077)
   - Patch 2.1 overhaul, Phantom Liberty DLC, Ray Tracing Overdrive, Dogtown vertical combat, Cyberware capacity system.
4. Helldivers 2 (ID: 'helldivers-2', Genre: Action/Multiplayer/Co-op PvE, Platforms: PC, PS5, Developer: Arrowhead, Rating: 9.0/10, Link: /games/helldivers-2)
   - 4-player squad co-op, Galactic War liberation map, stratagem management, friendly fire, Automaton and Terminid fronts.
5. PUBG Mobile (ID: 'pubg-mobile', Genre: Battle Royale/Multiplayer/Action, Platforms: Mobile/PC Emulator, Developer: Krafton/Tencent, Rating: 8.5/10, Link: /games/pubg-mobile)
   - 100-player drops, Erangel/Miramar rotations, circle positioning, squad tactical comms, gyro aiming.
6. Black Myth: Wukong (ID: 'black-myth-wukong', Genre: Action/RPG, Platforms: PC, PS5, Developer: Game Science, Rating: 9.1/10, Link: /games/black-myth-wukong)
   - Journey to the West lore, staff combat stances (Smash, Pillar, Thrust), spell transformations, mythic boss encounters.
7. Baldur's Gate 3 (ID: 'baldurs-gate-3', Genre: RPG/Strategy, Platforms: PC, PS5, Xbox, Developer: Larian Studios, Rating: 9.9/10, Link: /games/baldurs-gate-3)
   - Turn-based D&D 5e mechanics, massive branching narrative, co-op multiplayer, companion quests, Honor Mode.
8. Hades II (ID: 'hades-2', Genre: Action/Roguelike, Platforms: PC, Developer: Supergiant Games, Rating: 9.4/10, Link: /games/hades-2)
   - Melinoë, underworld witchcraft, Olympian boons, high replayability.

PUBLISHED ARTICLES, REVIEWS & GUIDES:
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

RECOMMENDED PC COMPONENT TIERS:
- Entry 1080p ($600 - $800 / ₦900k - ₦1.2M): Ryzen 5 5600 / Core i5-12400F + RX 6600 / RTX 3060 + 16GB DDR4 + 1TB NVMe + 650W Bronze
- Sweet Spot 1440p ($1,000 - $1,400 / ₦1.5M - ₦2.1M): Ryzen 5 7600X / Core i5-13600KF + RTX 4070 Super / RX 7800 XT + 32GB DDR5-6000 + 2TB Gen4 + 750W Gold
- High-End 4K / Enthusiast ($1,800+ / ₦2.8M+): Ryzen 7 7800X3D + RTX 4080 Super / RX 7900 XTX + 32GB/64GB DDR5 + 850W+ Gold

12-POINT LOW FPS TROUBLESHOOTING CHECKLIST:
1. Render Resolution vs Display Native (check for unintended 4K rendering or DSR/VSR)
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
`;

const SYSTEM_INSTRUCTION = `
You are Vault AI — the official AI Gaming Assistant & Website Copilot of Game Vault Forum (www.gamevault.forum).
Tagline: "Your AI Gaming Assistant. Ask. Discover. Compare. Troubleshoot. Play smarter."

PERSONALITY & IDENTITY:
- You are helpful, knowledgeable, friendly, gaming-focused, objective, and deeply familiar with every section of Game Vault Forum.
- Identify yourself as: "Vault AI — the Game Vault Forum gaming assistant."
- Speak with professional composure; avoid excessive slang, hype, or artificial emojis.
- Deliver structured, readable markdown with bold text, bullet points, and code/table formatting where helpful.

USER VS. VISITOR ADAPTATION:
- VISITOR MODE (Guest / Unregistered):
  * Be warm, welcoming, and hospitable.
  * Help visitors navigate the website, discover games, watch videos, read guides, and explore our 3 interactive tools (PC Requirements, PC Builder, Username Generator).
  * If a visitor asks how to participate in discussions, save builds, or get unlimited AI queries, explain the benefits of joining Game Vault Forum (free account, 10-second setup, unlocks forum posting, comments, bookmarks, reputation, and unlimited Vault AI access) and provide the [ACTION:auth|Join Game Vault Forum (Free)|open] action button.
- REGISTERED MEMBER MODE (Logged In / User):
  * Greet them by name when provided (e.g., "Welcome back, Joel!").
  * Assist them with drafting high-quality forum topics, sharing PC builds, comparing game specs, and finding strategic guides.
  * Provide direct forum drafting actions like [ACTION:topic|Draft Topic on Forum|/forum/new].

STRICT ACCURACY RULES:
- Ground your answers in the Game Vault Forum knowledge base.
- Never hallucinate nonexistent tools, fake hardware prices, or nonexistent staff.
- Mention hardware price volatility: "Prices fluctuate based on region and retailer; check current verified listings before purchasing."
- Refuse any request involving cheating, hacking, aimbots, or piracy.

STRUCTURED METADATA TAGS:
You can append interactive cards to your response:
- Games: [CARD_GAME:elden-ring], [CARD_GAME:world-of-warships], [CARD_GAME:cyberpunk-2077], [CARD_GAME:helldivers-2], [CARD_GAME:pubg-mobile], [CARD_GAME:black-myth-wukong], [CARD_GAME:baldurs-gate-3], [CARD_GAME:hades-2]
- Articles/Guides: [CARD_ARTICLE:art-1], [CARD_ARTICLE:art-2], [CARD_GUIDE:gui-1], [CARD_GUIDE:gui-2], [CARD_GUIDE:gui-3], [CARD_REVIEW:rev-1], [CARD_REVIEW:rev-2]
- Videos: [CARD_VIDEO:vid-pubg-morning], [CARD_VIDEO:vid-1], [CARD_VIDEO:vid-2], [CARD_VIDEO:vid-3], [CARD_VIDEO:vid-4]
- Hardware: [CARD_HW:gpu-4070s], [CARD_HW:cpu-7800x3d], [CARD_HW:cpu-7600x], [CARD_HW:gpu-7800xt]
- Sources: [SOURCE:Game Vault Forum — World of Warships Guide|/guides/world-of-warships-armor-angling-penetration-guide]

ASSISTIVE ACTIONS:
Always include 1-3 actionable buttons at the bottom:
- [ACTION:navigate|Label|/url_path]
- [ACTION:requirements|Check Specs for Game|game_id]
- [ACTION:topic|Draft Topic on Forum|/forum/new]
- [ACTION:auth|Create Free Account / Sign In|open]
- [ACTION:video|Watch Video|video_id]
- [ACTION:search|Search Forum|query]

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

  // Vault AI chat handler
  const handleVaultAiChat = async (req: express.Request, res: express.Response) => {
    const { message, history = [], context = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message string required' });
    }

    const ai = getGeminiClient();

    // Prepare contextual prompt
    let contextualPrefix = '';
    if (context.isGuest || !context.isSignedIn) {
      contextualPrefix += `[User Session: Unregistered Guest / Visitor]\n`;
    } else if (context.userName) {
      contextualPrefix += `[User Session: Registered Member: ${context.userName}]\n`;
    }
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

    // Call Gemini with primary model, fall back if busy or timed out
    if (ai) {
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let lastError: any = null;

      for (const model of modelsToTry) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout waiting for ${model}`)), 6000)
          );

          const generatePromise = ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
              topP: 0.9,
            },
          });

          const response = await Promise.race([generatePromise, timeoutPromise]);

          const rawText = response.text || '';
          const parsed = extractTagsAndCleanText(rawText);

          return res.json({
            reply: parsed.cleanText,
            sources: parsed.sources,
            cardIds: parsed.cardIds,
            actions: parsed.actions,
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
      actions: fallbackResponse.actions || [],
      modelUsed: 'local-knowledge-engine',
    });
  };

  app.post('/api/vault-ai/chat', handleVaultAiChat);
  app.post('/api/vault-ai', handleVaultAiChat);

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
  const actions: Array<{ id: string; type: string; label: string; target: string }> = [];

  let cleanText = raw;

  // Extract [ACTION:type|label|target]
  cleanText = cleanText.replace(/\[ACTION:([^|]+)\|([^|]+)\|([^\]]+)\]/g, (_match, type, label, target) => {
    actions.push({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: type.trim(),
      label: label.trim(),
      target: target.trim(),
    });
    return '';
  });

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

  // If no actions were returned, infer intelligent default assistive actions
  if (actions.length === 0) {
    if (cleanText.toLowerCase().includes('fps') || cleanText.toLowerCase().includes('stutter') || cleanText.toLowerCase().includes('requirement')) {
      actions.push(
        { id: 'act-auto-req', type: 'requirements', label: 'Check PC Game Specs', target: 'cyberpunk-2077' },
        { id: 'act-auto-build', type: 'navigate', label: 'Open PC Builder', target: '/tools/gaming-pc-builder' }
      );
    } else if (cleanText.toLowerCase().includes('world of warships')) {
      actions.push(
        { id: 'act-auto-guide', type: 'navigate', label: 'Open Tactical Guide', target: '/guides/world-of-warships-armor-angling-penetration-guide' },
        { id: 'act-auto-req', type: 'requirements', label: 'Check WoWS Requirements', target: 'world-of-warships' }
      );
    } else if (cleanText.toLowerCase().includes('build') || cleanText.toLowerCase().includes('hardware')) {
      actions.push(
        { id: 'act-auto-builder', type: 'navigate', label: 'Open Gaming PC Builder', target: '/tools/gaming-pc-builder' }
      );
    }
  }

  return { cleanText, sources, cardIds, actions };
}

// Fallback response engine for local knowledge
function generateLocalKnowledgeResponse(query: string, context: any = {}) {
  const q = query.toLowerCase().trim();
  const isVisitor = context.isGuest || !context.isSignedIn;
  const memberGreeting = context.userName ? `Hello, **${context.userName}**! ` : '';

  // 1. Website identity, Mission, Founder, Visitor vs Member Guide
  if (
    q.includes('what is') ||
    q.includes('about') ||
    q.includes('who created') ||
    q.includes('who founded') ||
    q.includes('joel') ||
    q.includes('website') ||
    q.includes('sitemap') ||
    q.includes('overview') ||
    q.includes('help')
  ) {
    if (q.includes('who created') || q.includes('who founded') || q.includes('joel')) {
      return {
        reply: `### About Game Vault Forum & Founder

**Game Vault Forum** was founded by **Joel Ayuba** as a dedicated gaming media hub and community platform for gamers around the world.

- **Tagline**: *"Your Vault for Everything Gaming. Watch. Play. Discuss. Discover."*
- **Official Channel**: YouTube [@GameVaultForum](https://www.youtube.com/@GameVaultForum)
- **Core Mission**: Delivering deep gameplay breakdowns, rigorous hardware guides, interactive PC tools, and a welcoming forum free of toxicity.

You can read our full mission and background on the [About Game Vault Forum](/about) page.`,
        sources: [
          { title: 'Game Vault Forum — About Joel Ayuba & Mission', url: '/about' },
          { title: 'Game Vault Forum — Community Guidelines', url: '/guidelines' },
        ],
        cardIds: { games: [], articles: [], videos: ['vid-1', 'vid-pubg-morning'], hardware: [] },
        actions: [
          { id: 'act-ab-1', type: 'navigate', label: 'Visit About Page', target: '/about' },
          { id: 'act-ab-2', type: 'navigate', label: 'Browse Forum', target: '/forum' },
          { id: 'act-ab-3', type: 'navigate', label: 'Explore Interactive Tools', target: '/tools' },
        ],
      };
    }

    return {
      reply: `### Welcome to Game Vault Forum (www.gamevault.forum)

Game Vault Forum is your complete vault for video gaming media, tactical guides, hardware benchmarks, and community discussions.

#### What You Can Explore:
- **[Games Catalog](/games)**: Verified specs, ratings, trailers, and minimum/recommended requirements.
- **[Gameplay Videos](/videos)**: Official Game Vault YouTube channel videos with embedded 4K player.
- **[Tactical Guides](/guides)**: Masterclasses for World of Warships, Elden Ring, and Helldivers 2.
- **[Editorial Reviews & Articles](/reviews)**: Scored reviews with pros/cons, plus gaming essays.
- **[Community Forum](/forum)**: 5 active discussion boards for PC Tech, Guides, Esports, and General Gaming.
- **[Interactive Tools Hub](/tools)**:
  1. *PC Game Requirements Checker* — Test your CPU/GPU against verified game specs.
  2. *Gaming PC Builder* — Interactive component picker with 10-point socket compatibility & dual-currency ($/₦).
  3. *Gaming Username Generator* — Generate unique gamertags across 6 aesthetic styles.

${
  isVisitor
    ? `> **Visitor Information**: As a visitor/guest, you can freely browse all games, watch videos, read guides, and use all tools. To create forum topics, comment, like, and unlock unlimited Vault AI access, join for free!`
    : `> **Member Status**: You are recognized as an active Game Vault member! You have unlimited Vault AI queries and full forum posting privileges.`
}`,
      sources: [
        { title: 'Game Vault Forum — Tools Hub', url: '/tools' },
        { title: 'Game Vault Forum — Games Directory', url: '/games' },
        { title: 'Game Vault Forum — Community Guidelines', url: '/guidelines' },
      ],
      cardIds: { games: ['elden-ring', 'cyberpunk-2077', 'world-of-warships'], articles: ['art-1'], videos: ['vid-1'], hardware: [] },
      actions: isVisitor
        ? [
            { id: 'act-ov-auth', type: 'auth', label: 'Join Free / Sign In', target: 'open' },
            { id: 'act-ov-tools', type: 'navigate', label: 'Open Tools Hub', target: '/tools' },
            { id: 'act-ov-forum', type: 'navigate', label: 'Browse Community Forum', target: '/forum' },
          ]
        : [
            { id: 'act-ov-forum', type: 'navigate', label: 'Go to Forum', target: '/forum' },
            { id: 'act-ov-topic', type: 'topic', label: 'Draft New Discussion', target: '/forum/new' },
            { id: 'act-ov-tools', type: 'navigate', label: 'Open Tools Hub', target: '/tools' },
          ],
    };
  }

  // 2. Visitor / Account / Register / Sign Up Questions
  if (
    q.includes('register') ||
    q.includes('sign up') ||
    q.includes('sign in') ||
    q.includes('account') ||
    q.includes('login') ||
    q.includes('join') ||
    q.includes('guest') ||
    q.includes('visitor') ||
    q.includes('benefit')
  ) {
    return {
      reply: `### ${memberGreeting}Game Vault Forum: Visitor vs. Member Guide

#### For Visitors (Guests):
- **What You Can Do**: Freely browse all game pages, read every review, watch official YouTube videos, study tactical guides, and use all 3 interactive tools (PC Requirements, PC Builder, Username Generator).
- **Vault AI Usage**: Guests receive **20 free queries per day**.

#### Why Create a Free Member Account?
1. **Forum Participation**: Post new discussion topics (\`/forum/new\`) and reply to community threads.
2. **Post Comments & Likes**: Comment on articles, guides, and videos, and like community posts.
3. **Private Bookmarking**: Save your favorite games, videos, and guides directly to your gamer profile.
4. **Custom Gamer Profile**: Customize your handle, avatar, bio, and earn reputation badges.
5. **Unlimited Vault AI Access**: No daily limits and continuous saved conversation history across devices.

Registration takes 10 seconds with email/password or instant Google Sign-In. It is 100% free!`,
      sources: [
        { title: 'Game Vault Forum — Community Guidelines', url: '/guidelines' },
        { title: 'Game Vault Forum — Terms of Service', url: '/terms' },
      ],
      cardIds: { games: [], articles: [], videos: [], hardware: [] },
      actions: [
        { id: 'act-auth-1', type: 'auth', label: 'Join Game Vault Forum (Free)', target: 'open' },
        { id: 'act-auth-2', type: 'navigate', label: 'Read Community Guidelines', target: '/guidelines' },
        { id: 'act-auth-3', type: 'navigate', label: 'Browse Active Discussions', target: '/forum' },
      ],
    };
  }

  // 3. Forum Topics, Posting, and Community Discussions
  if (
    q.includes('forum') ||
    q.includes('topic') ||
    q.includes('draft') ||
    q.includes('post') ||
    q.includes('thread') ||
    q.includes('community')
  ) {
    return {
      reply: `### ${memberGreeting}Game Vault Community Forum

The Game Vault Forum is organized into 5 dedicated boards:

1. **General Gaming**: Game announcements, industry discussions, cross-platform gaming, and news.
2. **PC Building & Tech**: Rig builds, component compatibility, thermal issues, and GPU/CPU upgrade paths.
3. **Game Guides & Strategies**: In-depth boss walkthroughs, loadouts, and tactical advice.
4. **Competitive Gaming & Esports**: Ranked tier lists, tournament updates, and meta analysis.
5. **Off-Topic Vault**: Gamer gear setups, anime, gaming peripherals, and casual chat.

#### Tips for Drafting an Engaging Topic:
- Use a clear, descriptive title (e.g. *"Is the RTX 4070 Super worth upgrading to from an RTX 2060 in 2026?"*).
- Tag your post with 2–4 relevant tags (e.g. \`#Hardware\`, \`#UpgradeAdvice\`, \`#PCGaming\`).
- Provide system specs or context so other operatives can give actionable answers.

${isVisitor ? `*Note: Guests can read all topics. To create a new topic or reply, please sign in or register below.*` : `*You have full permissions to start topics anytime!*`}`,
      sources: [
        { title: 'Game Vault Forum — Discussion Boards', url: '/forum' },
        { title: 'Game Vault Forum — Community Guidelines', url: '/guidelines' },
      ],
      cardIds: { games: [], articles: [], videos: [], hardware: [] },
      actions: isVisitor
        ? [
            { id: 'act-f-auth', type: 'auth', label: 'Sign In to Post Topics', target: 'open' },
            { id: 'act-f-browse', type: 'navigate', label: 'Browse Forum Topics', target: '/forum' },
          ]
        : [
            { id: 'act-f-new', type: 'topic', label: 'Draft New Forum Topic', target: '/forum/new' },
            { id: 'act-f-browse', type: 'navigate', label: 'Browse Forum Boards', target: '/forum' },
          ],
    };
  }

  // 4. Tools Hub & Interactive Tools
  if (
    q.includes('tool') ||
    q.includes('generator') ||
    q.includes('username') ||
    q.includes('tag') ||
    q.includes('gamertag')
  ) {
    if (q.includes('username') || q.includes('generator') || q.includes('gamertag') || q.includes('tag')) {
      return {
        reply: `### ${memberGreeting}Gaming Username Generator

Our [Gaming Username Generator](/tools/gaming-username-generator) crafts distinctive, high-impact gamertags across 6 tailored aesthetics:

- **Cyberpunk / Sci-Fi**: NeonViper, GlitchSpecter, CyberPulse, NeuroPhantom
- **Tactical / Military**: ApexVanguard, GhostRecon, BravoStrike, IronTrigger
- **Mythic / Dark Fantasy**: ShadowRune, VoidWalker, EldenKnight, EclipseReaper
- **Anime / Japanese**: ShinobiShadow, RoninZero, KageStorm, KitsuneStrike
- **Stealth / Rogue**: SilentDagger, WraithShade, PhantomEcho, VelvetBlade
- **Pro Esports**: Veloce, Zenyt, Axiom, Prodigy, Reflex

#### Features:
- Custom prefix/suffix modifiers
- Number styling (Year, Tactical 007, Leet Speak)
- One-click copy to clipboard`,
        sources: [{ title: 'Game Vault Forum — Gaming Username Generator', url: '/tools/gaming-username-generator' }],
        cardIds: { games: [], articles: [], videos: [], hardware: [] },
        actions: [
          { id: 'act-tag-1', type: 'navigate', label: 'Launch Username Generator', target: '/tools/gaming-username-generator' },
          { id: 'act-tag-2', type: 'navigate', label: 'Browse All Tools', target: '/tools' },
        ],
      };
    }

    return {
      reply: `### ${memberGreeting}Game Vault Forum Interactive Tools Hub

We offer 3 core interactive utilities designed specifically for PC and console gamers:

1. **[PC Game Requirements Checker](/tools/pc-game-requirements-checker)**:
   - Select any game from our verified database (Cyberpunk 2077, Elden Ring, Helldivers 2, World of Warships, etc.).
   - Input your CPU, GPU, RAM, and VRAM.
   - Get an instant Pass / Warn / Fail verdict with upgrade recommendations.

2. **[Gaming PC Builder](/tools/gaming-pc-builder)**:
   - Configure a custom rig with 10-point socket compatibility (AM4, AM5, LGA1700, LGA1851).
   - Real-time PSU wattage calculation with safe overhead.
   - Balance score gauge (detects CPU/GPU bottlenecks).
   - Dual-currency pricing in US Dollars ($) and Nigerian Naira (₦).

3. **[Gaming Username Generator](/tools/gaming-username-generator)**:
   - Generate creative gamertags across Cyberpunk, Tactical, Mythic, Anime, Stealth, and Pro Esports styles with clipboard copy.`,
      sources: [{ title: 'Game Vault Forum — Tools Hub', url: '/tools' }],
      cardIds: { games: ['cyberpunk-2077', 'elden-ring'], articles: [], videos: [], hardware: ['gpu-4070s'] },
      actions: [
        { id: 'act-tl-req', type: 'requirements', label: 'PC Requirements Checker', target: 'cyberpunk-2077' },
        { id: 'act-tl-bld', type: 'navigate', label: 'Launch Gaming PC Builder', target: '/tools/gaming-pc-builder' },
        { id: 'act-tl-tag', type: 'navigate', label: 'Username Generator', target: '/tools/gaming-username-generator' },
      ],
    };
  }

  // 5. FPS / Stutter / Lag / Troubleshooting
  if (q.includes('fps') || q.includes('stutter') || q.includes('lag') || q.includes('performance') || q.includes('troubleshoot')) {
    return {
      reply: `### ${memberGreeting}Vault AI 12-Point Performance Diagnostics

Gaming frame drops and micro-stutters generally result from hardware bottlenecks, memory overflow, or driver conflicts. Here is our systematic 12-point diagnostic checklist:

1. **Render Resolution vs Native Display**: Verify your game isn't rendering at 4K DSR/VSR on a 1080p/1440p monitor.
2. **Heavy Graphics Presets**: Drop Volumetric Clouds/Fog, Screen Space Reflections, and Ray Tracing to High or Medium.
3. **GPU Utilization**: Check if GPU is pinned at 99-100%. If GPU usage drops to 60-70% while FPS drops, your CPU is bottlenecking the thread pacing.
4. **VRAM Overflow**: When textures exceed physical GPU VRAM (e.g. 8GB cards in modern titles), textures page to system RAM, causing sudden 1-second freezes.
5. **RAM Speed & Dual-Channel**: Ensure XMP/EXPO is enabled in BIOS and RAM is installed in slots 2 and 4.
6. **Operating Temperatures**: CPU exceeding 90°C or GPU exceeding 84°C triggers thermal throttling.
7. **Background Applications**: Disable Discord hardware acceleration, close browser video tabs, and pause antivirus scans.
8. **Storage Performance**: Ensure modern AAA games are installed on an NVMe SSD, not an older mechanical HDD.
9. **Display Drivers**: Clean install GPU drivers using DDU (Display Driver Uninstaller).
10. **Windows Power Plan**: Switch to "Balanced" or "High Performance" to avoid low core clocks.
11. **Shader Compilation**: Modern DirectX 12 games require shaders to compile; allow initial shader caching to finish.
12. **Fan Curves & Airflow**: Clean dust from radiator and GPU heatsink fins.`,
      sources: [
        { title: 'Game Vault Forum — PC Game Requirements Checker', url: '/tools/pc-game-requirements-checker' },
        { title: 'Game Vault Forum — Gaming PC Builder', url: '/tools/gaming-pc-builder' },
      ],
      cardIds: { games: ['cyberpunk-2077'], articles: [], videos: [], hardware: ['gpu-4070s'] },
      actions: [
        { id: 'act-perf-1', type: 'requirements', label: 'Check Game Specs', target: 'cyberpunk-2077' },
        { id: 'act-perf-2', type: 'navigate', label: 'Configure Upgrade in PC Builder', target: '/tools/gaming-pc-builder' },
        { id: 'act-perf-3', type: 'search', label: 'Search Forum: "Micro-Stutter"', target: 'micro stutter' },
      ],
    };
  }

  // 6. PC Build / Hardware / Budget Questions
  if (
    q.includes('build') ||
    q.includes('pc') ||
    q.includes('hardware') ||
    q.includes('gpu') ||
    q.includes('cpu') ||
    q.includes('budget') ||
    q.includes('rtx') ||
    q.includes('ryzen') ||
    q.includes('intel') ||
    q.includes('naira') ||
    q.includes('₦') ||
    q.includes('dollar') ||
    q.includes('$')
  ) {
    return {
      reply: `### ${memberGreeting}Vault AI Recommended PC Configurations

Here are our recommended hardware tiers balanced for optimal price-to-performance without bottlenecks:

| Tier | Budget (USD) | Budget (NGN ₦) | Recommended CPU | Recommended GPU | RAM & Storage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Entry 1080p** | $600 – $800 | ₦900k – ₦1.2M | Ryzen 5 5600 / i5-12400F | RX 6600 8GB / RTX 3060 12GB | 16GB DDR4 + 1TB NVMe |
| **Sweet Spot 1440p** | $1,000 – $1,400 | ₦1.5M – ₦2.1M | Ryzen 5 7600X / i5-13600KF | RTX 4070 Super 12GB / RX 7800 XT 16GB | 32GB DDR5-6000 + 2TB Gen4 |
| **Enthusiast 4K** | $1,800+ | ₦2.8M+ | Ryzen 7 7800X3D | RTX 4080 Super 16GB / RX 7900 XTX | 32GB/64GB DDR5 + 2TB+ Gen4 |

*Note: Prices fluctuate based on region, taxes, and retailers. Always verify current prices before purchasing.*

Use our **Gaming PC Builder** to test component combinations, estimate power supply wattage, and check socket compatibility.`,
      sources: [{ title: 'Game Vault Forum — Gaming PC Builder', url: '/tools/gaming-pc-builder' }],
      cardIds: { games: [], articles: [], videos: [], hardware: ['cpu-7600x', 'gpu-4070s', 'cpu-7800x3d', 'gpu-7800xt'] },
      actions: [
        { id: 'act-bld-1', type: 'navigate', label: 'Open Gaming PC Builder ($1,200 Rig)', target: '/tools/gaming-pc-builder' },
        { id: 'act-bld-2', type: 'requirements', label: 'Test Rig Against Cyberpunk 2077', target: 'cyberpunk-2077' },
        { id: 'act-bld-3', type: 'topic', label: 'Ask PC Building Board', target: '/forum/new' },
      ],
    };
  }

  // 7. World of Warships
  if (q.includes('world of warships') || q.includes('warships') || q.includes('naval') || q.includes('battleship')) {
    return {
      reply: `### ${memberGreeting}World of Warships Tactical Guide & Deep Dive

World of Warships is an intricate tactical naval strategy title covered extensively across Game Vault Forum.

#### Key Mechanics to Master:
- **Armor Angling**: Angling your ship 15°–30° towards enemy salvos dramatically increases the effective armor thickness, bouncing AP (Armor Piercing) shells off your bow.
- **Citadel Targeting**: Target the waterline directly beneath smoke stacks and main gun turrets for maximum kinetic penetration.
- **Concealment & Smoke Screens**: Disable anti-air guns (\`P\` key) when attempting to disengage from smoke cover to remain undetected.
- **Torpedo Spread Management**: Use narrow spreads against single targets and wide spreads when area-denying chokepoints.`,
      sources: [
        { title: 'Game Vault Forum — World of Warships Armor & Gunnery Guide', url: '/guides/world-of-warships-armor-angling-penetration-guide' },
        { title: 'Game Vault Forum — Why World of Warships Is More Interesting Than Expected', url: '/articles/why-world-of-warships-is-more-interesting-than-i-expected' },
      ],
      cardIds: { games: ['world-of-warships'], articles: ['art-1', 'gui-1'], videos: ['vid-2'], hardware: [] },
      actions: [
        { id: 'act-wows-1', type: 'navigate', label: 'Read Armor Angling Guide', target: '/guides/world-of-warships-armor-angling-penetration-guide' },
        { id: 'act-wows-2', type: 'video', label: 'Watch Tactical Breakdown Video', target: 'vid-2' },
        { id: 'act-wows-3', type: 'requirements', label: 'Check WoWS PC Specs', target: 'world-of-warships' },
      ],
    };
  }

  // 8. Elden Ring / Shadow of the Erdtree
  if (q.includes('elden ring') || q.includes('shadow of the erdtree') || q.includes('fromsoftware') || q.includes('soulsborne') || q.includes('scadutree')) {
    return {
      reply: `### ${memberGreeting}Elden Ring & Shadow of the Erdtree Coverage

Elden Ring holds a **10/10 rating** on Game Vault Forum.

#### Shadow of the Erdtree Survival Guide:
- **Scadutree Fragments**: Collecting Scadutree Blessings is essential in the Realm of Shadow. They provide flat percentage increases to damage dealt and damage negation that scale independently of standard character level.
- **Revered Spirit Ash**: Upgrades the resilience and attack power of your spirit ashes and spectral steed.
- **Boss Progression**: Start in Gravesite Plain, explore Belurat, proceed through Castle Ensis to Scadu Altus, and explore the Shadow Keep before venturing into late-game areas.`,
      sources: [
        { title: 'Game Vault Forum — Shadow of the Erdtree Review (10/10)', url: '/reviews/elden-ring-shadow-of-the-erdtree-review' },
        { title: 'Game Vault Forum — Scadutree Fragment Route Guide', url: '/guides/elden-ring-scadutree-fragment-route-boss-progression' },
      ],
      cardIds: { games: ['elden-ring'], articles: ['rev-1', 'gui-2'], videos: ['vid-1'], hardware: [] },
      actions: [
        { id: 'act-er-1', type: 'navigate', label: 'Read Scadutree Route Guide', target: '/guides/elden-ring-scadutree-fragment-route-boss-progression' },
        { id: 'act-er-2', type: 'video', label: 'Watch 24-Min Erdtree Deep Dive', target: 'vid-1' },
        { id: 'act-er-3', type: 'requirements', label: 'Check Elden Ring PC Specs', target: 'elden-ring' },
      ],
    };
  }

  // 9. Cyberpunk 2077
  if (q.includes('cyberpunk') || q.includes('night city') || q.includes('phantom liberty') || q.includes('cd projekt')) {
    return {
      reply: `### ${memberGreeting}Cyberpunk 2077 & Phantom Liberty Overhaul

Cyberpunk 2077 stands as one of the most technically demanding and visually stunning RPGs in modern gaming.

#### Key Highlights from Our Coverage:
- **Patch 2.1 Overhaul**: Completely revamps police AI, cyberware limiters, vehicle combat, and perk trees.
- **Phantom Liberty Expansion**: Introduces Dogtown, an espionage thriller narrative starring Idris Elba, and the Relic perk tree.
- **Hardware Demand**: Ray Tracing Overdrive (Full Path Tracing) requires DLSS 3.5 Frame Generation and an RTX 4070 or above for 60+ FPS at 1440p.`,
      sources: [
        { title: 'Game Vault Forum — Cyberpunk 2077 in 2026 Overhaul Article', url: '/articles/cyberpunk-2077-in-2026-complete-overhaul-journey' },
        { title: 'Game Vault Forum — Games Catalog: Cyberpunk 2077', url: '/games/cyberpunk-2077' },
      ],
      cardIds: { games: ['cyberpunk-2077'], articles: ['art-2'], videos: ['vid-3'], hardware: ['gpu-4070s'] },
      actions: [
        { id: 'act-cp-1', type: 'requirements', label: 'Check Cyberpunk 2077 PC Specs', target: 'cyberpunk-2077' },
        { id: 'act-cp-2', type: 'video', label: 'Watch Overhaul Journey Video', target: 'vid-3' },
        { id: 'act-cp-3', type: 'navigate', label: 'Read 2026 Modding Article', target: '/articles/cyberpunk-2077-in-2026-complete-overhaul-journey' },
      ],
    };
  }

  // 10. Helldivers 2
  if (q.includes('helldivers') || q.includes('super earth') || q.includes('stratagem') || q.includes('automaton') || q.includes('terminid')) {
    return {
      reply: `### ${memberGreeting}Helldivers 2 Galactic War Tactics

Helldivers 2 holds a **9.0/10 rating** on Game Vault Forum for its chaotic cooperative design and live-service Galactic War.

#### Super Helldive (Difficulty 10) Loadout Strategy:
- **Automaton Front**: Quasar Cannon or Recoilless Rifle for Hulks and Gunships; Shield Generator Pack; 500kg Bomb and Orbital Laser for Fabricators.
- **Terminid Front**: Flamethrower or Guard Dog Rover for crowd control; Orbital Railcannon Strike for Bile Titans; Stun Grenades for Chargers.
- **Team Synergy**: Always maintain 2 heavy armor-piercing anti-tank weapons and 2 crowd-clearing loadouts per 4-player squad.`,
      sources: [
        { title: 'Game Vault Forum — Helldivers 2 Review (9.0/10)', url: '/reviews/helldivers-2-review' },
        { title: 'Game Vault Forum — Super Helldive Stratagems Guide', url: '/guides/helldivers-2-super-helldive-stratagems-tactics' },
      ],
      cardIds: { games: ['helldivers-2'], articles: ['rev-2', 'gui-3'], videos: ['vid-4'], hardware: [] },
      actions: [
        { id: 'act-hd-1', type: 'navigate', label: 'Read Stratagems Guide', target: '/guides/helldivers-2-super-helldive-stratagems-tactics' },
        { id: 'act-hd-2', type: 'video', label: 'Watch Galactic War Tactics Video', target: 'vid-4' },
        { id: 'act-hd-3', type: 'requirements', label: 'Check Helldivers 2 PC Specs', target: 'helldivers-2' },
      ],
    };
  }

  // 11. PUBG Mobile
  if (q.includes('pubg') || q.includes('battle royale') || q.includes('erangel') || q.includes('krafton')) {
    return {
      reply: `### ${memberGreeting}PUBG Mobile Gameplay & Tactics

PUBG Mobile is featured on Game Vault with our official morning gameplay video showcasing tactical positioning and circle rotations.

#### Tactical Tips:
- **Circle Rotation**: Move with the narrow edge of the blue zone to reduce the angles enemies can attack from.
- **Vehicle Security**: Always secure a Dacia or UAZ early for mobile cover in open final circles.
- **Gyroscope Aiming**: Enable "Always On" gyroscope for fine micro-adjustments during high-recoil 4x/6x spraying.`,
      sources: [
        { title: 'Game Vault Forum — PUBG Mobile Video', url: '/videos/vid-pubg-morning' },
        { title: 'Game Vault Forum — Games Catalog: PUBG Mobile', url: '/games/pubg-mobile' },
      ],
      cardIds: { games: ['pubg-mobile'], articles: [], videos: ['vid-pubg-morning'], hardware: [] },
      actions: [
        { id: 'act-pubg-1', type: 'video', label: 'Watch PUBG Morning Gameplay', target: 'vid-pubg-morning' },
        { id: 'act-pubg-2', type: 'requirements', label: 'Check PUBG Mobile Specs', target: 'pubg-mobile' },
      ],
    };
  }

  // 12. Default Comprehensive Portal & Navigation
  return {
    reply: `### ${memberGreeting}Vault AI Gaming Portal & Directory

Welcome! I am **Vault AI**, your gaming copilot for Game Vault Forum. Here are top recommendations and tools ready for you:

#### Featured Games in Database:
- **Elden Ring & Shadow of the Erdtree** (Soulsborne Action RPG • 9.8/10)
- **Helldivers 2** (Co-op Squad Shooter • 9.0/10)
- **Cyberpunk 2077 & Phantom Liberty** (Open World Sci-Fi RPG • 9.2/10)
- **World of Warships** (Naval Tactical Strategy • 8.9/10)

#### Quick Actions:
- **[PC Game Requirements Checker](/tools/pc-game-requirements-checker)**: Test your CPU/GPU against game specs.
- **[Gaming PC Builder](/tools/gaming-pc-builder)**: Configure a build with 10-point socket compatibility & dual currency ($/₦).
- **[Community Forum](/forum)**: Join active discussions or post new gaming topics.

${isVisitor ? `*Tip for Visitors: You can explore all games and tools freely! To post on the forum and save bookmarks, create a free account.*` : `*How can I assist your gaming session today?*`}`,
    sources: [
      { title: 'Game Vault Forum — Games Catalog', url: '/games' },
      { title: 'Game Vault Forum — Tools Hub', url: '/tools' },
      { title: 'Game Vault Forum — Community Forum', url: '/forum' },
    ],
    cardIds: {
      games: ['elden-ring', 'helldivers-2', 'cyberpunk-2077', 'world-of-warships'],
      articles: ['art-1', 'art-2'],
      videos: ['vid-1'],
      hardware: ['gpu-4070s'],
    },
    actions: isVisitor
      ? [
          { id: 'act-gen-auth', type: 'auth', label: 'Join Free / Sign In', target: 'open' },
          { id: 'act-gen-req', type: 'requirements', label: 'Test System Requirements', target: 'elden-ring' },
          { id: 'act-gen-bld', type: 'navigate', label: 'Open PC Builder', target: '/tools/gaming-pc-builder' },
          { id: 'act-gen-cat', type: 'navigate', label: 'Browse Games Catalog', target: '/games' },
        ]
      : [
          { id: 'act-gen-top', type: 'topic', label: 'Draft Forum Topic', target: '/forum/new' },
          { id: 'act-gen-req', type: 'requirements', label: 'Test System Requirements', target: 'elden-ring' },
          { id: 'act-gen-bld', type: 'navigate', label: 'Open PC Builder', target: '/tools/gaming-pc-builder' },
          { id: 'act-gen-for', type: 'navigate', label: 'Browse Forum', target: '/forum' },
        ],
  };
}

startServer();
