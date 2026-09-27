const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createCloudGamingPdf() {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const colors = {
    darkBg: rgb(0.05, 0.07, 0.12),
    cardBg: rgb(0.09, 0.12, 0.20),
    accentCyan: rgb(0.02, 0.78, 0.88),
    accentPurple: rgb(0.65, 0.35, 0.95),
    accentEmerald: rgb(0.06, 0.78, 0.54),
    textWhite: rgb(0.96, 0.97, 0.99),
    textMuted: rgb(0.65, 0.70, 0.80),
    border: rgb(0.18, 0.23, 0.35),
    lineDivider: rgb(0.15, 0.20, 0.30)
  };

  const pages = [];
  const createNewPage = () => {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    // Draw dark background
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: colors.darkBg
    });

    // Top decorative bar
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

    page.drawText('TECHNICAL WHITEPAPER  |  NETWORK & INFRASTRUCTURE ANALYSIS', {
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

    page.drawText('Game Vault © 2026  •  Confidential & Public Engineering Blueprint', {
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

  // Badge
  p1.drawRectangle({
    x: 40,
    y: y - 5,
    width: 145,
    height: 18,
    color: rgb(0.04, 0.25, 0.35),
    borderColor: colors.accentCyan,
    borderWidth: 1
  });
  p1.drawText('HARDWARE & NETWORKING', {
    x: 48,
    y: y,
    size: 7.5,
    font: helveticaBold,
    color: colors.accentCyan
  });

  y -= 35;
  p1.drawText('Cloud Gaming: Latency vs. Bandwidth', {
    x: 40,
    y: y,
    size: 20,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 22;
  p1.drawText('Why Your 1 Gbps Fiber Still Feels Sluggish', {
    x: 40,
    y: y,
    size: 16,
    font: helveticaBold,
    color: colors.accentCyan
  });

  y -= 20;
  p1.drawText('Author: Joel Ayuba (Founder & Lead Technical Analyst)  •  Published: September 27, 2026', {
    x: 40,
    y: y,
    size: 8.5,
    font: helveticaOblique,
    color: colors.textMuted
  });

  y -= 30;
  // Executive Summary Card
  p1.drawRectangle({
    x: 40,
    y: y - 90,
    width: 515,
    height: 95,
    color: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1
  });
  p1.drawText('EXECUTIVE SUMMARY & THE GIGABIT ILLUSION', {
    x: 55,
    y: y - 18,
    size: 9,
    font: helveticaBold,
    color: colors.accentEmerald
  });
  const execSummaryLines = [
    'Gamers frequently upgrade to premium 1 Gbps or 2 Gbps symmetric fiber broadband expecting cloud gaming',
    'to feel indistinguishable from a local console. Yet input latency, cursor floatiness, and micro-stutters persist.',
    'Bandwidth (volume of data in Mbps) and Latency (packet round-trip time in milliseconds) are governed by',
    'fundamentally different physical constraints. While 4K cloud streaming requires only 45-75 Mbps of throughput,',
    'responsiveness is dictated by bufferbloat, router queue delays, last-mile jitter, and client-side hardware decoding.'
  ];
  let sumY = y - 32;
  execSummaryLines.forEach(line => {
    p1.drawText(line, { x: 55, y: sumY, size: 8, font: helvetica, color: colors.textWhite });
    sumY -= 12;
  });

  y -= 120;
  // Section 1
  p1.drawText('1. Bandwidth vs. Latency: The Water Pipe Analogy', {
    x: 40,
    y: y,
    size: 12,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 18;
  const s1Text = [
    '• Bandwidth (Throughput): Represents the diameter of a water pipe. A 1,000 Mbps fiber line can deliver thousands',
    '  of megabytes per minute without congestion, but does NOT make any single packet travel faster than the speed of light.',
    '• Latency (Propagation Delay): Represents the time it takes for a drop of water to travel from the reservoir to your faucet.',
    '  If your cloud server is 800 miles away, physical light in glass takes ~6 ms each way, plus router switching and buffering.',
    '• The Human Threshold: In fast-paced FPS and fighting titles, humans perceive input latency exceeding 40-50 ms as sluggish.',
    '  Local PCs achieve 15-25 ms total latency. Cloud gaming must compress the entire network and encode budget into that window.'
  ];
  s1Text.forEach(line => {
    p1.drawText(line, { x: 40, y, size: 8, font: helvetica, color: colors.textMuted });
    y -= 13;
  });

  y -= 15;
  // Section 2
  p1.drawText('2. The 7 Hops of Cloud Gaming Latency (The Input-to-Photon Budget)', {
    x: 40,
    y: y,
    size: 12,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 20;
  // Table Header
  p1.drawRectangle({
    x: 40,
    y: y - 18,
    width: 515,
    height: 22,
    color: rgb(0.12, 0.16, 0.26)
  });
  p1.drawText('Hop / Component', { x: 50, y: y - 12, size: 8, font: helveticaBold, color: colors.accentCyan });
  p1.drawText('Optimal (Low-Lag)', { x: 230, y: y - 12, size: 8, font: helveticaBold, color: colors.accentEmerald });
  p1.drawText('Sub-Optimal (Sluggish)', { x: 340, y: y - 12, size: 8, font: helveticaBold, color: rgb(0.95, 0.4, 0.4) });
  p1.drawText('Core Optimization Fix', { x: 450, y: y - 12, size: 8, font: helveticaBold, color: colors.textWhite });

  y -= 22;
  const tableRows = [
    ['1. Input Capture & Polling', '1 - 2 ms (1kHz USB Wired)', '12 - 18 ms (Bluetooth 2.4GHz)', 'Wired USB Controller'],
    ['2. OS Packetization & TLS', '0.5 - 1 ms (Native Client)', '3 - 6 ms (Browser Sandbox)', 'Dedicated Desktop App'],
    ['3. Home LAN & Last-Mile', '0.5 - 1 ms (Cat6 Ethernet)', '8 - 25 ms (Wi-Fi 5 / Wall mesh)', 'Cat6a / 6GHz Wi-Fi 6E'],
    ['4. ISP Transit / Backhaul', '8 - 20 ms (Regional Fiber)', '40 - 75 ms (DOCSIS Cable/Coax)', 'Fiber + Closest Region'],
    ['5. Cloud GPU Rendering', '4.1 - 8.3 ms (120-240 FPS)', '16.7 ms (60 FPS Console Tier)', 'GeForce NOW Ultimate'],
    ['6. Cloud Video Encoding', '2 - 3 ms (AV1 / NVENC Slice)', '8 - 14 ms (Legacy H.264)', 'AV1 Hardware Stream'],
    ['7. Client Decode & Display', '1.5 - 4 ms (GPU HW Decode)', '15 - 35 ms (Smart TV SoC / Post-Proc)', 'Gaming Monitor + Game Mode']
  ];

  tableRows.forEach((row, idx) => {
    const rowBg = idx % 2 === 0 ? rgb(0.07, 0.10, 0.16) : rgb(0.09, 0.12, 0.20);
    p1.drawRectangle({
      x: 40,
      y: y - 16,
      width: 515,
      height: 18,
      color: rowBg
    });
    p1.drawText(row[0], { x: 50, y: y - 11, size: 7.5, font: helveticaBold, color: colors.textWhite });
    p1.drawText(row[1], { x: 230, y: y - 11, size: 7.5, font: helvetica, color: colors.accentEmerald });
    p1.drawText(row[2], { x: 340, y: y - 11, size: 7.5, font: helvetica, color: rgb(0.95, 0.5, 0.5) });
    p1.drawText(row[3], { x: 450, y: y - 11, size: 7, font: helvetica, color: colors.textMuted });
    y -= 18;
  });

  // Total Row
  p1.drawRectangle({
    x: 40,
    y: y - 18,
    width: 515,
    height: 20,
    color: rgb(0.14, 0.18, 0.28)
  });
  p1.drawText('TOTAL END-TO-END LATENCY', { x: 50, y: y - 12, size: 8, font: helveticaBold, color: colors.textWhite });
  p1.drawText('27 - 45 ms (Near-Local)', { x: 230, y: y - 12, size: 8, font: helveticaBold, color: colors.accentEmerald });
  p1.drawText('105 - 190 ms (Severe Lag)', { x: 340, y: y - 12, size: 8, font: helveticaBold, color: rgb(0.95, 0.35, 0.35) });
  p1.drawText('Over 65% Latency Reduction', { x: 450, y: y - 12, size: 7.5, font: helveticaBold, color: colors.accentCyan });

  // ================= PAGE 2 =================
  const p2 = createNewPage();
  y = 770;

  p2.drawText('3. The Hidden Culprits: Bufferbloat and Packet Jitter', {
    x: 40,
    y: y,
    size: 13,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 25;
  const s3Intro = [
    'Even with a gigabit subscription, real-time interactive UDP streams suffer when home network buffers fill up.',
    'Unlike video streaming (Netflix, YouTube) which pre-buffers 30 seconds of content, cloud gaming operates in strict real-time.',
    'A single delayed packet cannot be used after the video frame time has elapsed—it must be discarded, causing visual stutter.'
  ];
  s3Intro.forEach(line => {
    p2.drawText(line, { x: 40, y, size: 8, font: helvetica, color: colors.textMuted });
    y -= 13;
  });

  y -= 15;
  // Card 1: Bufferbloat
  p2.drawRectangle({
    x: 40,
    y: y - 85,
    width: 250,
    height: 90,
    color: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1
  });
  p2.drawText('BUFFERBLOAT UNDER LOAD', { x: 50, y: y - 16, size: 8.5, font: helveticaBold, color: colors.accentCyan });
  const bbLines = [
    '• Cause: Routers queue up oversized packet buffers',
    '  during active downloads, uploads, or cloud backups.',
    '• Impact: Idle ping of 15 ms spikes to 250-400 ms during',
    '  heavy bandwidth saturation, freezing game inputs.',
    '• Fix: Enable Smart Queue Management (SQM) with',
    '  Cake or FQ-CoDel algorithms on your router.'
  ];
  let bbY = y - 30;
  bbLines.forEach(l => {
    p2.drawText(l, { x: 50, y: bbY, size: 7.5, font: helvetica, color: colors.textWhite });
    bbY -= 11;
  });

  // Card 2: Packet Jitter
  p2.drawRectangle({
    x: 305,
    y: y - 85,
    width: 250,
    height: 90,
    color: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1
  });
  p2.drawText('PACKET JITTER & PACKET LOSS', { x: 315, y: y - 16, size: 8.5, font: helveticaBold, color: colors.accentPurple });
  const pjLines = [
    '• Cause: Wi-Fi channel interference, airtime contention,',
    '  and erratic ISP routing hops across backbones.',
    '• Impact: Constant variance between 18 ms and 65 ms.',
    '  The client stream buffer starves and tears frames.',
    '• Fix: Hardwire Ethernet Cat6a, lock server region, and',
    '  ensure Forward Error Correction (FEC) is active.'
  ];
  let pjY = y - 30;
  pjLines.forEach(l => {
    p2.drawText(l, { x: 315, y: pjY, size: 7.5, font: helvetica, color: colors.textWhite });
    pjY -= 11;
  });

  y -= 110;
  p2.drawText('4. Major Cloud Gaming Platforms Architecture Benchmark', {
    x: 40,
    y: y,
    size: 13,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 20;
  // Platform Table
  p2.drawRectangle({
    x: 40,
    y: y - 18,
    width: 515,
    height: 22,
    color: rgb(0.12, 0.16, 0.26)
  });
  p2.drawText('Platform & Tier', { x: 50, y: y - 12, size: 8, font: helveticaBold, color: colors.accentCyan });
  p2.drawText('Hardware & FPS', { x: 190, y: y - 12, size: 8, font: helveticaBold, color: colors.textWhite });
  p2.drawText('Video Codec', { x: 310, y: y - 12, size: 8, font: helveticaBold, color: colors.textWhite });
  p2.drawText('Input Latency', { x: 400, y: y - 12, size: 8, font: helveticaBold, color: colors.accentEmerald });
  p2.drawText('Optimal Use Case', { x: 470, y: y - 12, size: 8, font: helveticaBold, color: colors.textMuted });

  y -= 22;
  const platformRows = [
    ['GeForce NOW Ultimate', 'RTX 4080 (4K 120/240Hz)', 'AV1 / H.265 (75 Mbps)', '28 - 45 ms', 'Competitive FPS / AAA'],
    ['Xbox Cloud Gaming', 'Xbox Series X (1080p 60Hz)', 'H.264 WebRTC (15 Mbps)', '65 - 110 ms', 'Casual RPGs / Game Pass'],
    ['PlayStation Plus Cloud', 'PS5 Blades (4K 60Hz / 1080p)', 'HEVC / H.265 (38 Mbps)', '50 - 80 ms', 'PS Exclusive Action/Adventure'],
    ['Amazon Luna', 'EC2 GPU Instances (1080p 60Hz)', 'H.264 (20 Mbps)', '60 - 95 ms', 'Direct-to-Cloud Luna Controller']
  ];

  platformRows.forEach((pRow, idx) => {
    const rowBg = idx % 2 === 0 ? rgb(0.07, 0.10, 0.16) : rgb(0.09, 0.12, 0.20);
    p2.drawRectangle({
      x: 40,
      y: y - 16,
      width: 515,
      height: 18,
      color: rowBg
    });
    p2.drawText(pRow[0], { x: 50, y: y - 11, size: 7.5, font: helveticaBold, color: colors.textWhite });
    p2.drawText(pRow[1], { x: 190, y: y - 11, size: 7.5, font: helvetica, color: colors.textMuted });
    p2.drawText(pRow[2], { x: 310, y: y - 11, size: 7.5, font: helvetica, color: colors.accentCyan });
    p2.drawText(pRow[3], { x: 400, y: y - 11, size: 7.5, font: helveticaBold, color: idx === 0 ? colors.accentEmerald : colors.textWhite });
    p2.drawText(pRow[4], { x: 470, y: y - 11, size: 6.8, font: helvetica, color: colors.textMuted });
    y -= 18;
  });

  y -= 25;
  p2.drawText('5. The Definitive 6-Step Network & Client Optimization Blueprint', {
    x: 40,
    y: y,
    size: 13,
    font: helveticaBold,
    color: colors.textWhite
  });

  y -= 18;
  const steps = [
    'Step 1: Terminate Wi-Fi Reliance – Hardwire via Cat6/Cat6a Ethernet cable to eliminate radio jitter and channel interference.',
    'Step 2: Enable SQM (Smart Queue Management) on Your Router – Deploy Cake or FQ-CoDel to maintain sub-5ms bufferbloat.',
    'Step 3: Force Hardware GPU Video Decoding – Ensure AV1 or HEVC hardware acceleration is engaged in client settings.',
    'Step 4: Connect Controller via USB Wired Mode – Discard Bluetooth 2.4GHz polling lag for consistent 1ms input packetization.',
    'Step 5: Lock Nearest Data Center Region – Never rely on ISP Geo-IP; manually lock to the physical lowest-RTT server cluster.',
    'Step 6: Stream at High Refresh Rates (120 FPS+) – Even on 60Hz displays, streaming at 120 FPS halves server frame tick latency.'
  ];
  steps.forEach(st => {
    p2.drawText(st, { x: 40, y, size: 8, font: helvetica, color: colors.textWhite });
    y -= 14;
  });

  y -= 20;
  // Key Takeaways Box
  p2.drawRectangle({
    x: 40,
    y: y - 65,
    width: 515,
    height: 70,
    color: rgb(0.06, 0.22, 0.28),
    borderColor: colors.accentCyan,
    borderWidth: 1
  });
  p2.drawText('KEY TAKEAWAY: BANDWIDTH IS CAPACITY, LATENCY IS TIME', {
    x: 55,
    y: y - 16,
    size: 8.5,
    font: helveticaBold,
    color: colors.accentCyan
  });
  const takeaways = [
    'A 1 Gbps fiber subscription provides ample pipeline width, but does nothing to shorten physical transit times or router buffering.',
    'To make cloud gaming feel like local hardware, focus 100% of your optimization efforts on reducing packet jitter, bufferbloat,',
    'and client decode delays. A tuned 100 Mbps fiber line with 15 ms ping outperforms an unoptimized 2 Gbps connection with bufferbloat.'
  ];
  let tY = y - 30;
  takeaways.forEach(tk => {
    p2.drawText(tk, { x: 55, y: tY, size: 7.5, font: helvetica, color: colors.textWhite });
    tY -= 11;
  });

  const pdfBytes = await pdfDoc.save();
  const outputDir = path.join(__dirname, '../public/documents');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'gamevault-cloud-gaming-latency-vs-bandwidth.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Successfully generated PDF:', outputPath, 'Bytes:', pdfBytes.length);

  // Also write to dist/documents if dist exists
  const distDir = path.join(__dirname, '../dist/documents');
  if (fs.existsSync(path.join(__dirname, '../dist'))) {
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.writeFileSync(path.join(distDir, 'gamevault-cloud-gaming-latency-vs-bandwidth.pdf'), pdfBytes);
    console.log('Also copied to dist/documents');
  }
}

createCloudGamingPdf().catch(err => {
  console.error(err);
  process.exit(1);
});
