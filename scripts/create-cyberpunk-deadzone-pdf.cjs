const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createCyberpunkDeadzonePdf() {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const colors = {
    darkBg: rgb(0.04, 0.05, 0.09),
    cardBg: rgb(0.08, 0.10, 0.17),
    accentCyan: rgb(0.02, 0.85, 0.95),
    accentMagenta: rgb(0.95, 0.15, 0.65),
    accentYellow: rgb(0.98, 0.85, 0.15),
    textWhite: rgb(0.96, 0.97, 0.99),
    textMuted: rgb(0.65, 0.70, 0.80),
    border: rgb(0.18, 0.22, 0.35),
    lineDivider: rgb(0.15, 0.19, 0.30)
  };

  const pages = [];
  const createNewPage = () => {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: colors.darkBg
    });

    // Top neon cyan bar
    page.drawRectangle({
      x: 0,
      y: 837.89,
      width: 595.28,
      height: 4,
      color: colors.accentCyan
    });

    // Header branding
    page.drawText('GAME VAULT', {
      x: 40,
      y: 812,
      size: 10,
      font: helveticaBold,
      color: colors.accentCyan
    });

    page.drawText('HARDWARE & CONTROLLER GUIDE  |  CYBERPUNK 2077 PATCH 2.2+', {
      x: 120,
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

    page.drawText('Game Vault © 2026  •  Hardware & Deadzone Optimization Protocol', {
      x: 40,
      y: 22,
      size: 7.5,
      font: helvetica,
      color: colors.textMuted
    });

    const pageNum = pages.length + 1;
    page.drawText(`Page ${pageNum}`, {
      x: 520,
      y: 22,
      size: 7.5,
      font: helveticaBold,
      color: colors.accentCyan
    });

    pages.push(page);
    return page;
  };

  // ================= PAGE 1 =================
  const p1 = createNewPage();
  let y = 770;

  // Category Badge
  p1.drawRectangle({
    x: 40,
    y: y - 5,
    width: 145,
    height: 18,
    color: rgb(0.04, 0.25, 0.35),
    borderColor: colors.accentCyan,
    borderWidth: 1
  });
  p1.drawText('CONTROLLER & HARDWARE GUIDE', {
    x: 46,
    y: y,
    size: 7.2,
    font: helveticaBold,
    color: colors.accentCyan
  });

  y -= 35;
  p1.drawText('Cyberpunk 2077: Controller Deadzone', {
    x: 40,
    y: y,
    size: 19,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 22;
  p1.drawText('Settings for Patch 2.2 and Later', {
    x: 40,
    y: y,
    size: 16,
    font: helveticaBold,
    color: colors.accentMagenta
  });

  y -= 20;
  p1.drawText('Author: Joel Ayuba (Founder & Lead Technical Analyst)  •  Updated: September 28, 2026', {
    x: 40,
    y: y,
    size: 8.5,
    font: helveticaOblique,
    color: colors.textMuted
  });

  y -= 30;
  // Version Note Card
  p1.drawRectangle({
    x: 40,
    y: y - 75,
    width: 515,
    height: 80,
    color: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1
  });
  p1.drawText('VERSION NOTE: PATCH 2.1 RECALIBRATION & 2.2+ PRECISION', {
    x: 55,
    y: y - 16,
    size: 8.5,
    font: helveticaBold,
    color: colors.accentYellow
  });
  const vNotes = [
    'Cyberpunk 2077\'s deadzone controls were made significantly more precise in update 2.1 and remain fully relevant',
    'to the 2.2-and-later settings menu. Platform defaults and controller potentiometer wear vary, so use the values',
    'below as a testing profile rather than an inflexible "universal best" setting. Always test for drift before combat.'
  ];
  let vnY = y - 30;
  vNotes.forEach(l => {
    p1.drawText(l, { x: 55, y: vnY, size: 7.5, font: helvetica, color: colors.textWhite });
    vnY -= 12;
  });

  y -= 105;
  p1.drawText('The Aim Frustration: Sluggish Response vs Stick Drift', {
    x: 40,
    y: y,
    size: 12,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 16;
  const introLines = [
    'Cyberpunk 2077 can feel slow on a controller even when the game is running perfectly at 60 or 120 FPS. You move',
    'the right stick, wait for the camera to respond, push harder, and overshoot the target. Lower the deadzone and the',
    'aim feels better—until V starts slowly turning by themselves because the stick is not perfectly centered.',
    '',
    'That trade-off is what makes controller settings frustrating. A deadzone that is too large hides small stick movement',
    'and makes the game feel sluggish. A deadzone that is too small exposes drift, noise, and imperfect physical center.',
    'The best setting is not the lowest number in a guide. It is the lowest value your controller can hold without unwanted movement.'
  ];
  introLines.forEach(line => {
    if (line === '') {
      y -= 6;
      return;
    }
    p1.drawText(line, { x: 40, y, size: 8, font: helvetica, color: colors.textMuted });
    y -= 12;
  });

  y -= 15;
  p1.drawText('The Quick Starting Profile (Neutral Baseline)', {
    x: 40,
    y: y,
    size: 12,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 20;
  // Starting Points Table
  p1.drawRectangle({
    x: 40,
    y: y - 18,
    width: 515,
    height: 20,
    color: rgb(0.12, 0.16, 0.26)
  });
  p1.drawText('Setting', { x: 50, y: y - 12, size: 8, font: helveticaBold, color: colors.accentCyan });
  p1.drawText('Starting Value', { x: 210, y: y - 12, size: 8, font: helveticaBold, color: colors.textWhite });
  p1.drawText('Why & Practical Function', { x: 330, y: y - 12, size: 8, font: helveticaBold, color: colors.accentMagenta });

  y -= 20;
  const startRows = [
    ['Inner Dead Zone', '0.05', 'Responsive on a healthy stick, but not as aggressive as zero'],
    ['Outer Dead Zone', '0.95', 'Reaches full input slightly before the physical edge'],
    ['Horizontal Sensitivity', '10', 'Moderate camera speed for testing and axis comparison'],
    ['Vertical Sensitivity', '10', 'Keeps vertical and horizontal movement equal during calibration'],
    ['Zoom Sensitivity Reduction', '1.00 - 1.50', 'Start neutral, then slow aiming if scoped movement is too fast'],
    ['Response Curve', 'Recommended / Dynamic', 'Use as a baseline before changing advanced acceleration behavior'],
    ['Turning Bonuses', '0 for testing', 'Removes extra acceleration while you isolate stick response']
  ];
  startRows.forEach((row, idx) => {
    const rowBg = idx % 2 === 0 ? rgb(0.07, 0.10, 0.16) : rgb(0.09, 0.12, 0.20);
    p1.drawRectangle({ x: 40, y: y - 16, width: 515, height: 18, color: rowBg });
    p1.drawText(row[0], { x: 50, y: y - 11, size: 7.5, font: helveticaBold, color: colors.textWhite });
    p1.drawText(row[1], { x: 210, y: y - 11, size: 7.5, font: helveticaBold, color: colors.accentCyan });
    p1.drawText(row[2], { x: 330, y: y - 11, size: 7.2, font: helvetica, color: colors.textMuted });
    y -= 18;
  });

  // ================= PAGE 2 =================
  const p2 = createNewPage();
  y = 770;

  p2.drawText('Why Platform Defaults Matter (CDPR Official Guidance)', {
    x: 40,
    y: y,
    size: 13,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 18;
  const cdprLines = [
    'CD PROJEKT RED announced that deadzone settings were made more precise in update 2.1 and noted that some',
    'players could experience stick drift after the change. Official support guidance established new platform defaults:',
    '• PlayStation 5 (DualSense): Official default is 0.15.',
    '• Xbox Series X|S & PC / Steam Deck: Official default is 0.35.',
    'These values are crucial reference points when diagnosing drift. If a controller only behaves correctly at 0.35, it may be',
    'worn or exposing hardware calibration tolerances that a lower value makes visible. Test from the default and lower gradually.'
  ];
  cdprLines.forEach(l => {
    p2.drawText(l, { x: 40, y, size: 8, font: helvetica, color: colors.textMuted });
    y -= 13;
  });

  y -= 15;
  p2.drawText('The Five-Minute Controller Test & Calibration Protocol', {
    x: 40,
    y: y,
    size: 13,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 18;
  const testSteps = [
    'Step 1: Load a Quiet, Repeatable Location — Pick a safe apartment or alley. Stand still, release both sticks, and watch.',
    'Step 2: Find the Lowest Stable Inner Value — Start at 0.15 or 0.35. Lower in 0.02 steps until drift appears, then bump up +0.02.',
    'Step 3: Check Micro-Aim at Distance — Aim at a distant antenna or lamp. Make tiny left-right adjustments. Avoid sudden jumps.',
    'Step 4: Test the Outer Edge & Turn Speed — Push stick slowly to rim. If maximum turning occurs too early, raise outer deadzone to 0.98.',
    'Step 5: Calibrate Zoom Sensitivity & Response Curve — Adjust scoped reduction so sniper/precision weapons do not twitch.'
  ];
  testSteps.forEach(st => {
    p2.drawText(st, { x: 40, y, size: 8, font: helvetica, color: colors.textWhite });
    y -= 14;
  });

  y -= 25;
  p2.drawText('Platform-Specific Starting Advice Matrix', {
    x: 40,
    y: y,
    size: 12,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 20;
  p2.drawRectangle({
    x: 40,
    y: y - 18,
    width: 515,
    height: 20,
    color: rgb(0.12, 0.16, 0.26)
  });
  p2.drawText('Platform', { x: 50, y: y - 12, size: 8, font: helveticaBold, color: colors.accentCyan });
  p2.drawText('Starting Value', { x: 170, y: y - 12, size: 8, font: helveticaBold, color: colors.textWhite });
  p2.drawText('If Drift Occurs', { x: 310, y: y - 12, size: 8, font: helveticaBold, color: colors.accentMagenta });

  y -= 20;
  const platformRows = [
    ['PS5 / DualSense', 'Test 0.15 default, lower to 0.05-0.08 on healthy stick', 'Raise in 0.02 steps until camera stays static'],
    ['Xbox Series X|S', 'Test 0.35 default, try 0.10-0.15 on newer controllers', 'Treat 0.35 as the safe hardware reference baseline'],
    ['PC (Steam Deck / Native)', 'Test 0.05 native, verify Steam Input overlay state', 'Ensure Steam Input & in-game deadzones do not stack'],
    ['Third-Party / Hall Effect', '0.02 - 0.04 (Hall Effect magnetic sensors resist wear)', 'Virtually zero drift; test outer edge at 0.96-0.98']
  ];
  platformRows.forEach((pRow, idx) => {
    const rowBg = idx % 2 === 0 ? rgb(0.07, 0.10, 0.16) : rgb(0.09, 0.12, 0.20);
    p2.drawRectangle({ x: 40, y: y - 16, width: 515, height: 18, color: rowBg });
    p2.drawText(pRow[0], { x: 50, y: y - 11, size: 7.2, font: helveticaBold, color: colors.textWhite });
    p2.drawText(pRow[1], { x: 170, y: y - 11, size: 7.2, font: helvetica, color: colors.accentCyan });
    p2.drawText(pRow[2], { x: 310, y: y - 11, size: 7, font: helvetica, color: colors.textMuted });
    y -= 18;
  });

  const pdfBytes = await pdfDoc.save();
  const outputDir = path.join(__dirname, '../public/documents');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'cyberpunk-2077-controller-deadzone-settings-2-2.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Successfully generated PDF:', outputPath, 'Bytes:', pdfBytes.length);

  const distDir = path.join(__dirname, '../dist/documents');
  if (fs.existsSync(path.join(__dirname, '../dist'))) {
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.writeFileSync(path.join(distDir, 'cyberpunk-2077-controller-deadzone-settings-2-2.pdf'), pdfBytes);
    console.log('Also copied to dist/documents');
  }
}

createCyberpunkDeadzonePdf().catch(err => {
  console.error(err);
  process.exit(1);
});
