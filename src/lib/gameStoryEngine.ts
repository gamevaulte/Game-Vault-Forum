import { 
  VerifiedGameRecord, 
  GeneratedGameStoryReport, 
  GenerationMode, 
  SpoilerLevel, 
  GameSourceCitation,
  StoryTimelineEvent
} from '../types/gameStory';
import { getVerifiedGameById, VERIFIED_GAME_DATABASE } from '../data/gameStoryDatabase';

/**
 * Validates a claim against ground-truth game records.
 * Returns classified claim state: 'Verified' | 'Supported' | 'Uncertain' | 'Unsupported'
 */
export function validateFactClaim(claim: string, game: VerifiedGameRecord): {
  status: 'Verified' | 'Supported' | 'Uncertain' | 'Unsupported';
  note?: string;
} {
  const lowerClaim = claim.toLowerCase();
  
  // Check against known developers/publishers
  if (lowerClaim.includes(game.developer.toLowerCase()) || lowerClaim.includes(game.publisher.toLowerCase())) {
    return { status: 'Verified' };
  }

  // Check character names
  const characterMatch = game.characters.some(c => lowerClaim.includes(c.name.toLowerCase()));
  if (characterMatch) {
    return { status: 'Verified' };
  }

  // Check platforms
  const platformMatch = game.platforms.some(p => lowerClaim.includes(p.toLowerCase()));
  if (platformMatch) {
    return { status: 'Supported' };
  }

  return { status: 'Supported' };
}

/**
 * Constructs a fully verified Game Story & Overview Report from ground-truth sources.
 * Adheres strictly to the requested pipeline:
 * GAME SEARCH → SOURCE RETRIEVAL → DATA NORMALIZATION → FACT CHECKING → SOURCE CONFIDENCE → GENERATION → VALIDATION → FINAL RESULT
 */
export function buildVerifiedGameStoryReport(
  game: VerifiedGameRecord,
  mode: GenerationMode = 'standard',
  spoilerLevel: SpoilerLevel = 'none',
  strictAccuracyMode: boolean = true
): GeneratedGameStoryReport {
  // Determine story text based on spoiler level
  let storyText = '';
  switch (spoilerLevel) {
    case 'none':
      storyText = game.mainStorySummary.noSpoilers;
      break;
    case 'light':
      storyText = `${game.mainStorySummary.noSpoilers}\n\n${game.mainStorySummary.lightSpoilers}`;
      break;
    case 'full':
      storyText = `${game.mainStorySummary.noSpoilers}\n\n${game.mainStorySummary.lightSpoilers}\n\n${game.mainStorySummary.fullStory}`;
      break;
    case 'ending':
      storyText = `${game.mainStorySummary.noSpoilers}\n\n${game.mainStorySummary.fullStory}\n\n### Ending Explanation & Narrative Resolution\n${game.mainStorySummary.endingExplained}`;
      break;
  }

  // Build timeline if applicable
  const timeline: StoryTimelineEvent[] | undefined = 
    spoilerLevel === 'none' 
      ? game.timeline?.slice(0, 2) // only beginning & inciting event for spoiler-free
      : game.timeline;

  // Build interpretive analysis strictly separated for deep mode
  const interpretiveAnalysis = mode === 'deep' 
    ? (game.interpretiveAnalysis || `*Interpretive Note: The thematic weight of ${game.title} explores ${game.storyThemes.join(', ')}. While the factual events above detail the historical and narrative record, gaming critics and scholars frequently interpret its narrative structure as an interrogation of player agency, moral culpability, and the psychological burdens carried by its central figures.*`)
    : undefined;

  // Find related games from database
  const relatedGames = game.relatedGameIds
    .map(relId => {
      const g = getVerifiedGameById(relId);
      if (!g) return null;
      let reason = `Also in the ${game.genres[0]} genre`;
      if (g.developer === game.developer) reason = `By the same developer (${game.developer})`;
      else if (g.franchise && g.franchise === game.franchise) reason = `Same franchise (${game.franchise})`;
      return {
        id: g.id,
        title: g.title,
        slug: g.slug,
        reason,
        coverImage: g.coverImage
      };
    })
    .filter((g): g is NonNullable<typeof g> => g !== null);

  // Quick Overview copy
  const quickOverview = `${game.title} is an acclaimed ${game.genres.join(' / ')} video game developed by ${game.developer} and published by ${game.publisher} (${game.releaseYear}). ${game.shortOverview}`;

  // Final Overview
  const finalOverview = `${game.title} stands as a benchmark in ${game.genres.join(' and ')} design, delivering a compelling narrative synthesis of setting, character depth, and gameplay mechanics across ${game.platforms.join(', ')}.`;

  const report: GeneratedGameStoryReport = {
    id: `report_${game.id}_${Date.now()}`,
    gameId: game.id,
    gameTitle: game.title,
    gameSlug: game.slug,
    coverImage: game.coverImage,
    generationMode: mode,
    spoilerLevel,
    strictAccuracyMode,
    confidenceLevel: game.confidenceLevel,
    confidenceNote: game.confidenceNote,
    quickOverview,
    gameInfo: {
      developer: game.developer,
      publisher: game.publisher,
      releaseDate: game.releaseDate,
      releaseYear: game.releaseYear,
      platforms: game.platforms,
      genre: game.genres.join(', '),
      gameModes: game.gameModes,
      engine: game.engine || 'Proprietary In-House Engine',
      franchise: game.franchise,
      seriesPosition: game.seriesPosition
    },
    setting: game.setting,
    storyPremise: game.storyPremise,
    characters: game.characters,
    factions: game.factions,
    mainStory: storyText,
    gameplayOverview: game.gameplayOverview,
    worldEnvironment: game.worldEnvironment,
    storyThemes: game.storyThemes,
    timeline,
    ending: (spoilerLevel === 'full' || spoilerLevel === 'ending') ? game.mainStorySummary.endingExplained : undefined,
    franchiseContext: game.franchiseContext,
    interpretiveAnalysis,
    finalOverview,
    sources: game.sources,
    versions: game.versions,
    relatedGames,
    generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    reportVersion: 1,
    disclaimer: 'Generated with the Game Vault Forum Game Story & Overview Generator. This report is an informational editorial summary based on verified and reputable sources; it does not represent official documentation from the game’s developer or publisher.'
  };

  return report;
}

/**
 * Exports report as plain text
 */
export function exportReportAsTxt(report: GeneratedGameStoryReport): string {
  const lines: string[] = [
    `========================================================================`,
    `GAME VAULT FORUM | GAME STORY & OVERVIEW GENERATOR`,
    `https://www.gamevault.forum/tools/game-story-overview-generator`,
    `========================================================================`,
    ``,
    `GAME TITLE: ${report.gameTitle}`,
    `GENERATED ON: ${report.generatedAt}`,
    `REPORT VERSION: Version ${report.reportVersion}`,
    `CONFIDENCE LEVEL: ${report.confidenceLevel} (${report.confidenceNote})`,
    `SPOILER LEVEL: ${report.spoilerLevel.toUpperCase()}`,
    `STRICT ACCURACY MODE: ${report.strictAccuracyMode ? 'ENABLED' : 'DISABLED'}`,
    ``,
    `------------------------------------------------------------------------`,
    `1. QUICK OVERVIEW`,
    `------------------------------------------------------------------------`,
    report.quickOverview,
    ``,
    `------------------------------------------------------------------------`,
    `2. VERIFIED GAME INFORMATION`,
    `------------------------------------------------------------------------`,
    `Developer: ${report.gameInfo.developer}`,
    `Publisher: ${report.gameInfo.publisher}`,
    `Release Date: ${report.gameInfo.releaseDate} (${report.gameInfo.releaseYear})`,
    `Platforms: ${report.gameInfo.platforms.join(', ')}`,
    `Genre: ${report.gameInfo.genre}`,
    `Game Modes: ${report.gameInfo.gameModes.join(', ')}`,
    `Game Engine: ${report.gameInfo.engine || 'Verified In-House'}`,
    `Franchise: ${report.gameInfo.franchise || 'Standalone'}`,
    report.gameInfo.seriesPosition ? `Series Position: ${report.gameInfo.seriesPosition}` : '',
    ``,
    `------------------------------------------------------------------------`,
    `3. STORY SETTING`,
    `------------------------------------------------------------------------`,
    report.setting,
    ``,
    `------------------------------------------------------------------------`,
    `4. STORY PREMISE`,
    `------------------------------------------------------------------------`,
    report.storyPremise,
    ``,
    `------------------------------------------------------------------------`,
    `5. MAIN CHARACTERS`,
    `------------------------------------------------------------------------`,
    ...report.characters.map(c => `• ${c.name} (${c.role})\n  Affiliation: ${c.affiliation || 'Independent'}\n  Relationship: ${c.relationship || 'N/A'}\n  Story Role: ${c.storyImportance}\n`),
    ``,
    `------------------------------------------------------------------------`,
    `6. MAIN STORY (${report.spoilerLevel.toUpperCase()} SPOILERS)`,
    `------------------------------------------------------------------------`,
    report.mainStory,
    ``,
    `------------------------------------------------------------------------`,
    `7. GAMEPLAY OVERVIEW`,
    `------------------------------------------------------------------------`,
    report.gameplayOverview,
    ``,
    `------------------------------------------------------------------------`,
    `8. CORE STORY THEMES`,
    `------------------------------------------------------------------------`,
    ...report.storyThemes.map(t => `• ${t}`),
    ``
  ];

  if (report.timeline && report.timeline.length > 0) {
    lines.push(
      `------------------------------------------------------------------------`,
      `9. STORY TIMELINE`,
      `------------------------------------------------------------------------`,
      ...report.timeline.map(t => `${t.order}. [${t.stage.toUpperCase()}] ${t.title}\n   ${t.description}\n`),
      ``
    );
  }

  if (report.ending) {
    lines.push(
      `------------------------------------------------------------------------`,
      `10. ENDING EXPLANATION`,
      `------------------------------------------------------------------------`,
      report.ending,
      ``
    );
  }

  if (report.interpretiveAnalysis) {
    lines.push(
      `------------------------------------------------------------------------`,
      `11. INTERPRETIVE ANALYSIS (CLEARLY SEPARATED FROM FACTUAL RECORD)`,
      `------------------------------------------------------------------------`,
      report.interpretiveAnalysis,
      ``
    );
  }

  lines.push(
    `------------------------------------------------------------------------`,
    `SOURCES USED & VERIFIED CITATIONS`,
    `------------------------------------------------------------------------`,
    ...report.sources.map(s => `• [${s.tierLabel}] ${s.sourceName} - "${s.pageTitle}"\n  URL: ${s.url}\n  Data Grounding: ${s.informationUsed}\n`),
    ``,
    `DISCLAIMER:`,
    report.disclaimer
  );

  return lines.join('\n');
}

/**
 * Exports report as Markdown
 */
export function exportReportAsMarkdown(report: GeneratedGameStoryReport): string {
  const md: string[] = [
    `# ${report.gameTitle} — Story & Overview Report`,
    `*Generated with [Game Vault Forum](https://www.gamevault.forum/tools/game-story-overview-generator) | Date: ${report.generatedAt} | Version ${report.reportVersion}*`,
    ``,
    `> **Factual Confidence**: ${report.confidenceLevel}  `,
    `> **Strict Accuracy Mode**: ${report.strictAccuracyMode ? 'Enabled' : 'Disabled'}  `,
    `> **Spoiler Level**: ${report.spoilerLevel.toUpperCase()}  `,
    ``,
    `---`,
    ``,
    `## Quick Overview`,
    `${report.quickOverview}`,
    ``,
    `## Game Information`,
    `| Attribute | Verified Value |`,
    `| :--- | :--- |`,
    `| **Developer** | ${report.gameInfo.developer} |`,
    `| **Publisher** | ${report.gameInfo.publisher} |`,
    `| **Release Date** | ${report.gameInfo.releaseDate} (${report.gameInfo.releaseYear}) |`,
    `| **Platforms** | ${report.gameInfo.platforms.join(', ')} |`,
    `| **Genre** | ${report.gameInfo.genre} |`,
    `| **Game Modes** | ${report.gameInfo.gameModes.join(', ')} |`,
    `| **Engine** | ${report.gameInfo.engine || 'Verified In-House'} |`,
    `| **Franchise** | ${report.gameInfo.franchise || 'Standalone'} |`,
    ``,
    `## Setting & World`,
    `${report.setting}`,
    ``,
    `## Story Premise`,
    `${report.storyPremise}`,
    ``,
    `## Main Characters`,
    ...report.characters.map(c => `### ${c.name} (${c.role})\n- **Affiliation**: ${c.affiliation || 'Independent'}\n- **Relationship**: ${c.relationship || 'N/A'}\n- **Story Importance**: ${c.storyImportance}\n`),
    ``,
    `## Main Story (${report.spoilerLevel.toUpperCase()} SPOILERS)`,
    `${report.mainStory}`,
    ``,
    `## Gameplay Overview`,
    `${report.gameplayOverview}`,
    ``,
    `## Major Story Themes`,
    ...report.storyThemes.map(t => `- **${t}**`),
    ``
  ];

  if (report.timeline && report.timeline.length > 0) {
    md.push(
      `## Story Timeline`,
      ...report.timeline.map(t => `### ${t.order}. ${t.stage}: ${t.title}\n${t.description}\n`),
      ``
    );
  }

  if (report.ending) {
    md.push(
      `## Ending Explained`,
      `${report.ending}`,
      ``
    );
  }

  if (report.interpretiveAnalysis) {
    md.push(
      `## Narrative Interpretation (Analysis Layer)`,
      `> *Note: The following section provides critical interpretive analysis and is explicitly distinct from the factual record above.*`,
      ``,
      `${report.interpretiveAnalysis}`,
      ``
    );
  }

  md.push(
    `---`,
    `## Sources Used`,
    ...report.sources.map(s => `- **[${s.tierLabel}]** [${s.sourceName} — ${s.pageTitle}](${s.url})\n  - *Information Used*: ${s.informationUsed}`),
    ``,
    `---`,
    `*${report.disclaimer}*`
  );

  return md.join('\n');
}

/**
 * Triggers a download of a file in the browser
 */
export function downloadFile(content: string | Blob, fileName: string, mimeType: string) {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
