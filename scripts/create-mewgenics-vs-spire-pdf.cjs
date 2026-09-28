const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createMewgenicsVsSpirePdf() {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const colors = {
    darkBg: rgb(0.04, 0.05, 0.09),
    cardBg: rgb(0.08, 0.10, 0.17),
    accentCyan: rgb(0.02, 0.85, 0.95),
    accentPurple: rgb(0.70, 0.35, 0.95),
    accentGold: rgb(0.98, 0.82, 0.20),
    textWhite: rgb(0.96, 0.97, 0.99),
    textMuted: rgb(0.65, 0.70, 0.80),
    border: rgb(0.18, 0.22, 0.35),
    lineDivider: rgb(0.15, 0.19, 0.30)
  };

  const pages = [];
  const createNewPage = (pageNum, totalPages = 4) => {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: colors.darkBg
    });

    // Top purple-cyan gradient/accent bar
    page.drawRectangle({
      x: 0,
      y: 837.89,
      width: 595.28,
      height: 4,
      color: colors.accentPurple
    });

    // Header branding
    page.drawText('GAME VAULT EDITORIAL', {
      x: 40,
      y: 812,
      size: 10,
      font: helveticaBold,
      color: colors.accentCyan
    });

    page.drawText('ROGUELITE COMPARISON & BUYER GUIDE  |  2026 RELEASES', {
      x: 180,
      y: 812,
      size: 8,
      font: helvetica,
      color: colors.textMuted
    });

    page.drawLine({
      start: { x: 40, y: 802 },
      end: { x: 555.28, y: 802 },
      thickness: 0.8,
      color: colors.lineDivider
    });

    // Footer
    page.drawLine({
      start: { x: 40, y: 35 },
      end: { x: 555.28, y: 35 },
      thickness: 0.8,
      color: colors.lineDivider
    });

    page.drawText('GAME VAULT FORUM  |  https://www.gamevault.forum', {
      x: 40,
      y: 22,
      size: 8,
      font: helvetica,
      color: colors.textMuted
    });

    page.drawText(`Page ${pageNum} of ${totalPages}`, {
      x: 495,
      y: 22,
      size: 8,
      font: helvetica,
      color: colors.textMuted
    });

    pages.push(page);
    return page;
  };

  // --- PAGE 1: Overview & Executive Summary ---
  const page1 = createNewPage(1);

  page1.drawText('Mewgenics vs Slay the Spire 2', {
    x: 40,
    y: 765,
    size: 22,
    font: helveticaBold,
    color: colors.textWhite
  });

  page1.drawText('Which Roguelite Fits Your Free Time?', {
    x: 40,
    y: 742,
    size: 15,
    font: helveticaBold,
    color: colors.accentPurple
  });

  page1.drawText('Published: September 2026  |  Author: Joel Ayuba  |  Game Vault In-Depth Comparison', {
    x: 40,
    y: 724,
    size: 8.5,
    font: helveticaOblique,
    color: colors.textMuted
  });

  // Callout Card: Status Note
  page1.drawRectangle({
    x: 40,
    y: 648,
    width: 515.28,
    height: 60,
    color: colors.cardBg,
    borderColor: colors.accentCyan,
    borderWidth: 1
  });

  page1.drawText('LAUNCH STATUS & SCOPE NOTE (2026)', {
    x: 52,
    y: 692,
    size: 8.5,
    font: helveticaBold,
    color: colors.accentCyan
  });

  const statusText = [
    '• Mewgenics: Launched full PC release on Steam on February 10, 2026 (Tactical Party-and-Breeding Roguelike).',
    '• Slay the Spire 2: Launched Steam Early Access on March 5, 2026 (Run-Based Deckbuilder with 4-player co-op).',
    '• Focus: Design architecture, time investment, cognitive load, failure costs, and session friction.'
  ];
  statusText.forEach((line, i) => {
    page1.drawText(line, {
      x: 52,
      y: 677 - (i * 13),
      size: 8,
      font: helvetica,
      color: colors.textWhite
    });
  });

  // Body text Page 1
  const p1Intro = [
    'You have forty minutes before bed. That sounds like enough time for a roguelite run, but it is not',
    'enough time for every roguelite to respect your evening.',
    '',
    'In one game, you can make a few decisions, close it, and return later without losing the thread.',
    'In another, you may start by choosing a team, then spend the next hour thinking about a route, a build,',
    'a boss, and whether the promising run is too valuable to abandon.',
    '',
    'Both games may use the word "roguelike" in their descriptions. They do not ask the same thing from your',
    'attention. That is the real choice between Mewgenics and Slay the Spire 2. It is not simply cats versus',
    'cards, or a new game versus a sequel.',
    '',
    'Mewgenics is a tactical party-and-breeding roguelike built around managing a living roster between',
    'grid battles. Slay the Spire 2 is a run-based deckbuilder built around route decisions, card interactions,',
    'relics, and repeated ascents. One asks you to care about a team over generations. The other asks you to',
    'make the best possible deck from imperfect offers.',
    '',
    'If you want compact, sharply focused decision-making, Slay the Spire 2 is the easier fit for short and',
    'repeatable sessions. If you want a larger hobby game with a home base, cat management, tactical maps,',
    'and long-term experimentation, Mewgenics offers the deeper time sink. Neither is automatically better.',
    'The right choice depends on what kind of free time you actually have.'
  ];

  let curY = 628;
  for (const line of p1Intro) {
    if (line === '') {
      curY -= 6;
      continue;
    }
    page1.drawText(line, {
      x: 40,
      y: curY,
      size: 9.5,
      font: helvetica,
      color: colors.textWhite
    });
    curY -= 14;
  }

  // --- Comparison Matrix Card on Page 1 Bottom ---
  page1.drawRectangle({
    x: 40,
    y: 140,
    width: 515.28,
    height: 195,
    color: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1
  });

  page1.drawText('THE SHORT ANSWER: QUICK DECISION MATRIX', {
    x: 52,
    y: 318,
    size: 10,
    font: helveticaBold,
    color: colors.accentGold
  });

  const matrix = [
    { want: 'A clear card-and-route puzzle', choose: 'Slay the Spire 2', why: 'Each run centers on deck construction, pathing, and encounter adaptation' },
    { want: 'Persistent roster & home management', choose: 'Mewgenics', why: 'Runs feed into breeding, equipment, food, stores, and future parties' },
    { want: 'Easy to pause mentally between sessions', choose: 'Slay the Spire 2', why: 'Resume your deck & route problem without managing a whole household' },
    { want: 'A long-term strategy hobby', choose: 'Mewgenics', why: 'Expands through cats, mutations, classes, gear, upgrades, and generations' },
    { want: 'Multiplayer experimentation', choose: 'Slay the Spire 2', why: 'Early Access features integrated co-op for up to four players' },
    { want: 'A finished-feeling solo campaign today', choose: 'Mewgenics', why: 'Launched as a full PC release; Slay the Spire 2 is ongoing Early Access' }
  ];

  let matrixY = 296;
  for (const row of matrix) {
    page1.drawText(row.want, { x: 52, y: matrixY, size: 8, font: helveticaBold, color: colors.textWhite });
    page1.drawText(row.choose, { x: 220, y: matrixY, size: 8, font: helveticaBold, color: row.choose === 'Mewgenics' ? colors.accentGold : colors.accentCyan });
    page1.drawText(row.why, { x: 300, y: matrixY, size: 7.5, font: helvetica, color: colors.textMuted });
    page1.drawLine({
      start: { x: 52, y: matrixY - 5 },
      end: { x: 540, y: matrixY - 5 },
      thickness: 0.5,
      color: colors.lineDivider
    });
    matrixY -= 24;
  }

  // --- PAGE 2: Deep Dive into Mechanics & Time Sinks ---
  const page2 = createNewPage(2);

  page2.drawText('Mewgenics: A Roster Game Disguised as a Run-Based Roguelike', {
    x: 40,
    y: 770,
    size: 12.5,
    font: helveticaBold,
    color: colors.accentGold
  });

  const p2Mewgenics = [
    'Mewgenics begins with a group of cats, but the important decisions continue after the tactical battle ends.',
    'You choose a party, assign tags that shape their roles and starting abilities, move through a node-based area,',
    'collect food and equipment, and decide whether to return home or continue into greater danger.',
    '',
    'At home, the game opens into another layer. Cats can be bred to pass along useful traits and abilities, sent to',
    'characters who unlock benefits, placed into a roster for later runs, or used to improve household resources.',
    'A run is therefore not isolated from the next one. The success or failure of one group directly changes your future options.',
    '',
    'The combat itself is turn-based and played on a square grid. Movement, basic attacks, skills, line of sight, hazards,',
    'turn order, and exhaustion all matter. That makes each battle more spatially demanding than a typical card turn.',
    'You are not only asking "Which card is strongest?" You are asking where each cat should stand, whether a target',
    'can reach them, whether a corpse can revive, and whether the party has enough resources to survive the next fight.',
    '',
    'The cost is mental overhead. Between runs, there are more decisions to remember: food, equipment, breeding,',
    'shop stock, storage, home upgrades, party composition, and the consequences of losing a group.'
  ];

  curY = 748;
  for (const line of p2Mewgenics) {
    if (line === '') { curY -= 5; continue; }
    page2.drawText(line, { x: 40, y: curY, size: 9, font: helvetica, color: colors.textWhite });
    curY -= 13.5;
  }

  curY -= 10;
  page2.drawText('Slay the Spire 2: A Focused Decision Machine', {
    x: 40,
    y: curY,
    size: 12.5,
    font: helveticaBold,
    color: colors.accentCyan
  });
  curY -= 20;

  const p2Spire = [
    'Slay the Spire 2 keeps the classic deckbuilding structure at the center. You choose a character, select branching paths,',
    'fight enemies, gain cards and relics, visit events and shops, and assemble a deck that can survive escalating encounters.',
    '',
    'The sequel launched in Early Access with new and returning characters, new environments and enemies, ongoing content',
    'additions, and a new co-op mode for up to four players. Those details matter: you are buying into an active development process.',
    '',
    'The complexity comes from relationships between cards, relics, resources, route choices, enemy intent, and deck density.',
    'A card is not simply good or bad. Its value depends on what your deck already does, how much energy you have, which enemies',
    'are ahead, and whether adding it improves the plan or makes the deck less consistent.',
    '',
    'That creates a very different kind of concentration. You may spend a full turn considering whether a card prevents more',
    'damage than it costs, but you do not also have to decide which cat should breed or whether food reserves support another expedition.'
  ];

  for (const line of p2Spire) {
    if (line === '') { curY -= 5; continue; }
    page2.drawText(line, { x: 40, y: curY, size: 9, font: helvetica, color: colors.textWhite });
    curY -= 13.5;
  }

  // --- PAGE 3: Free Time, Short Sessions, Learning Curve, and Failure ---
  const page3 = createNewPage(3);

  page3.drawText('Which Game is Better for Short Sessions?', {
    x: 40,
    y: 770,
    size: 12.5,
    font: helveticaBold,
    color: colors.textWhite
  });

  const p3Short = [
    'Slay the Spire 2 has the clearer advantage for short sessions, especially if you already enjoy card games.',
    'Its choices are concentrated inside the run, and you can usually identify what you were trying to do when you return.',
    'You are tuning one deck rather than remembering an entire household\'s needs.',
    '',
    'Mewgenics can also work in short bursts because individual nodes and battles are discrete. The difficulty is the',
    'context around them: a "quick session" can easily expand into a longer planning session when you want to sort equipment,',
    'decide who should breed, examine a mutation, restock food, or prepare a new party.'
  ];

  curY = 748;
  for (const line of p3Short) {
    if (line === '') { curY -= 5; continue; }
    page3.drawText(line, { x: 40, y: curY, size: 9, font: helvetica, color: colors.textWhite });
    curY -= 13.5;
  }

  curY -= 12;
  page3.drawText('Learning Curve & Failure Cost Comparison', {
    x: 40,
    y: curY,
    size: 12.5,
    font: helveticaBold,
    color: colors.accentPurple
  });
  curY -= 20;

  const p3Failure = [
    'Learning Curve: Slay the Spire 2 is easier to understand structurally (fight, choose reward, path, shop, climb). The depth',
    'lies in card evaluation and enemy intent. Mewgenics introduces many interacting systems upfront: positioning, movement',
    'points, line-of-sight, mutations, food, breeding, and persistent roster loss. It has a steeper initial informational load.',
    '',
    'Failure in Slay the Spire 2 ends the run cleanly. You identify where the build failed, reset, and immediately receive fresh offers.',
    'Failure in Mewgenics can permanently affect equipment, food reserves, quest items, and beloved cats. The emotional and',
    'strategic loss is heavier—a feature for players who love high-stakes emergent drama, but painful for clean resets.'
  ];

  for (const line of p3Failure) {
    if (line === '') { curY -= 5; continue; }
    page3.drawText(line, { x: 40, y: curY, size: 9, font: helvetica, color: colors.textWhite });
    curY -= 13.5;
  }

  curY -= 12;
  page3.drawText('Tone, Content Comfort & Co-Op Social Dynamics', {
    x: 40,
    y: curY,
    size: 12.5,
    font: helveticaBold,
    color: colors.accentCyan
  });
  curY -= 20;

  const p3Social = [
    'Tone: Mewgenics carries Edmund McMillen and Tyler Glaiel\'s distinctively dark, grotesque, and irreverent humor. While',
    'kitten-making can be censored in settings, its body horror and surreal themes remain polarizing.',
    'Slay the Spire 2 offers a more universal dark-fantasy deckbuilder aesthetic that is universally easy to recommend.',
    '',
    'Multiplayer: Slay the Spire 2 introduced up to 4-player cooperative play in Early Access with team synergies and shared routes.',
    'Mewgenics is an intensely personal solo management simulation and tactical laboratory.'
  ];

  for (const line of p3Social) {
    if (line === '') { curY -= 5; continue; }
    page3.drawText(line, { x: 40, y: curY, size: 9, font: helvetica, color: colors.textWhite });
    curY -= 13.5;
  }

  // --- PAGE 4: Buying Recommendations, Verdict & Citations ---
  const page4 = createNewPage(4);

  page4.drawText('The Decision by Player Type & Buying Guide', {
    x: 40,
    y: 770,
    size: 13,
    font: helveticaBold,
    color: colors.accentGold
  });

  // Dual Recommendation Boxes
  page4.drawRectangle({
    x: 40,
    y: 615,
    width: 250,
    height: 135,
    color: colors.cardBg,
    borderColor: colors.accentGold,
    borderWidth: 1
  });

  page4.drawText('CHOOSE MEWGENICS IF...', {
    x: 50,
    y: 730,
    size: 9.5,
    font: helveticaBold,
    color: colors.accentGold
  });

  const mewgenicsBullets = [
    '• You want a long-form strategy hobby with a home base.',
    '• You love emergent storytelling through genetics & loss.',
    '• You enjoy tactical grid combat & spatial positioning.',
    '• You have weekends or unhurried 1-2 hour sessions.',
    '• "I want to build the best team over many runs."'
  ];
  mewgenicsBullets.forEach((b, i) => {
    page4.drawText(b, { x: 50, y: 710 - (i * 16), size: 7.5, font: helvetica, color: colors.textWhite });
  });

  page4.drawRectangle({
    x: 305,
    y: 615,
    width: 250,
    height: 135,
    color: colors.cardBg,
    borderColor: colors.accentCyan,
    borderWidth: 1
  });

  page4.drawText('CHOOSE SLAY THE SPIRE 2 IF...', {
    x: 315,
    y: 730,
    size: 9.5,
    font: helveticaBold,
    color: colors.accentCyan
  });

  const spireBullets = [
    '• You want clean run structures & rapid 30-45m sessions.',
    '• You love pure card synergy, relics, and drafting.',
    '• You want to play 1-4 player co-op with friends.',
    '• You prefer clean resets upon defeat without upkeep.',
    '• "I want to make the best decisions in this run."'
  ];
  spireBullets.forEach((b, i) => {
    page4.drawText(b, { x: 315, y: 710 - (i * 16), size: 7.5, font: helvetica, color: colors.textWhite });
  });

  // Final Verdict Card
  page4.drawRectangle({
    x: 40,
    y: 430,
    width: 515.28,
    height: 165,
    color: colors.cardBg,
    borderColor: colors.accentPurple,
    borderWidth: 1
  });

  page4.drawText('FINAL VERDICT: CHOOSE THE SHAPE OF YOUR ATTENTION', {
    x: 52,
    y: 575,
    size: 10,
    font: helveticaBold,
    color: colors.accentPurple
  });

  const verdictLines = [
    'Mewgenics and Slay the Spire 2 overlap in genre, but they are not competing for exactly the same player mood.',
    'Mewgenics is a broader, stranger, more persistent tactical project. Slay the Spire 2 is a sharper deckbuilding',
    'climb built for repeated decisions and now supports co-op in Early Access.',
    '',
    'For short, focused sessions, Slay the Spire 2 is the better fit. For long-term roster management and tactical',
    'experimentation, Mewgenics is the stronger choice. For players who want both, they complement each other',
    'unusually well: one asks you to solve a deck, the other asks you to care about a family of cats.',
    '',
    'The best question is not which game has more content. It is which game matches the way your free time actually arrives.'
  ];

  let vy = 555;
  for (const vl of verdictLines) {
    if (vl === '') { vy -= 4; continue; }
    page4.drawText(vl, { x: 52, y: vy, size: 8.5, font: helvetica, color: colors.textWhite });
    vy -= 13;
  }

  // References & Verification
  page4.drawText('REFERENCES & EDITORIAL CITATIONS', {
    x: 40,
    y: 395,
    size: 9,
    font: helveticaBold,
    color: colors.textMuted
  });

  const refs = [
    '[1] Mewgenics on Steam (Launched Feb 10, 2026 - Edmund McMillen & Tyler Glaiel)',
    '[2] Slay the Spire 2 on Steam (Launched Early Access March 5, 2026 - Mega Crit)',
    '[3] Mega Crit Official Early Access Feature & Co-Op Announcement (4-Player Multiplayer)',
    '[4] Siliconera & Game Vault Editorial: Mewgenics Roster Mechanics & Breeding Strategy Loop',
    '[5] Steam Community & Reddit Telemetry: Average roguelite run length and session pause analysis'
  ];

  let ry = 378;
  for (const r of refs) {
    page4.drawText(r, { x: 40, y: ry, size: 7.5, font: helvetica, color: colors.textMuted });
    ry -= 13;
  }

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const outputDir = path.join(__dirname, '../public/documents');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'mewgenics-vs-slay-the-spire-2-free-time.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Saved PDF to ${outputPath} (${pdfBytes.length} bytes)`);

  const distDir = path.join(__dirname, '../dist/documents');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'mewgenics-vs-slay-the-spire-2-free-time.pdf'), pdfBytes);
    console.log(`Copied PDF to dist`);
  }
}

createMewgenicsVsSpirePdf().catch(err => {
  console.error('Error creating PDF:', err);
  process.exit(1);
});
