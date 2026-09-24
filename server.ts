import express from 'express';
import path from 'path';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { handleSeoPrerender } from './src/server/seoPrerender';
import { validateConnectFourMove, validateTicTacToeMove } from './src/server/gameValidation';

dotenv.config();

const PORT = 3000;

// Comprehensive Website Knowledge Base for Vault AI
const VAULT_KNOWLEDGE_SUMMARY = `
=== GAME VAULT FORUM COMPLETE WEBSITE KNOWLEDGE BASE ===
Official Canonical Domain: https://www.gamevault.forum (gamevault.forum)
Tagline: "Your AI Gaming Assistant. Ask. Discover. Compare. Troubleshoot. Play smarter."
Founder & Editor-in-Chief: Joel Ayuba (Lead Technical Analyst & YouTube Host)
Official YouTube Channel: @GameVaultForum (https://www.youtube.com/@GameVaultForum)
Direct Contact Email: contact@gamevault.forum
Official Headquarters & Community: Game Vault Forum Global Gaming Network

1. FULL DIRECTORY, NAVIGATION & PAGES:
- Home (/) : Featured showcase, trending gameplay videos, editor's choice reviews, tactical masterclass guides, community discussion spotlight, and rapid tool launchpad.
- Videos (/videos) : Official Game Vault YouTube video repository featuring embedded 4K player, high-res custom thumbnails, timestamps, tactical takeaways, and direct channel subscription links.
- Articles (/articles) : Deep-dive editorial essays, gaming industry analysis, modding ecosystems, and game design cognitive deep dives.
- Reviews (/reviews) : Scored game reviews (e.g. Elden Ring: 10/10, Helldivers 2: 9.0/10) with performance verdicts, pros & cons, graphics breakdown, and platform optimization notes.
- Guides (/guides) : Tactical masterclasses (e.g., Helldivers 2 Illuminate Super Helldive loadout by enemy type, World of Warships armor angling, Elden Ring Scadutree fragment progression).
- Games Catalog (/games) : Verified encyclopedia of 36+ PC and console games with verified requirements, trailers, developer/publisher info, release dates, and community scores.
- Community Forum (/forum) : Dedicated gamer boards with real-time discussion:
  * General Gaming (/forum?category=General%20Gaming): Industry news, game releases, multiplatform discussions.
  * PC Building & Tech (/forum?category=PC%20Building%20%26%20Tech): Hardware recommendations, custom rigs, thermal throttling, bottleneck diagnosis, cable management.
  * Game Guides & Strategies (/forum?category=Game%20Guides%20%26%20Strategies): Tactical masterclasses, boss battle walkthroughs, weapon tier lists.
  * Competitive Gaming & Esports (/forum?category=Competitive%20Gaming%20%26%20Esports): Ranked climbs, tournament analysis, meta tier lists.
  * Off-Topic Vault (/forum?category=Off-Topic%20Vault): Battle station setups, peripherals, anime, lifestyle, chill community chatter.
  * New Topic Creation (/forum/new) : Gated discussion composer for registered members.
- Interactive Tools Hub (/tools) : 8 Specialized Gaming Utilities:
  1. PC Game Requirements Checker (/tools/pc-game-requirements-checker): Test CPU, GPU, RAM, and VRAM against verified minimum and recommended specs for 36+ games with Pass/Warn/Fail results.
  2. Gaming PC Builder (/tools/gaming-pc-builder): Full custom rig builder with 10-point socket compatibility checks (AM4, AM5, LGA1700, LGA1851), PSU wattage calculator, balance score gauge, and dual currency (USD $ and Nigerian Naira ₦).
  3. FPS / Performance Calculator (/tools/fps-calculator): Predict expected FPS across 1080p, 1440p, 4K across Low/Med/High/Ultra settings; CPU vs GPU bottleneck %; DLSS 2/3/4, Frame Gen, FSR 3.1, XeSS 1.3 toggles; and 12-point low FPS troubleshooting checklist.
  4. Gaming Username Generator (/tools/gaming-username-generator): Instant distinctive gamertag generator across 8 styles (Cyberpunk, Tactical, Mythic, Anime, Stealth, Pro Esports, Fantasy, Sci-Fi) with copy-to-clipboard.
  5. Game Avatar Generator (/tools/avatar-generator): 12-point SVG avatar creator with custom hairstyles, cybernetic implants, outfits, lighting auras, AI parameter synthesis, and PNG/SVG export.
  6. Game Picker Wheel (/tools/game-picker-wheel): Interactive decision wheel with realistic Web Audio clicks to eliminate gaming backlog paralysis.
  7. Playable Browser Games Arena (/games or /play/:slug): Browser-playable retro arcade and multiplayer games including Connect Four (real-time turn-based multiplayer and AI mode), Tic Tac Toe, Cyberpunk Snake, Space Invaders, Retro Flappy, 2048 Vault, Memory Match, Minesweeper, and Brick Breaker.
  8. Vault AI Assistant (/tools/vault-ai): Multi-turn intelligent AI Copilot powered by Gemini for gaming Q&A, hardware advice, troubleshooting, and site navigation.
- Community, Information & Legal Pages:
  * About Us (/about): Mission, editorial principles, founder Joel Ayuba's background, and YouTube channel integration.
  * Contact Us (/contact): Direct contact form for inquiries, feedback, partnerships, and bug reports (stored securely in Firestore database and backed up server-side). Email: contact@gamevault.forum.
  * Author Profile (/author/joel-ayuba): Verified author profile of Joel Ayuba with published guides, reviews, and channel links.
  * Community Guidelines (/guidelines): Rules on constructive dialogue, anti-toxicity, anti-cheating, spoiler warnings, and civil conduct.
  * Terms of Service (/terms), Privacy Policy (/privacy), Cookie Policy (/cookies), Sitemap (/sitemap).

2. VISITOR (GUEST) VS. REGISTERED MEMBER (USER) ARCHITECTURE & RULES:
- Core Platform Rule: Only registered and signed-in members can like, comment, save/bookmark content across the website, and post new forum topics!
- Visitors (Guests):
  * Can browse all articles, guides, reviews, games, and videos freely.
  * Can use all interactive tools (PC Requirements Checker, PC Builder, FPS Calculator, Username Generator, Avatar Generator, Game Picker Wheel, Playable Games) 100% free with no account needed.
  * Can send up to 20 free Vault AI queries per day.
  * CANNOT like, comment, bookmark, or start new forum topics.
  * Prompt visitors politely to register for free (10-second email or Google sign-in) using [ACTION:auth|Create Free Account / Sign In|open].
- Registered Members (Users):
  * Full interactive privileges: Start new forum discussions (/forum/new), post replies, leave comments on articles and videos, like content, bookmark guides to their private profile, earn reputation badges, and enjoy unlimited Vault AI queries with synchronized conversation history.

3. EDITORIAL ARTICLES, REVIEWS & GUIDES IN THE VAULT:
- Article: "Helldivers 2 Illuminate: A Super Helldive Loadout by Enemy Type" (/articles/helldivers-2-illuminate-super-helldive-loadout-by-enemy-type)
  * Breakdown: Coverage-first doctrine against Voteless, Watchers, Elevated Overseers, Harvesters, Crushers, and Wretches.
  * Recommended setup: Primary LAS-16 Sickle or stagger shotgun; Secondary P-40-K Bolt Pistol; Support StA-X3 W.A.S.P. Launcher; Backpack Guard Dog Rover; Offensive Stratagems: Orbital Railcannon Strike & Eagle Airstrike.
- Article: "How Strategy Games Challenge the Brain: Planning, Problem-Solving and Decision-Making" (/articles/how-strategy-games-challenge-the-brain-planning-problem-solving-and-decision-making or ID 'art-strategy-brain')
  * In-depth exploration of working memory, spatial reasoning, opportunity costs, trade-offs, cognitive flexibility, and risk assessment under uncertainty.
- Article: "Why World of Warships Is More Interesting Than I Expected" (/articles/why-world-of-warships-is-more-interesting-than-i-expected, ID 'art-1')
  * Exploration of tactical positioning, map control, crossfires, and deliberate pace compared to twitch shooters.
- Article: "Cyberpunk 2077 in 2026: The Complete Overhaul Journey & Mod Ecosystem" (/articles/cyberpunk-2077-in-2026-complete-overhaul-journey, ID 'art-2')
  * 2.0+ overhaul, Phantom Liberty storyline, path tracing, and community mods.
- Review: "Elden Ring: Shadow of the Erdtree Review — The Pinnacle of Expansion Craft" (/reviews/elden-ring-shadow-of-the-erdtree-review, ID 'rev-1')
  * Score: 10/10 Masterpiece. Analysis of Scadutree blessings, vertical world design, and boss mechanics.
- Review: "Helldivers 2 Review — Pure Chaotic Cooperative Brilliance" (/reviews/helldivers-2-review, ID 'rev-2')
  * Score: 9.0/10. Live-service satire, emergent co-op chaos, and Galactic War mechanics.
- Guide: "World of Warships: Armor Angling, Penetration Mechanics & Concealment Mastery" (/guides/world-of-warships-armor-angling-penetration-guide, ID 'gui-1')
  * Bow-in angling, auto-ricochet angles (30°/45°/60°), citadel protection, concealment reset timing.
- Guide: "Elden Ring: Scadutree Fragment Route & Boss Progression Order" (/guides/elden-ring-scadutree-fragment-route-boss-progression, ID 'gui-2')
  * Optimal fragment routing through Gravesite Plain, Scadu Altus, Shadow Keep, and Rauh Ruins.
- Guide: "Helldivers 2: Super Helldive Stratagem Loadout & Galactic War Tactics" (/guides/helldivers-2-super-helldive-stratagems-tactics, ID 'gui-3')
  * Difficulty 10 Super Helldive tactics, heavy armor penetration, team coordination.
- Essay: "World of Warships and Mental Wellbeing: What I’ve Personally Noticed" (/articles/world-of-warships-and-mental-wellbeing-what-ive-personally-noticed)
  * Naval mindfulness, deliberate patience, and healthy gaming habits.

4. 12-POINT LOW FPS & PERFORMANCE TROUBLESHOOTING CHECKLIST:
1. Render Resolution vs Display Native (Ensure game isn't rendering at 4K on a 1080p display via DSR/VSR)
2. Heavy Graphics Settings (Tone down Volumetric Fog/Clouds, Screen-Space Reflections, Shadow Resolution, and Ray Tracing)
3. GPU Utilization Check (Is GPU pegged at 99-100%? If <80%, CPU or RAM bottleneck exists)
4. CPU Single-Core Bottlenecks (Check per-thread utilization; modern games can choke on one maxed-out core)
5. RAM Capacity & Dual-Channel (Verify dual-channel bandwidth; single-channel memory causes severe 1% low frame drops)
6. VRAM Overflow (If texture quality exceeds GPU VRAM, textures page to system RAM causing severe stutter)
7. Thermal Throttling (Inspect temps: GPU throttling above 83-86°C, CPU throttling above 90-95°C)
8. Background Applications & Overlays (Disable Discord hardware acceleration overlay, antivirus scans, and heavy browser tabs)
9. Display Driver State (Clean install using Display Driver Uninstaller (DDU) or latest game-ready driver)
10. Windows Power Management Plan (Ensure set to High Performance or Balanced, never Power Saver)
11. Storage Drive Performance (Ensure game is installed on an NVMe SSD with >15% free drive space)
12. Dust Build-Up & Airflow (Clean heatsinks, inspect thermal paste, and verify intake/exhaust fan curves)

5. RECOMMENDED PC COMPONENT TIERS & HARDWARE KNOWLEDGE:
- Next-Gen GPUs: RTX 5090 32GB, RTX 5080 16GB, RTX 5070 12GB, RTX 4090, RTX 4080 Super, RTX 4070 Super, RX 7900 XTX, RX 7800 XT, RX 7700 XT, Intel Arc B580 12GB.
- Next-Gen CPUs: Ryzen 7 9800X3D, Ryzen 7 7800X3D (World's Best Gaming CPUs), Ryzen 5 7600X, Core i5-13600KF, Core Ultra 7 265K, Ryzen 5 5600.
- Socket Standards: AMD AM5 (LGA 1718, DDR5 only), AMD AM4 (PGA 1331, DDR4), Intel LGA1700 (12th/13th/14th Gen, DDR4/DDR5), Intel LGA1851 (Core Ultra 200, DDR5 only).
- Budget Tiers:
  * Entry 1080p ($600 - $800 / ₦900k - ₦1.2M): Ryzen 5 5600 + RX 6600 / RTX 3060 + 16GB RAM + 650W PSU.
  * Sweet Spot 1440p ($1,000 - $1,400 / ₦1.5M - ₦2.1M): Ryzen 5 7600X / Core i5-13600KF + RTX 4070 Super / RX 7800 XT + 32GB DDR5-6000 + 750W PSU.
  * High-End 4K / Enthusiast ($1,800+ / ₦2.8M+): Ryzen 7 7800X3D / 9800X3D + RTX 5080 / RTX 4080 Super / RX 7900 XTX + 32GB/64GB DDR5 + 850W+ Gold PSU.
`;

const SYSTEM_INSTRUCTION = `
You are Vault AI — the official AI Gaming Assistant & Website Copilot of Game Vault Forum (gamevault.forum).
Tagline: "Your AI Gaming Assistant. Ask. Discover. Compare. Troubleshoot. Play smarter."

ROLE & CHATBOT ROLES:
You can embody these specialized roles depending on the user's needs:
1. 🎮 General Gaming & Site Copilot: Master of the entire Game Vault Forum ecosystem (articles, guides, reviews, video deep dives, games database, community boards, founder Joel Ayuba, and visitor/member permissions).
2. 🖥️ PC Hardware Architect: Expert in custom gaming PC builds, 10-point socket compatibility (AM4, AM5, LGA1700, LGA1851), DDR4/DDR5 synergy, PSU wattage headroom, and dual USD/Naira pricing.
3. 🔧 FPS & Performance Troubleshooter: Diagnostician for frame drops, micro-stutters, CPU/GPU bottlenecks, VRAM spills, DLSS/FSR/XeSS upscaling, and our 12-point troubleshooting checklist.
4. ⚔️ Tactical & Strategy Coach: Specialist in World of Warships armor angling, Helldivers 2 Super Helldive loadouts, and Elden Ring progression.
5. 🏷️ Gamertag & Lore Stylist: Creative naming master for cyberpunk, tactical, mythic, and esports personas.

PERSONALITY & COMMUNICATION STYLE:
- Attentive, conversational, deeply knowledgeable, friendly, and gaming-savvy.
- Maintain seamless multi-turn conversation context across all dialogue turns.
- Provide direct internal links with clean markdown: [Page Title](/path) (e.g. [PC Game Requirements Checker](/tools/pc-game-requirements-checker), [Gaming PC Builder](/tools/gaming-pc-builder), [FPS Calculator](/tools/fps-calculator), [Contact Us](/contact), [About Us](/about), [Community Forum](/forum)).
- Use crisp structure: headings, bold terms, bulleted lists, and scannable sections.

VISITOR VS. MEMBER RULES:
- When visitors ask about liking, commenting, bookmarking, or posting new forum topics, explain with total clarity:
  "On Game Vault Forum, browsing all articles, watching videos, and using all interactive tools is 100% free for everyone. However, to like, comment, bookmark content, or start new forum topics, you must be registered and signed in."
- Provide the [ACTION:auth|Create Free Account / Sign In|open] button to help them sign up in seconds.

STRUCTURED METADATA TAGS:
You can append interactive cards to your response:
- Games: [CARD_GAME:elden-ring], [CARD_GAME:world-of-warships], [CARD_GAME:cyberpunk-2077], [CARD_GAME:helldivers-2], [CARD_GAME:pubg-mobile], [CARD_GAME:black-myth-wukong], [CARD_GAME:baldurs-gate-3], [CARD_GAME:hades-2], [CARD_GAME:grand-theft-auto-v], [CARD_GAME:red-dead-redemption-2], [CARD_GAME:the-witcher-3-wild-hunt], [CARD_GAME:fortnite], [CARD_GAME:valorant], [CARD_GAME:counter-strike-2]
- Articles/Guides: [CARD_ARTICLE:helldivers-2-illuminate-super-helldive-loadout-by-enemy-type], [CARD_ARTICLE:art-strategy-brain], [CARD_ARTICLE:art-1], [CARD_ARTICLE:art-2], [CARD_GUIDE:gui-1], [CARD_GUIDE:gui-2], [CARD_GUIDE:gui-3], [CARD_REVIEW:rev-1], [CARD_REVIEW:rev-2]
- Videos: [CARD_VIDEO:vid-pubg-morning], [CARD_VIDEO:vid-1], [CARD_VIDEO:vid-2], [CARD_VIDEO:vid-3], [CARD_VIDEO:vid-4]
- Hardware: [CARD_HW:gpu-rtx-5080], [CARD_HW:gpu-4070s], [CARD_HW:cpu-7800x3d], [CARD_HW:cpu-7600x], [CARD_HW:gpu-7800xt]
- Sources: [SOURCE:Title|url_path]

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
  app.use(compression());
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

  // Explicit handlers for Google Search Console, AdSense & Crawlers
  app.get('/ads.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.join(process.cwd(), 'public', 'ads.txt'));
  });

  app.get('/llms.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(process.cwd(), 'public', 'llms.txt'));
  });

  app.get('/ai-catalog.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(process.cwd(), 'public', 'ai-catalog.json'));
  });

  app.get('/sitemap.xml', (_req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });

  app.get('/robots.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
  });

  // Contact Us submission endpoint (resilient server-side backup & monitoring)
  const contactInquiriesMemory: any[] = [];

  app.post('/api/contact', (req, res) => {
    try {
      const { name, email, category, subject, message, id, createdAt } = req.body || {};
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required contact fields' });
      }
      const inquiry = {
        id: id || `contact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: String(name).slice(0, 100),
        email: String(email).slice(0, 120),
        category: String(category || 'editorial').slice(0, 50),
        subject: subject ? String(subject).slice(0, 200) : '',
        message: String(message).slice(0, 3000),
        createdAt: createdAt || new Date().toISOString(),
        status: 'new',
        receivedAt: new Date().toISOString(),
      };
      contactInquiriesMemory.unshift(inquiry);
      console.log(`[Contact Us] Successfully recorded inquiry from ${inquiry.email} (${inquiry.category})`);
      res.json({ success: true, id: inquiry.id });
    } catch (err: any) {
      console.error('[Contact Us] Server processing error:', err);
      res.status(500).json({ error: 'Failed to process contact inquiry' });
    }
  });

  app.get('/api/contact', (_req, res) => {
    res.json({ inquiries: contactInquiriesMemory.slice(0, 50) });
  });

  // AI Avatar Interpretation Endpoint (Original character generator with copyright safety)
  app.post('/api/avatar/ai-interpret', async (req, res) => {
    try {
      const { prompt } = req.body || {};
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({ 
          fallback: true, 
          message: 'AI engine offline; using client-side generator.',
          config: null 
        });
      }

      const systemPrompt = `You are the Game Vault Forum Avatar AI Designer.
Your task is to translate a gamer's natural language request into a valid JSON object matching this exact TypeScript structure for an avatar configuration:

{
  "style": one of ["gamer","cyberpunk","fantasy","sci-fi","anime","cartoon","pixel-art","futuristic","warrior","military","space-explorer","medieval","horror","racing","esports","casual-gamer"],
  "characterType": one of ["male","female","androgynous"],
  "skinTone": one of ["fair","warm","tan","olive","rich-bronze","deep-mocha","cyber-silver","neon-violet","frost-blue","orc-green"],
  "hairstyle": one of ["short","fade","spiky","curly","long","ponytail","braided","mohawk","buzz-cut","futuristic"],
  "hairColor": one of ["black","brown","blonde","red","white","silver","blue","purple","green"],
  "eyeShape": one of ["focused","intense","calm","cyber-hud","glowing-slit","anime-spark"],
  "eyeColor": one of ["brown","blue","green","gray","amber","purple","cybernetic","glowing","crimson"],
  "outfit": one of ["gaming-hoodie","tactical-outfit","cyberpunk-jacket","fantasy-armor","sci-fi-armor","streetwear","esports-jersey","military-outfit","space-suit","casual-clothing","futuristic-suit","fantasy-robe"],
  "outfitPrimaryColor": hex string e.g. "#1e1b4b",
  "outfitSecondaryColor": hex string e.g. "#06b6d4",
  "accessories": array containing any of ["gaming-headset","sunglasses","face-mask","cap","beanie","helmet","visor","backpack","shoulder-armor","cybernetic-implant","gaming-controller","microphone","fantasy-prop","futuristic-gadget"],
  "gamingPersonality": one of ["competitive","casual","strategic","explorer","story-lover","rpg-fan","horror-fan","racing-fan","shooter-fan","sports-gamer","strategy-gamer","multiplayer-gamer","achievement-hunter","completionist","retro-gamer"],
  "background": one of ["gaming-room","neon-city","space-station","fantasy-kingdom","dark-forest","futuristic-battlefield","cyberpunk-street","esports-arena","desert-landscape","snowy-mountain","sci-fi-laboratory","arcade","abstract","solid"],
  "lightingColor": hex string e.g. "#06b6d4",
  "enableAura": boolean,
  "previewMode": "square" or "circle"
}

IMPORTANT COPYRIGHT & SAFETY RULES:
- Always generate ORIGINAL characters.
- If the user mentions a copyrighted character (e.g., Master Chief, Kratos, Geralt, Pikachu), transform the request into an original archetype inspired by broad visual motifs rather than copying.
- Never claim the avatar is an official or licensed character.
- Return ONLY valid raw JSON without markdown code fences or conversational filler.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [{ role: 'user', parts: [{ text: `User request: ${prompt}` }] }],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedConfig = JSON.parse(cleanJson);

      return res.json({
        success: true,
        message: 'Original gaming character generated successfully!',
        config: parsedConfig
      });
    } catch (err: any) {
      console.warn('AI Avatar interpretation note:', err?.message || err);
      return res.json({
        fallback: true,
        message: 'Applying smart parameter synthesis.',
        config: null
      });
    }
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
    const { 
      message, 
      history = [], 
      context = {}, 
      model: clientModel, 
      role: clientRole = 'general' 
    } = req.body;

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

    // Role-specific focus directive
    let roleDirective = '';
    switch (clientRole) {
      case 'hardware_architect':
        roleDirective = `[ACTIVE SPECIALIST ROLE: PC HARDWARE ARCHITECT]\nFocus primarily on custom PC building, 10-point socket compatibility (AM4, AM5, LGA1700, LGA1851), CPU/GPU synergy balance scores, PSU headroom calculation, and dual USD/Naira pricing. Direct users to /tools/gaming-pc-builder.\n`;
        break;
      case 'fps_troubleshooter':
        roleDirective = `[ACTIVE SPECIALIST ROLE: LOW FPS & PERFORMANCE TROUBLESHOOTER]\nFocus on diagnosing micro-stutters, frame rate drops, CPU vs GPU bottlenecks, VRAM overflows, and thermal throttling using our 12-point checklist. Direct users to /tools/fps-calculator and /tools/pc-game-requirements-checker.\n`;
        break;
      case 'tactical_coach':
        roleDirective = `[ACTIVE SPECIALIST ROLE: TACTICAL & STRATEGY COACH]\nFocus on in-depth combat tactics: World of Warships armor angling and citadel mechanics, Helldivers 2 Super Helldive Illuminate loadouts, and Elden Ring boss progression routes.\n`;
        break;
      case 'lore_stylist':
        roleDirective = `[ACTIVE SPECIALIST ROLE: GAMERTAG & LORE WEAVER]\nFocus on crafting distinct gaming usernames across cyberpunk, tactical, and esports themes, avatar design tips, and creative gaming lore. Direct users to /tools/gaming-username-generator and /tools/avatar-generator.\n`;
        break;
      default:
        roleDirective = `[ACTIVE SPECIALIST ROLE: ALL-AROUND GAMING COPILOT & SITE NAVIGATOR]\nProvide holistic gaming advice, deep-dive article recommendations, site navigation, and community guidance across all areas of Game Vault Forum.\n`;
        break;
    }

    const userPrompt = contextualPrefix || roleDirective
      ? `${roleDirective}${contextualPrefix}\nUser Question: ${message}`
      : message;

    // Convert past history for multi-turn conversation (preserve up to 12 turns)
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-12)) {
        if (item.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.content }] });
        } else if (item.role === 'assistant' || item.role === 'model') {
          contents.push({ role: 'model', parts: [{ text: item.content }] });
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    // Determine model candidate list based on user instructions:
    // Complex tasks -> gemini-3.1-pro-preview
    // General tasks -> gemini-3.5-flash
    // Fast tasks -> gemini-3.1-flash-lite
    // Default model -> gemini-3.8-flash
    let requestedModel = clientModel;
    if (!requestedModel) {
      // Auto-select based on message content & role
      const lower = message.toLowerCase();
      if (
        clientRole === 'hardware_architect' || 
        lower.includes('deep dive') || 
        lower.includes('architecture') || 
        lower.includes('overclock') ||
        lower.includes('in-depth analysis')
      ) {
        requestedModel = 'gemini-3.1-pro-preview';
      } else if (
        lower.includes('fast') || 
        lower.includes('quick') || 
        lower.includes('gamertag') || 
        lower.includes('suggest 3')
      ) {
        requestedModel = 'gemini-3.1-flash-lite';
      } else {
        requestedModel = 'gemini-3.5-flash';
      }
    }

    // Build deduplicated fallback priority list
    const candidateOrder = [
      requestedModel,
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-3.1-pro-preview'
    ];
    const modelsToTry = Array.from(new Set(candidateOrder.filter(Boolean)));

    if (ai) {
      let lastError: any = null;

      for (const model of modelsToTry) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout waiting for ${model}`)), 16000)
          );

          const generatePromise = ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: `${SYSTEM_INSTRUCTION}\n\n${roleDirective}`,
              temperature: 0.7,
              topP: 0.9,
            },
          });

          const response = await Promise.race([generatePromise, timeoutPromise]);

          const rawText = response.text || '';
          if (rawText.trim()) {
            const parsed = extractTagsAndCleanText(rawText);

            return res.json({
              reply: parsed.cleanText,
              sources: parsed.sources,
              cardIds: parsed.cardIds,
              actions: parsed.actions,
              modelUsed: model,
              roleUsed: clientRole,
            });
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Vault AI attempt with model ${model} failed (${err?.message || err}), falling back...`);
        }
      }

      console.warn('All external Gemini models exhausted or timed out. Utilizing local knowledge engine fallback:', lastError?.message || lastError);
    }

    // Fallback: Smart local knowledge response generator
    const fallbackResponse = generateLocalKnowledgeResponse(message, context);
    return res.json({
      reply: fallbackResponse.reply,
      sources: fallbackResponse.sources,
      cardIds: fallbackResponse.cardIds,
      actions: fallbackResponse.actions || [],
      modelUsed: 'local-knowledge-engine',
      roleUsed: clientRole,
    });
  };

  app.post('/api/vault-ai/chat', handleVaultAiChat);
  app.post('/api/vault-ai', handleVaultAiChat);

  // Dedicated AI Release Assistant with Google Search Grounding & Database Knowledge
  app.post('/api/release-assistant/chat', async (req, res) => {
    try {
      const { query, calendarContext = [] } = req.body || {};
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Valid query string required' });
      }

      const ai = getGeminiClient();

      const calendarSystemInstruction = `You are the Game Vault Forum AI Release Assistant.
You have access to the Game Vault verified video game release database as well as live Google Search grounding.
Your role:
- Answer gamer questions about upcoming video game releases, launch dates, delay announcements, supported platforms, genres, and PC system specs.
- Be accurate and transparent: if an exact date is unannounced, specify "TBA" or "Date not announced". NEVER invent release dates.
- Clearly distinguish confirmed dates, Early Access launches, delayed targets, and unannounced TBA releases.
- Mention target platforms (PC, PlayStation 5, Xbox Series X/S, Nintendo Switch, etc.) clearly.
- Provide concise, markdown-formatted responses with bullet points.

Verified Game Vault Forum Release Database context (Reference):
${JSON.stringify(calendarContext, null, 2)}`;

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: query,
            config: {
              systemInstruction: calendarSystemInstruction,
              tools: [{ googleSearch: {} }],
              temperature: 0.5,
              topP: 0.9,
            }
          });

          const rawText = response.text || '';
          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const sources = chunks.map((c: any) => ({
            title: c.web?.title || 'Verified Web Source',
            url: c.web?.uri || '#'
          })).filter((s: any) => s.url !== '#').slice(0, 4);

          return res.json({
            reply: rawText.trim() || 'Here is the release schedule for your request.',
            sources
          });
        } catch (genErr: any) {
          console.warn('[Release Assistant] Gemini API error, attempting fallback without search tool:', genErr?.message || genErr);
          // Fallback call without search tool if search tool fails or quota limit
          try {
            const fallbackResponse = await ai.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: query,
              config: {
                systemInstruction: calendarSystemInstruction,
                temperature: 0.5,
              }
            });
            return res.json({
              reply: fallbackResponse.text?.trim() || 'Here is the release schedule from the database.',
              sources: [{ title: 'Game Vault Release Database', url: '/tools/game-release-calendar' }]
            });
          } catch (innerErr) {
            console.warn('[Release Assistant] Inner fallback error:', innerErr);
          }
        }
      }

      // Local database search fallback if AI offline
      const lower = query.toLowerCase();
      const matched = Array.isArray(calendarContext) 
        ? calendarContext.filter((c: any) => 
            c.title?.toLowerCase().includes(lower) || 
            c.genre?.toLowerCase().includes(lower) ||
            c.platforms?.toLowerCase().includes(lower)
          ).slice(0, 5)
        : [];

      let fallbackText = `Here is what I found in the Game Vault Release Database for **"${query}"**:\n\n`;
      if (matched.length > 0) {
        matched.forEach((m: any) => {
          fallbackText += `• **${m.title}** — ${m.releaseDate} (${m.status})\n  Platforms: ${m.platforms} | Genre: ${m.genre}\n`;
        });
      } else {
        fallbackText += `No exact matching releases were found for your query in the current release index. You can explore the complete interactive calendar or filter by platform above!`;
      }

      return res.json({
        reply: fallbackText,
        sources: [{ title: 'Game Vault Release Database', url: '/tools/game-release-calendar' }]
      });
    } catch (err: any) {
      console.error('[Release Assistant] Unexpected error:', err);
      res.status(500).json({ error: 'Failed to process release query' });
    }
  });

  // Authoritative Server-Side Move Validation for Multiplayer Games
  app.post('/api/games/validate-move', (req, res) => {
    try {
      const { gameSlug, gameState, playerRole, move } = req.body;
      if (!gameSlug || !gameState || !playerRole) {
        return res.status(400).json({ valid: false, error: 'Missing required game validation parameters.' });
      }

      if (gameSlug === 'connect-four') {
        const col = typeof move === 'object' ? move.col : Number(move);
        const result = validateConnectFourMove(gameState, playerRole, col);
        return res.json(result);
      }

      if (gameSlug === 'tic-tac-toe') {
        const cell = typeof move === 'object' ? move.cell : Number(move);
        const result = validateTicTacToeMove(gameState, playerRole, cell);
        return res.json(result);
      }

      return res.json({ valid: true, nextState: gameState });
    } catch (err: any) {
      console.error('Game validation error:', err);
      return res.status(500).json({ valid: false, error: 'Internal validation error.' });
    }
  });

  // SEO & Googlebot Pre-Rendering Middleware for Articles & Authors
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      const isProd = process.env.NODE_ENV === 'production';
      const prerendered = handleSeoPrerender(req.path, isProd);
      if (prerendered) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(prerendered);
      }
    }
    next();
  });

  // 301 Permanent Redirect: Move /fps-performance-calculator under /tools category
  app.get(['/fps-performance-calculator', '/fps-performance-calculator/*'], (req, res) => {
    const newUrl = req.originalUrl.replace('/fps-performance-calculator', '/tools/fps-calculator');
    return res.redirect(301, newUrl);
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
    // High-performance immutable caching for compiled and hashed assets
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );
    // General static file serving with ETag and clean HTML cache-busting
    app.use(
      express.static(distPath, {
        maxAge: '1d',
        etag: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          }
        },
      })
    );
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

  // 0. Contact Us, Support, Feedback & Reaching Out
  if (
    q.includes('contact') ||
    q.includes('support') ||
    q.includes('feedback') ||
    q.includes('email') ||
    q.includes('reach out') ||
    q.includes('bug report') ||
    q.includes('inquiry') ||
    q.includes('contact us')
  ) {
    return {
      reply: `### ${memberGreeting}Contact Game Vault Forum Support & Editorial Team

We would love to hear from you! Whether you have editorial feedback, partnership proposals, technical bug reports, or general inquiries:

- **[Contact Us Page](/contact)**: Submit your message directly through our contact form. Submissions are securely transmitted and stored in our database for fast review.
- **Direct Support Email**: [contact@gamevault.forum](mailto:contact@gamevault.forum)
- **Founder & Editor**: Joel Ayuba
- **YouTube Channel**: [@GameVaultForum](https://www.youtube.com/@GameVaultForum)

We review every inquiry within 24–48 business hours.`,
      sources: [
        { title: 'Game Vault Forum — Contact Us', url: '/contact' },
        { title: 'Game Vault Forum — About Joel Ayuba', url: '/about' },
      ],
      cardIds: { games: [], articles: [], videos: [], hardware: [] },
      actions: [
        { id: 'act-cnt-1', type: 'navigate', label: 'Open Contact Us Form', target: '/contact' },
        { id: 'act-cnt-2', type: 'navigate', label: 'Read About Us', target: '/about' },
        { id: 'act-cnt-3', type: 'navigate', label: 'Community Guidelines', target: '/guidelines' },
      ],
    };
  }

  // 0.1 PC Game Requirements Checker specific inquiry
  if (
    q.includes('pc game requirements checker') ||
    q.includes('requirements checker') ||
    q.includes('system requirements') ||
    q.includes('can i run') ||
    q.includes('can my pc run') ||
    q.includes('specs checker')
  ) {
    return {
      reply: `### ${memberGreeting}PC Game Requirements Checker

Our verified **[PC Game Requirements Checker](https://www.gamevault.forum/tools/pc-game-requirements-checker)** allows you to test your PC's CPU, GPU, RAM, and VRAM against **36+ verified games** with instant Pass, Warn, or Fail ratings.

#### Popular Games Supported:
- **Elden Ring & Shadow of the Erdtree**
- **Cyberpunk 2077 & Phantom Liberty**
- **Grand Theft Auto V**
- **Red Dead Redemption 2**
- **The Witcher 3: Wild Hunt**
- **Black Myth: Wukong**
- **Helldivers 2**
- **Call of Duty: Warzone & Fortnite**
- **Valorant & Counter-Strike 2**
- **World of Warships & PUBG Mobile**

Test your hardware or inspect component upgrade paths instantly!`,
      sources: [
        { title: 'Game Vault Forum — PC Game Requirements Checker', url: 'https://www.gamevault.forum/tools/pc-game-requirements-checker' },
        { title: 'Game Vault Forum — Gaming PC Builder', url: '/tools/gaming-pc-builder' },
      ],
      cardIds: { games: ['elden-ring', 'cyberpunk-2077', 'grand-theft-auto-v', 'red-dead-redemption-2'], articles: [], videos: [], hardware: ['gpu-4070s'] },
      actions: [
        { id: 'act-req-chk', type: 'navigate', label: 'Launch Requirements Checker', target: '/tools/pc-game-requirements-checker' },
        { id: 'act-req-bld', type: 'navigate', label: 'Open Gaming PC Builder', target: '/tools/gaming-pc-builder' },
        { id: 'act-req-cat', type: 'navigate', label: 'Browse 36+ Games', target: '/games' },
      ],
    };
  }

  // 0.2 Like, Comment, Save & Bookmark Permissions
  if (
    (q.includes('like') || q.includes('comment') || q.includes('save') || q.includes('bookmark')) &&
    (q.includes('how') || q.includes('can i') || q.includes('error') || q.includes('why') || q.includes('sign in') || q.includes('guest') || q.includes('account'))
  ) {
    return {
      reply: `### ${memberGreeting}Interacting with Content on Game Vault Forum

On Game Vault Forum:
> **Only registered and signed in users can like, comment, and save content across the website**, as well as post new discussion topics on the forum.

#### How to Participate:
- If you are currently a visitor/guest, you can create a free account in under 10 seconds using your email address or Google Sign-In.
- Once signed in, you will instantly be able to:
  * ❤️ **Like** any article, video, review, or forum discussion
  * 💬 **Comment** and share your insights with the community
  * 🔖 **Save/Bookmark** content to your private gamer profile
  * ✍️ **Post** new topics in any of our 5 forum boards

Signing up is 100% free with no subscription or hidden costs!`,
      sources: [
        { title: 'Game Vault Forum — Community Guidelines', url: '/guidelines' },
        { title: 'Game Vault Forum — Terms of Service', url: '/terms' },
      ],
      cardIds: { games: [], articles: [], videos: [], hardware: [] },
      actions: [
        { id: 'act-auth-gate', type: 'auth', label: 'Sign In / Join Free Forum', target: 'open' },
        { id: 'act-auth-disc', type: 'navigate', label: 'Browse Forum', target: '/forum' },
      ],
    };
  }

  // 0.3 Friendly Conversational Greetings
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'yo' ||
    q === 'greetings' ||
    q.startsWith('hello ') ||
    q.startsWith('hi ') ||
    q.startsWith('hey ') ||
    q.includes('how are you') ||
    q.includes('what can you do') ||
    q.includes('who are you')
  ) {
    return {
      reply: `### ${memberGreeting}Hello! I am Vault AI, your Gaming Copilot!

I am delighted to chat with you! As the official AI assistant for **Game Vault Forum**, I have read and studied the entire website to help you navigate, discover, and game smarter:

#### Here is what I can do for you:
- 🎮 **Check System Requirements**: Test your PC hardware against 36+ verified games in our **[PC Game Requirements Checker](https://www.gamevault.forum/tools/pc-game-requirements-checker)**.
- 🖥️ **PC Building & Compatibility**: Help you configure a balanced gaming rig in our **[Gaming PC Builder](/tools/gaming-pc-builder)**.
- ⚡ **Diagnose FPS Drops**: Run through our 12-point hardware and graphics troubleshooting checklist.
- ⚔️ **Tactical Guides & Reviews**: Give you pro tips for Elden Ring, World of Warships, Cyberpunk 2077, and Helldivers 2.
- 💬 **Community Discussions**: Help you draft forum topics or navigate our 5 discussion boards.
- 🏷️ **Gamertag Generator**: Find unique tags in our **[Gaming Username Generator](/tools/gaming-username-generator)**.

What are you playing or looking to build today?`,
      sources: [
        { title: 'Game Vault Forum — Tools Hub', url: '/tools' },
        { title: 'Game Vault Forum — Games Directory', url: '/games' },
        { title: 'Game Vault Forum — Discussion Boards', url: '/forum' },
      ],
      cardIds: { games: ['elden-ring', 'cyberpunk-2077', 'helldivers-2'], articles: ['art-1', 'art-2'], videos: ['vid-1'], hardware: ['gpu-4070s'] },
      actions: [
        { id: 'act-hi-req', type: 'navigate', label: 'PC Requirements Checker', target: '/tools/pc-game-requirements-checker' },
        { id: 'act-hi-bld', type: 'navigate', label: 'Gaming PC Builder', target: '/tools/gaming-pc-builder' },
        { id: 'act-hi-cat', type: 'navigate', label: 'Browse Games Catalog', target: '/games' },
      ],
    };
  }

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
      reply: `### Welcome to Game Vault Forum (gamevault.forum)

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
        { title: 'Game Vault Forum — FPS / Performance Calculator', url: '/tools/fps-calculator' },
        { title: 'Game Vault Forum — PC Game Requirements Checker', url: '/tools/pc-game-requirements-checker' },
        { title: 'Game Vault Forum — Gaming PC Builder', url: '/tools/gaming-pc-builder' },
      ],
      cardIds: { games: ['cyberpunk-2077'], articles: [], videos: [], hardware: ['gpu-4070s'] },
      actions: [
        { id: 'act-perf-fps', type: 'navigate', label: 'FPS / Bottleneck Calculator', target: '/tools/fps-calculator' },
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
