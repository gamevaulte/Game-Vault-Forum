import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Calendar, 
  Youtube, 
  Mail, 
  CheckCircle2, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ExternalLink 
} from 'lucide-react';
import { Article, PageTab } from '../types';
import { MOCK_ARTICLES } from '../data/articlesData';
import { getSeoSlug, updatePageSeo, CANONICAL_BASE_URL } from '../lib/seo';

interface AuthorPageViewProps {
  authorSlug: string;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  onNavigateTab: (tab: PageTab) => void;
  onShare?: (title: string, path: string) => void;
}

export const AuthorPageView: React.FC<AuthorPageViewProps> = ({
  authorSlug,
  onBack,
  onSelectArticle,
  onNavigateTab,
  onShare
}) => {
  // Author Profile definitions
  const authorData = {
    name: 'Joel Ayuba',
    slug: 'joel-ayuba',
    role: 'Founder & Lead Publisher',
    tagline: 'Gaming Journalist, Tactical Systems Analyst & PC Hardware Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    location: 'United Kingdom / Global Editorial Desk',
    email: 'contact@gamevault.forum',
    youtubeUrl: 'https://www.youtube.com/@GameVaultForum',
    youtubeHandle: '@GameVaultForum',
    bio: `Joel Ayuba is the Founder and Lead Publisher of Game Vault Forum. As an experienced gaming analyst, long-time PC builder, and creator behind the official Game Vault Forum YouTube channel (@GameVaultForum), Joel focuses on rigorous, data-grounded game critiques, tactical mechanics deconstructions, and hardware performance benchmarks without promotional hype.\n\nWith over a decade of deep involvement across competitive strategy titles, simulation warfare, and high-performance PC hardware optimization, Joel established Game Vault Forum to give players an authentic home for comprehensive analyses, honest reviews, and transparent community tools.`,
    credentials: [
      'Founder & Editor-in-Chief, Game Vault Forum',
      'Lead Host & Video Producer, @GameVaultForum (YouTube)',
      '10+ Years Dedicated PC Hardware & Simulation Testing',
      'Author of Landmark Analyses on Game Longevity & Tactical Systems'
    ],
    expertise: ['PC Hardware Benchmarking', 'Tactical & Strategy Games', 'Game Longevity & Loop Design', 'Naval & Combat Simulations', 'Community Governance']
  };

  // Published articles by this author
  const publishedArticles = MOCK_ARTICLES.filter(
    (a) => a.author.name.toLowerCase() === authorData.name.toLowerCase() || authorSlug === 'joel-ayuba' && (a.author.role?.includes('Founder') || a.id === 'art-1')
  );

  useEffect(() => {
    updatePageSeo({
      title: `${authorData.name} — ${authorData.role} | Game Vault Forum`,
      description: `Author profile, editorial credentials, and published articles by ${authorData.name}, Founder & Lead Publisher of Game Vault Forum.`,
      canonicalPath: `/authors/${authorData.slug}`,
      ogType: 'profile',
      imageUrl: authorData.avatar,
      breadcrumbs: [
        { name: 'Authors', path: '/authors/joel-ayuba' },
        { name: authorData.name, path: `/authors/${authorData.slug}` }
      ],
      schemaType: 'WebPage',
      schemaData: {
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: authorData.name,
          jobTitle: authorData.role,
          url: `${CANONICAL_BASE_URL}/authors/${authorData.slug}`,
          image: authorData.avatar,
          description: authorData.tagline,
          worksFor: {
            '@type': 'Organization',
            name: 'Game Vault Forum',
            url: CANONICAL_BASE_URL
          },
          sameAs: [
            authorData.youtubeUrl
          ]
        }
      }
    });
  }, [authorData]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      {/* Top Breadcrumbs & Back */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span>Official Editorial Desk</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            Verified Publisher
          </span>
        </div>
      </div>

      {/* Author Hero Card */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#0d0f1a] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
          <div className="relative">
            <img
              src={authorData.avatar}
              alt={authorData.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-purple-500/60 shadow-xl shadow-purple-950/60"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-purple-600 text-white shadow-md border-2 border-[#0d0f1a]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
                {authorData.name}
              </h1>
              <span className="px-2.5 py-1 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-full">
                {authorData.role}
              </span>
            </div>

            <p className="text-sm sm:text-base text-gray-300 font-medium">
              {authorData.tagline}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <a
                href={authorData.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/30 transition-all font-['Rajdhani'] font-bold uppercase tracking-wider"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube {authorData.youtubeHandle}</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </a>

              <a
                href={`mailto:${authorData.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition-all font-['Rajdhani'] font-bold uppercase tracking-wider"
              >
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>{authorData.email}</span>
              </a>

              {onShare && (
                <button
                  onClick={() => onShare(`${authorData.name} — Author Profile`, `/authors/${authorData.slug}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition-all font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Share Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Biography text */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-4 text-sm text-gray-300 leading-relaxed">
          {authorData.bio.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Badges & Creds */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Editorial Credentials</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-400">
              {authorData.credentials.map((cred, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>{cred}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Areas of Subject Matter Focus</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {authorData.expertise.map((exp, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-cyan-950/30 text-cyan-300 border border-cyan-800/30 font-mono"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Published Articles Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>Articles Authored by {authorData.name} ({publishedArticles.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedArticles.map((article) => {
            const articleSlug = getSeoSlug(article);
            const coverImage = article.image || article.featuredImage;

            return (
              <a
                key={article.id}
                href={`/articles/${articleSlug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(article);
                }}
                className="group flex flex-col justify-between p-5 rounded-xl bg-[#0c0e18] hover:bg-[#111422] border border-white/10 hover:border-purple-500/40 transition-all duration-200 cursor-pointer shadow-lg"
              >
                <div className="space-y-3">
                  <div className="aspect-video w-full overflow-hidden rounded-lg relative">
                    <img
                      src={coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-sm text-purple-300 border border-purple-500/30 rounded">
                      {article.category}
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {article.readingTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      {article.publicationDate}
                    </span>
                  </div>
                  <span className="text-purple-400 group-hover:text-purple-300 font-['Rajdhani'] font-bold uppercase tracking-wider text-xs">
                    Read Article →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
};
