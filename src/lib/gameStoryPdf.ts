import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { GeneratedGameStoryReport } from '../types/gameStory';

export async function generateGameStoryPdf(report: GeneratedGameStoryReport): Promise<Uint8Array> {
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

  const pages: any[] = [];
  let currentPageIndex = 0;

  const createPage = () => {
    currentPageIndex++;
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: colors.darkBg
    });

    // Top purple accent
    page.drawRectangle({
      x: 0,
      y: 837.89,
      width: 595.28,
      height: 4,
      color: colors.accentPurple
    });

    // Header branding
    page.drawText('GAME VAULT FORUM', {
      x: 40,
      y: 812,
      size: 9.5,
      font: helveticaBold,
      color: colors.accentCyan
    });

    page.drawText('GAME STORY & OVERVIEW GENERATOR  |  FACTUAL ARCHIVE', {
      x: 170,
      y: 812,
      size: 7.5,
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

    page.drawText('GAME VAULT FORUM  |  https://www.gamevault.forum/tools/game-story-overview-generator', {
      x: 40,
      y: 22,
      size: 7,
      font: helvetica,
      color: colors.textMuted
    });

    pages.push(page);
    return page;
  };

  // Helper for multi-line text wrapping
  const drawWrappedText = (
    page: any,
    text: string,
    x: number,
    startY: number,
    fontSize: number,
    font: any,
    color: any,
    maxWidth: number,
    lineHeight: number
  ): number => {
    let y = startY;
    const paragraphs = text.split('\n');
    for (const p of paragraphs) {
      if (p.trim() === '') {
        y -= lineHeight * 0.6;
        continue;
      }
      const words = p.split(' ');
      let currentLine = '';
      for (const w of words) {
        const testLine = currentLine ? `${currentLine} ${w}` : w;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width > maxWidth && currentLine) {
          page.drawText(currentLine, { x, y, size: fontSize, font, color });
          y -= lineHeight;
          currentLine = w;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        page.drawText(currentLine, { x, y, size: fontSize, font, color });
        y -= lineHeight;
      }
    }
    return y;
  };

  // --- Page 1: Overview & Metadata ---
  let page = createPage();
  let curY = 765;

  page.drawText(report.gameTitle, {
    x: 40,
    y: curY,
    size: 20,
    font: helveticaBold,
    color: colors.textWhite
  });
  curY -= 22;

  page.drawText(`Story, Narrative Structure & Verified Game Overview (Version ${report.reportVersion})`, {
    x: 40,
    y: curY,
    size: 11,
    font: helveticaBold,
    color: colors.accentPurple
  });
  curY -= 16;

  page.drawText(`Generated on: ${report.generatedAt}  |  Confidence: ${report.confidenceLevel}  |  Strict Accuracy: ${report.strictAccuracyMode ? 'Enabled' : 'Disabled'}`, {
    x: 40,
    y: curY,
    size: 8,
    font: helveticaOblique,
    color: colors.textMuted
  });
  curY -= 24;

  // Metadata Card
  page.drawRectangle({
    x: 40,
    y: curY - 110,
    width: 515.28,
    height: 110,
    color: colors.cardBg,
    borderColor: colors.accentCyan,
    borderWidth: 1
  });

  page.drawText('VERIFIED GAME INFORMATION', {
    x: 52,
    y: curY - 18,
    size: 9,
    font: helveticaBold,
    color: colors.accentCyan
  });

  const metaRows = [
    `Developer: ${report.gameInfo.developer}  |  Publisher: ${report.gameInfo.publisher}`,
    `Release Date: ${report.gameInfo.releaseDate} (${report.gameInfo.releaseYear})  |  Genre: ${report.gameInfo.genre}`,
    `Platforms: ${report.gameInfo.platforms.join(', ')}`,
    `Game Modes: ${report.gameInfo.gameModes.join(', ')}  |  Engine: ${report.gameInfo.engine || 'Verified In-House'}`,
    `Franchise: ${report.gameInfo.franchise || 'Standalone'}`
  ];

  metaRows.forEach((r, idx) => {
    page.drawText(r, {
      x: 52,
      y: curY - 34 - (idx * 14),
      size: 7.5,
      font: helvetica,
      color: colors.textWhite
    });
  });

  curY -= 130;

  // Quick Overview Section
  page.drawText('1. QUICK OVERVIEW', {
    x: 40,
    y: curY,
    size: 11,
    font: helveticaBold,
    color: colors.accentGold
  });
  curY -= 16;

  curY = drawWrappedText(page, report.quickOverview, 40, curY, 8.5, helvetica, colors.textWhite, 515, 12.5);
  curY -= 12;

  // Setting
  page.drawText('2. STORY SETTING', {
    x: 40,
    y: curY,
    size: 11,
    font: helveticaBold,
    color: colors.accentGold
  });
  curY -= 16;

  curY = drawWrappedText(page, report.setting, 40, curY, 8.5, helvetica, colors.textWhite, 515, 12.5);
  curY -= 12;

  // Story Premise
  page.drawText('3. STORY PREMISE', {
    x: 40,
    y: curY,
    size: 11,
    font: helveticaBold,
    color: colors.accentGold
  });
  curY -= 16;

  curY = drawWrappedText(page, report.storyPremise, 40, curY, 8.5, helvetica, colors.textWhite, 515, 12.5);

  // --- Page 2: Characters & Main Story ---
  page = createPage();
  curY = 765;

  page.drawText('4. MAIN CHARACTERS', {
    x: 40,
    y: curY,
    size: 12,
    font: helveticaBold,
    color: colors.accentPurple
  });
  curY -= 18;

  for (const c of report.characters.slice(0, 4)) {
    page.drawText(`• ${c.name} — ${c.role}`, {
      x: 45,
      y: curY,
      size: 9,
      font: helveticaBold,
      color: colors.accentCyan
    });
    curY -= 12;

    const charDetails = `Affiliation: ${c.affiliation || 'Independent'} | Relationship: ${c.relationship || 'N/A'}`;
    page.drawText(charDetails, {
      x: 55,
      y: curY,
      size: 7.5,
      font: helveticaOblique,
      color: colors.textMuted
    });
    curY -= 11;

    curY = drawWrappedText(page, c.storyImportance, 55, curY, 8, helvetica, colors.textWhite, 500, 11);
    curY -= 6;
  }

  curY -= 8;
  page.drawText(`5. MAIN STORY (${report.spoilerLevel.toUpperCase()} SPOILERS)`, {
    x: 40,
    y: curY,
    size: 12,
    font: helveticaBold,
    color: colors.accentPurple
  });
  curY -= 16;

  curY = drawWrappedText(page, report.mainStory, 40, curY, 8.5, helvetica, colors.textWhite, 515, 12.5);

  // --- Page 3: Gameplay, Themes, Timeline, Ending & Sources ---
  page = createPage();
  curY = 765;

  page.drawText('6. GAMEPLAY OVERVIEW', {
    x: 40,
    y: curY,
    size: 11,
    font: helveticaBold,
    color: colors.accentGold
  });
  curY -= 16;

  curY = drawWrappedText(page, report.gameplayOverview, 40, curY, 8.5, helvetica, colors.textWhite, 515, 12.5);
  curY -= 12;

  page.drawText('7. CORE THEMES', {
    x: 40,
    y: curY,
    size: 11,
    font: helveticaBold,
    color: colors.accentGold
  });
  curY -= 14;

  for (const t of report.storyThemes) {
    page.drawText(`• ${t}`, { x: 45, y: curY, size: 8, font: helvetica, color: colors.textWhite });
    curY -= 12;
  }
  curY -= 10;

  if (report.timeline && report.timeline.length > 0) {
    page.drawText('8. STORY TIMELINE', {
      x: 40,
      y: curY,
      size: 11,
      font: helveticaBold,
      color: colors.accentCyan
    });
    curY -= 14;

    for (const t of report.timeline.slice(0, 5)) {
      page.drawText(`${t.order}. [${t.stage.toUpperCase()}] ${t.title}`, {
        x: 45,
        y: curY,
        size: 8,
        font: helveticaBold,
        color: colors.textWhite
      });
      curY -= 11;
      curY = drawWrappedText(page, t.description, 55, curY, 7.5, helvetica, colors.textMuted, 490, 10.5);
      curY -= 4;
    }
  }

  if (report.ending && curY > 200) {
    page.drawText('9. ENDING EXPLANATION', {
      x: 40,
      y: curY,
      size: 11,
      font: helveticaBold,
      color: colors.accentPurple
    });
    curY -= 14;
    curY = drawWrappedText(page, report.ending, 40, curY, 8, helvetica, colors.textWhite, 515, 11.5);
    curY -= 10;
  }

  // Sources Card
  page.drawRectangle({
    x: 40,
    y: 70,
    width: 515.28,
    height: 110,
    color: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1
  });

  page.drawText('SOURCES USED & VERIFIED GROUNDING', {
    x: 52,
    y: 165,
    size: 8.5,
    font: helveticaBold,
    color: colors.accentCyan
  });

  report.sources.slice(0, 3).forEach((s, idx) => {
    page.drawText(`• [${s.tierLabel}] ${s.sourceName} — ${s.pageTitle}`, {
      x: 52,
      y: 150 - (idx * 16),
      size: 7,
      font: helveticaBold,
      color: colors.textWhite
    });
    page.drawText(`  URL: ${s.url} | Grounding: ${s.informationUsed}`, {
      x: 52,
      y: 140 - (idx * 16),
      size: 6.5,
      font: helvetica,
      color: colors.textMuted
    });
  });

  page.drawText(report.disclaimer, {
    x: 52,
    y: 80,
    size: 6,
    font: helveticaOblique,
    color: colors.textMuted
  });

  // Stamp total pages on all pages
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.drawText(`Page ${idx + 1} of ${totalPages}`, {
      x: 495,
      y: 22,
      size: 7.5,
      font: helvetica,
      color: colors.textMuted
    });
  });

  return await pdfDoc.save();
}
