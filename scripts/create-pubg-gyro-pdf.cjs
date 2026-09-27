const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPubgGyroPdf() {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const colors = {
    darkBg: rgb(0.04, 0.06, 0.10),
    cardBg: rgb(0.08, 0.11, 0.18),
    accentGreen: rgb(0.10, 0.85, 0.45),
    accentCyan: rgb(0.02, 0.78, 0.88),
    textWhite: rgb(0.96, 0.97, 0.99),
    textMuted: rgb(0.65, 0.70, 0.80),
    border: rgb(0.18, 0.23, 0.35),
    lineDivider: rgb(0.15, 0.20, 0.30)
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

    // Top accent bar
    page.drawRectangle({
      x: 0,
      y: 837.89,
      width: 595.28,
      height: 4,
      color: colors.accentGreen
    });

    // Header branding
    page.drawText('GAME VAULT', {
      x: 40,
      y: 812,
      size: 10,
      font: helveticaBold,
      color: colors.accentGreen
    });

    page.drawText('TACTICAL GUIDE  |  PUBG MOBILE COMPETITIVE SENSITIVITY CALIBRATION', {
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

    page.drawText('Game Vault © 2026  •  Competitive Calibration Protocol', {
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
      color: colors.accentGreen
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
    width: 130,
    height: 18,
    color: rgb(0.04, 0.25, 0.15),
    borderColor: colors.accentGreen,
    borderWidth: 1
  });
  p1.drawText('MOBILE GAMING GUIDE', {
    x: 48,
    y: y,
    size: 7.5,
    font: helveticaBold,
    color: colors.accentGreen
  });

  y -= 35;
  p1.drawText('PUBG Mobile 2026: 3x and 4x Gyro', {
    x: 40,
    y: y,
    size: 19,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 22;
  p1.drawText('Sensitivity for No-Recoil Sprays', {
    x: 40,
    y: y,
    size: 16,
    font: helveticaBold,
    color: colors.accentGreen
  });

  y -= 20;
  p1.drawText('Author: Joel Ayuba (Founder & Lead Technical Analyst)  •  Updated: September 27, 2026', {
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
  p1.drawText('CRITICAL VERSION NOTE: SENSITIVITIES ARE BASELINES, NOT PROMISES', {
    x: 55,
    y: y - 16,
    size: 8.5,
    font: helveticaBold,
    color: colors.accentCyan
  });
  const vNotes = [
    'Sensitivity values are starting points, not universal truths. PUBG Mobile can change its controls, weapon behavior,',
    'and performance across updates, while phone size, frame rate, touch response, gyro hardware, grip, and play style',
    'all change how a number feels. Record your current settings before testing.'
  ];
  let vnY = y - 30;
  vNotes.forEach(l => {
    p1.drawText(l, { x: 55, y: vnY, size: 7.5, font: helvetica, color: colors.textWhite });
    vnY -= 12;
  });

  y -= 105;
  p1.drawText('The Trap of "Zero Recoil" Codes', {
    x: 40,
    y: y,
    size: 12,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 16;
  const trapLines = [
    'A 3x spray can look perfect in someone else\'s highlight and completely fall apart on your phone. You copy the',
    'sensitivity, open the training ground, pull down on the recoil, and watch the crosshair drag below the target.',
    'Raise the number and the spray climbs back up, but now the reticle shakes whenever you try to track sideways.',
    '',
    'That is the trap with "zero recoil" sensitivity videos. They make a personal calibration look like a universal code.',
    'The 3x and 4x sliders are not magic recoil removers; they control how much your device\'s tilt input moves the aim',
    'while you are looking through those scopes. Your weapon, attachments, frame rate, grip, and the way you combine',
    'thumb drag with gyro all affect the result.'
  ];
  trapLines.forEach(line => {
    if (line === '') {
      y -= 6;
      return;
    }
    p1.drawText(line, { x: 40, y, size: 8, font: helvetica, color: colors.textMuted });
    y -= 12;
  });

  y -= 15;
  p1.drawText('The Short Answer: Start Here, Then Calibrate', {
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
  p1.drawText('Setting', { x: 50, y: y - 12, size: 8, font: helveticaBold, color: colors.accentGreen });
  p1.drawText('Starting Point', { x: 230, y: y - 12, size: 8, font: helveticaBold, color: colors.textWhite });
  p1.drawText('Adjustment Range to Test', { x: 380, y: y - 12, size: 8, font: helveticaBold, color: colors.accentCyan });

  y -= 20;
  const startRows = [
    ['3x Gyroscope', '180%', '160 - 200%'],
    ['4x Gyroscope', '160%', '140 - 180%'],
    ['3x ADS Gyroscope', '170 - 180%', '150 - 200%'],
    ['4x ADS Gyroscope', '150 - 160%', '135 - 175%']
  ];
  startRows.forEach((row, idx) => {
    const rowBg = idx % 2 === 0 ? rgb(0.07, 0.10, 0.16) : rgb(0.09, 0.12, 0.20);
    p1.drawRectangle({ x: 40, y: y - 16, width: 515, height: 18, color: rowBg });
    p1.drawText(row[0], { x: 50, y: y - 11, size: 7.5, font: helveticaBold, color: colors.textWhite });
    p1.drawText(row[1], { x: 230, y: y - 11, size: 7.5, font: helveticaBold, color: colors.accentGreen });
    p1.drawText(row[2], { x: 380, y: y - 11, size: 7.5, font: helvetica, color: colors.accentCyan });
    y -= 18;
  });

  // ================= PAGE 2 =================
  const p2 = createNewPage();
  y = 770;

  p2.drawText('What the Three Sensitivity Categories Do', {
    x: 40,
    y: y,
    size: 13,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 18;
  const catDesc = [
    '• Camera Sensitivity: Affects how quickly your view moves when you look around or aim without firing. Influences',
    '  target tracking and scanning, but does not directly control vertical recoil movement while bullets are being fired.',
    '• ADS Sensitivity: Affects touch-drag behavior while aiming and shooting. Matters if you pull the screen with your thumb',
    '  to control recoil. A player who uses gyro heavily may need less ADS input than a thumb-only player.',
    '• Gyroscope Sensitivity: Controls how strongly tilting the device moves the aim. Main slider for wrist/finger recoil compensation.',
    '• ADS Gyroscope Sensitivity: Controls gyro movement specifically while aiming down sights AND firing. This is the value',
    '  players feel most directly during a 3x or 4x automatic spray.'
  ];
  catDesc.forEach(l => {
    p2.drawText(l, { x: 40, y, size: 8, font: helvetica, color: colors.textMuted });
    y -= 13;
  });

  y -= 15;
  p2.drawText('Why 3x and 4x Need Different Settings', {
    x: 40,
    y: y,
    size: 13,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 18;
  const whyDiff = [
    'The 3x and 4x are both common spray scopes, but they are not interchangeable. The 4x magnifies the target more',
    'and makes small hand movements more visible. A value that feels quick and responsive on the 3x may feel nervous',
    'on the 4x, especially when your phone has a large screen or your grip is not anchored.',
    'The 3x is often used for moving targets and medium-range automatic fire. It needs enough response to follow lateral',
    'movement while you pull down against recoil. The 4x is more sensitive to small corrections and is often used at a',
    'slightly greater distance, so many players prefer a lower value (around 160%) to reduce shake.'
  ];
  whyDiff.forEach(l => {
    p2.drawText(l, { x: 40, y, size: 8, font: helvetica, color: colors.textMuted });
    y -= 13;
  });

  y -= 20;
  p2.drawText('A Ten-Minute Calibration Drill', {
    x: 40,
    y: y,
    size: 13,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 18;
  const steps = [
    'Step 1: Choose One Weapon and One Baseline — Pick the rifle or SMG you use most (e.g. M416). Use your normal attachments.',
    'Step 2: Test the 3x at a Repeatable Distance — Pick a mid-range target. Fire full magazines. If spray climbs, raise gyro; if it sinks, lower.',
    'Step 3: Use the Same Method for the 4x — Start near 160%. Use smaller 2-3% increments because 4x magnification amplifies every tilt.',
    'Step 4: Test Movement, Not Only a Still Target — Strafe left and right while spraying. Confirm tracking doesn\'t jitter.',
    'Step 5: Play One Short Match Before Changing Again — Match pressure tests muscle memory. Never change after a single bad spray.'
  ];
  steps.forEach(st => {
    p2.drawText(st, { x: 40, y, size: 8, font: helvetica, color: colors.textWhite });
    y -= 14;
  });

  y -= 25;
  p2.drawText('How to Diagnose the Most Common 3x and 4x Problems', {
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
  p2.drawText('What You Feel', { x: 50, y: y - 12, size: 8, font: helveticaBold, color: colors.accentGreen });
  p2.drawText('Likely Adjustment', { x: 210, y: y - 12, size: 8, font: helveticaBold, color: colors.textWhite });
  p2.drawText('What Else to Check', { x: 370, y: y - 12, size: 8, font: helveticaBold, color: colors.accentCyan });

  y -= 20;
  const diagRows = [
    ['Spray climbs even with steady tilt', 'Raise relevant gyro slightly (+5%)', 'Muzzle brake, vertical grip, 90 FPS'],
    ['Spray sinks below target', 'Lower relevant gyro slightly (-5%)', 'Thumb dragging down too aggressively'],
    ['Crosshair shakes around target', 'Lower sensitivity slightly (-3-5%)', 'Grip anchor, hand tremor, high touch rate'],
    ['Tracking feels slow, recoil stable', 'Raise value in small steps (+3%)', 'Camera sensitivity, target distance'],
    ['3x feels good but 4x is nervous', 'Lower 4x rather than changing 3x', 'Extra magnification amplifies hand shake'],
    ['Sprays work stationary, fail moving', 'Recalibrate with strafing drills', 'Movement button size, claw stability']
  ];
  diagRows.forEach((dRow, idx) => {
    const rowBg = idx % 2 === 0 ? rgb(0.07, 0.10, 0.16) : rgb(0.09, 0.12, 0.20);
    p2.drawRectangle({ x: 40, y: y - 16, width: 515, height: 18, color: rowBg });
    p2.drawText(dRow[0], { x: 50, y: y - 11, size: 7.2, font: helveticaBold, color: colors.textWhite });
    p2.drawText(dRow[1], { x: 210, y: y - 11, size: 7.2, font: helvetica, color: colors.accentGreen });
    p2.drawText(dRow[2], { x: 370, y: y - 11, size: 7, font: helvetica, color: colors.textMuted });
    y -= 18;
  });

  const pdfBytes = await pdfDoc.save();
  const outputDir = path.join(__dirname, '../public/documents');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'pubg-mobile-3x-4x-gyro-sensitivity-2026.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Successfully generated PDF:', outputPath, 'Bytes:', pdfBytes.length);

  const distDir = path.join(__dirname, '../dist/documents');
  if (fs.existsSync(path.join(__dirname, '../dist'))) {
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.writeFileSync(path.join(distDir, 'pubg-mobile-3x-4x-gyro-sensitivity-2026.pdf'), pdfBytes);
    console.log('Also copied to dist/documents');
  }
}

createPubgGyroPdf().catch(err => {
  console.error(err);
  process.exit(1);
});
