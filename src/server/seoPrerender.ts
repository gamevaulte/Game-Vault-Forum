import fs from 'fs';
import path from 'path';
import { MOCK_ARTICLES } from '../data/articlesData';
import { getSeoSlug } from '../lib/seo';

export function handleSeoPrerender(reqPath: string, isProd: boolean): string | null {
  try {
    const cleanPath = reqPath.split('?')[0].replace(/\/+$/, '');
    
    // Check if path is an article
    if (cleanPath.startsWith('/articles/')) {
      const slug = cleanPath.replace('/articles/', '');
      const article = MOCK_ARTICLES.find(
        (a) => getSeoSlug(a) === slug || a.id === slug
      );

      if (!article) return null;

      const htmlPath = isProd 
        ? path.join(process.cwd(), 'dist', 'index.html') 
        : path.join(process.cwd(), 'index.html');

      if (!fs.existsSync(htmlPath)) return null;
      let html = fs.readFileSync(htmlPath, 'utf8');

      const title = `${article.title} | Game Vault Forum`;
      const description = article.excerpt;
      const canonicalUrl = `https://www.gamevault.forum/articles/${getSeoSlug(article)}`;
      const imageUrl = article.featuredImage || article.image || 'https://www.gamevault.forum/favicon.ico';
      const authorName = article.author?.name || 'Joel Ayuba';
      const authorUrl = `https://www.gamevault.forum/authors/${authorName.toLowerCase().replace(/\s+/g, '-')}`;

      // Update Title & Meta
      html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
      html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
      html = html.replace(/<meta name="author" content=".*?" \/>/, `<meta name="author" content="${escapeHtml(authorName)}" />`);

      // OpenGraph & Twitter
      const ogTags = `
    <!-- Dynamic Article SEO Tags -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="article:published_time" content="2026-09-02T00:00:00Z" />
    <meta property="article:author" content="${escapeHtml(authorName)}" />
    <meta property="article:section" content="${escapeHtml(article.category)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
      `;
      html = html.replace('</head>', `${ogTags}\n  </head>`);

      // JSON-LD Article Schema
      const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${canonicalUrl}#article`,
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'Game Vault Forum',
          'url': 'https://www.gamevault.forum'
        },
        'headline': article.title,
        'description': article.excerpt,
        'image': [imageUrl],
        'datePublished': '2026-09-02T00:00:00Z',
        'dateModified': '2026-09-02T00:00:00Z',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        'author': {
          '@type': 'Person',
          'name': authorName,
          'jobTitle': article.author?.role || 'Founder & Lead Publisher',
          'url': authorUrl
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Game Vault Forum',
          'url': 'https://www.gamevault.forum',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.gamevault.forum/favicon.ico'
          }
        }
      };

      const jsonLdTag = `\n    <script type="application/ld+json">\n${JSON.stringify(articleJsonLd, null, 2)}\n    </script>\n`;
      html = html.replace('</head>', `${jsonLdTag}  </head>`);

      // Server rendered semantic body inside #root
      const bodyHtml = `
      <div class="server-article-container" style="max-width: 900px; margin: 0 auto; padding: 40px 20px; color: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7;">
        <nav style="margin-bottom: 24px; font-size: 14px; color: #94a3b8;">
          <a href="/" style="color: #c4b5fd; text-decoration: none;">Home</a> &gt; 
          <a href="/articles" style="color: #c4b5fd; text-decoration: none;">Articles</a> &gt; 
          <span>${escapeHtml(article.title)}</span>
        </nav>

        <header style="margin-bottom: 32px;">
          <span style="display: inline-block; padding: 4px 12px; background: rgba(147, 51, 234, 0.2); color: #d8b4fe; border: 1px solid rgba(147, 51, 234, 0.4); border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
            ${escapeHtml(article.category)}
          </span>
          <h1 style="font-size: 32px; font-weight: 800; line-height: 1.3; color: #ffffff; margin-bottom: 16px;">
            ${escapeHtml(article.title)}
          </h1>
          <p style="font-size: 18px; color: #cbd5e1; margin-bottom: 24px;">
            ${escapeHtml(article.excerpt)}
          </p>

          <div style="display: flex; align-items: center; gap: 16px; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 16px 0;">
            <img src="${article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}" alt="${escapeHtml(authorName)}" style="width: 48px; height: 48px; border-radius: 50%; object-cover: cover;" />
            <div>
              <div style="font-weight: 700; color: #ffffff;">
                <a href="${authorUrl}" style="color: #c4b5fd; text-decoration: none;">${escapeHtml(authorName)}</a>
              </div>
              <div style="font-size: 12px; color: #94a3b8;">
                ${escapeHtml(article.author?.role || 'Founder & Lead Publisher')} • ${escapeHtml(article.publicationDate || 'Sept 2, 2026')} • ${escapeHtml(article.readingTime || '8 min read')}
              </div>
            </div>
          </div>
        </header>

        <figure style="margin: 0 0 32px 0;">
          <img src="${imageUrl}" alt="${escapeHtml(article.title)}" style="width: 100%; border-radius: 12px; max-height: 500px; object-fit: cover;" />
        </figure>

        <main style="font-size: 16px; color: #cbd5e1;">
          ${renderMarkdownToHtml(article.content)}
        </main>
      </div>
      `;

      html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
      return html;
    }

    // Check if path is author page
    if (cleanPath.startsWith('/authors/')) {
      const slug = cleanPath.replace('/authors/', '');
      const htmlPath = isProd 
        ? path.join(process.cwd(), 'dist', 'index.html') 
        : path.join(process.cwd(), 'index.html');

      if (!fs.existsSync(htmlPath)) return null;
      let html = fs.readFileSync(htmlPath, 'utf8');

      const authorName = 'Joel Ayuba';
      const title = `${authorName} — Founder & Lead Publisher | Game Vault Forum`;
      const description = `Author profile, editorial credentials, and published articles by ${authorName}, Founder & Lead Publisher of Game Vault Forum.`;
      const canonicalUrl = `https://www.gamevault.forum/authors/${slug}`;

      html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
      html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`);

      const authorBodyHtml = `
      <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px; color: #f1f5f9; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="font-size: 32px; font-weight: 800; color: #ffffff;">${escapeHtml(authorName)}</h1>
        <p style="color: #c4b5fd; font-weight: 600;">Founder &amp; Lead Publisher — Game Vault Forum</p>
        <p style="color: #cbd5e1; margin-top: 16px; line-height: 1.6;">
          Joel Ayuba is the Founder and Lead Publisher of Game Vault Forum and video producer for @GameVaultForum on YouTube. He focuses on deep-dive gaming mechanics, PC hardware benchmarking, and tactical game analyses.
        </p>
        <h2 style="font-size: 24px; font-weight: 700; margin-top: 32px; color: #ffffff;">Published Articles</h2>
        <ul style="margin-top: 16px; padding-left: 20px; line-height: 2;">
          <li><a href="/articles/why-some-games-keep-us-playing-for-years" style="color: #c4b5fd;">Why Some Games Keep Us Playing for Years</a></li>
          <li><a href="/articles/the-psychology-of-strategic-gaming-how-tactical-games-rewire-your-brain" style="color: #c4b5fd;">The Psychology of Strategic Gaming: How Tactical Games Rewire Your Brain</a></li>
          <li><a href="/articles/why-world-of-warships-is-more-interesting-than-i-expected" style="color: #c4b5fd;">Why World of Warships Is More Interesting Than I Expected</a></li>
        </ul>
      </div>
      `;

      html = html.replace('<div id="root"></div>', `<div id="root">${authorBodyHtml}</div>`);
      return html;
    }

    return null;
  } catch (err) {
    console.error('Error during SEO prerender:', err);
    return null;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderMarkdownToHtml(md: string): string {
  if (!md) return '';
  const lines = md.split('\n');
  let output = '';
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        output += '</ul>\n';
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith('### ')) {
      if (inList) { output += '</ul>\n'; inList = false; }
      output += `<h3 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 24px; margin-bottom: 12px;">${escapeHtml(trimmed.slice(4))}</h3>\n`;
    } else if (trimmed.startsWith('## ')) {
      if (inList) { output += '</ul>\n'; inList = false; }
      output += `<h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">${escapeHtml(trimmed.slice(3))}</h2>\n`;
    } else if (trimmed.startsWith('- ')) {
      if (!inList) {
        output += '<ul style="margin-bottom: 20px; padding-left: 24px; line-height: 1.8;">\n';
        inList = true;
      }
      output += `  <li>${formatInline(trimmed.slice(2))}</li>\n`;
    } else {
      if (inList) { output += '</ul>\n'; inList = false; }
      output += `<p style="margin-bottom: 18px; line-height: 1.7;">${formatInline(trimmed)}</p>\n`;
    }
  }

  if (inList) output += '</ul>\n';
  return output;
}

function formatInline(text: string): string {
  // Bold
  let res = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Links [text](url)
  res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #c4b5fd; text-decoration: underline;">$1</a>');
  return res;
}
