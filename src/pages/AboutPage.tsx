import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Github,
  Instagram,
  Layers,
  Linkedin,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface FeedbackEntry {
  id: string;
  name: string;
  type: string;
  message: string;
  createdAt: string;
}

interface SocialProfiles {
  emailId: string;
  instagramId: string;
  linkedinUrl: string;
  githubUrl: string;
}

const FEEDBACK_STORAGE_KEY = 'a1_academy_feedback_entries';
const SOCIAL_STORAGE_KEY = 'a1_academy_creator_socials';

const DEFAULT_SOCIALS: SocialProfiles = {
  emailId: 'akshatahegde8808@gmail.com',
  instagramId: '@a1academy.eng',
  linkedinUrl: 'https://www.linkedin.com',
  githubUrl: 'https://github.com',
};

export const AboutPage: React.FC = () => {
  const [name, setName] = useState('');
  const [feedbackType, setFeedbackType] = useState('Website Feedback');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() => {
    try {
      const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [socials, setSocials] = useState<SocialProfiles>(() => {
    try {
      const raw = localStorage.getItem(SOCIAL_STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_SOCIALS, ...JSON.parse(raw) };
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_SOCIALS;
  });

  const [editingSocials, setEditingSocials] = useState(false);
  const [draftSocials, setDraftSocials] = useState<SocialProfiles>(socials);

  useEffect(() => {
    try {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackList));
    } catch {
      // Ignore storage errors
    }
  }, [feedbackList]);

  useEffect(() => {
    try {
      localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(socials));
    } catch {
      // Ignore storage errors
    }
  }, [socials]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter your feedback or suggestion before submitting.');
      return;
    }

    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      name: name.trim() || 'Student',
      type: feedbackType,
      message: message.trim(),
      createdAt: new Date().toLocaleDateString(),
    };

    setFeedbackList((prev) => [entry, ...prev]);
    setName('');
    setMessage('');
    setError('');
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 4000);
  };

  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    setSocials({
      emailId: draftSocials.emailId.trim() || DEFAULT_SOCIALS.emailId,
      instagramId: draftSocials.instagramId.trim() || DEFAULT_SOCIALS.instagramId,
      linkedinUrl: draftSocials.linkedinUrl.trim() || DEFAULT_SOCIALS.linkedinUrl,
      githubUrl: draftSocials.githubUrl.trim() || DEFAULT_SOCIALS.githubUrl,
    });
    setEditingSocials(false);
  };

  const instagramHref = socials.instagramId.startsWith('http')
    ? socials.instagramId
    : `https://www.instagram.com/${socials.instagramId.replace(/^@/, '')}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'About Us' },
        ]}
      />

      <header className="space-y-4">
        <p className="text-xs font-semibold text-[var(--accent-blue)]">
          About A1 ACADEMY
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-balance">
          Built to Give First-Year Engineering Students a Clear Start
        </h1>
        <div className="space-y-3 text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          <p>
            The first year of engineering is where curiosity meets new
            challenges and stronger foundations shape future possibilities.
          </p>
          <p>
            A1 Academy is a student-focused learning platform designed to make
            this journey simpler, smarter, and more accessible. From
            understanding fundamental concepts to preparing for examinations, we
            bring together well-organized notes, lecture materials, previous
            year question papers, study resources, and practical learning
            guidance-all in one place.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl a1-surface p-6 space-y-3">
          <BookOpen className="w-6 h-6 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Cycle-wise and subject-wise organized
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Every Physics Cycle and Chemistry Cycle subject has its own
            dedicated page and clean URLs for Handwritten Notes, Slides,
            Previous Year Questions, and Reference Materials.
          </p>
        </div>

        <div className="rounded-2xl a1-surface p-6 space-y-3">
          <Layers className="w-6 h-6 text-[var(--accent-purple)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Extensible Architecture
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            All subjects, units, and resources are driven by typed TypeScript
            data structures so real PDFs, scanned handwritten notes, and lecture
            decks can be added cleanly without redesigning any page.
          </p>
        </div>

        <div className="rounded-2xl a1-surface p-6 space-y-3">
          <Calculator className="w-6 h-6 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Open Access &amp; Offline Friendly
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            No sign-up walls. Bookmarked resources, study checklists, theme
            preference, and CGPA calculator entries persist locally in your
            browser.
          </p>
        </div>
      </section>

      <section className="rounded-2xl a1-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            Ready to Start Studying?
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Explore your current semester cycle or plan your study week.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/physics-cycle"
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <span>Physics Cycle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/chemistry-cycle"
            className="px-4 py-2.5 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5"
          >
            <span>Chemistry Cycle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Feedback & Creator Connect Section */}
      <section
        aria-labelledby="feedback-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start"
      >
        {/* Feedback Form */}
        <div className="lg:col-span-7 rounded-2xl a1-surface p-6 sm:p-8 space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)]">
              <MessageSquare className="w-4 h-4" />
              <span>Student Feedback &amp; Suggestions</span>
            </div>
            <h2
              id="feedback-heading"
              className="font-display text-2xl font-bold text-[var(--text-primary)]"
            >
              Feedback
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Share feedback about the website, request missing subject notes,
              or suggest improvements you would like to see.
            </p>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="feedback-name"
                  className="block text-xs font-medium text-[var(--text-secondary)]"
                >
                  Your Name (Optional)
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First-year student"
                  className="w-full rounded-xl a1-surface-secondary px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="feedback-type"
                  className="block text-xs font-medium text-[var(--text-secondary)]"
                >
                  Feedback Category
                </label>
                <select
                  id="feedback-type"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full rounded-xl a1-surface-secondary px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                >
                  <option value="Website Feedback">Website Feedback</option>
                  <option value="Suggest Changes">Suggest Changes</option>
                  <option value="Request Study Material">
                    Request Study Material
                  </option>
                  <option value="Report an Issue">Report an Issue</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="feedback-message"
                className="block text-xs font-medium text-[var(--text-secondary)]"
              >
                Your Feedback or Suggested Changes
              </label>
              <textarea
                id="feedback-message"
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Tell us what works well or what changes would help you..."
                className="w-full rounded-xl a1-surface-secondary px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-amber-500">{error}</p>
            )}

            {submitted && (
              <div className="rounded-xl bg-[#2563EB]/10 dark:bg-[#8DBBFF]/12 border border-[#2563EB]/30 dark:border-[#8DBBFF]/30 px-4 py-2.5 text-xs font-medium text-[var(--accent-blue)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Thank you! Your feedback has been saved locally.
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
              <a
                href={`mailto:akshatahegde8808@gmail.com?subject=${encodeURIComponent(
                  `A1 ACADEMY — ${feedbackType}`,
                )}&body=${encodeURIComponent(message)}`}
                className="px-4 py-2.5 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-colors"
              >
                Send via Email
              </a>
            </div>
          </form>

          {feedbackList.length > 0 && (
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2.5">
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                Your Recent Submissions ({feedbackList.length})
              </p>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {feedbackList.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl a1-surface-secondary p-3 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item.name} · {item.type}
                      </span>
                      <span>{item.createdAt}</span>
                    </div>
                    <p className="text-[var(--text-secondary)]">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Social Links Card */}
        <aside className="lg:col-span-5 rounded-2xl a1-surface p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
              Connect With Us
            </h3>
            <button
              type="button"
              onClick={() => {
                setDraftSocials(socials);
                setEditingSocials((v) => !v);
              }}
              className="text-xs font-medium text-[var(--accent-blue)] hover:underline"
            >
              {editingSocials ? 'Cancel' : 'Edit IDs'}
            </button>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Reach out directly for collaborations, study resource contributions,
            or platform updates.
          </p>

          {editingSocials ? (
            <form onSubmit={handleSaveSocials} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  Email ID
                </label>
                <input
                  type="email"
                  value={draftSocials.emailId}
                  onChange={(e) =>
                    setDraftSocials((s) => ({
                      ...s,
                      emailId: e.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl a1-surface-secondary px-3 py-2 text-xs text-[var(--text-primary)]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  Instagram ID
                </label>
                <input
                  type="text"
                  value={draftSocials.instagramId}
                  onChange={(e) =>
                    setDraftSocials((s) => ({
                      ...s,
                      instagramId: e.target.value,
                    }))
                  }
                  placeholder="@your_instagram_id"
                  className="w-full rounded-xl a1-surface-secondary px-3 py-2 text-xs text-[var(--text-primary)]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={draftSocials.linkedinUrl}
                  onChange={(e) =>
                    setDraftSocials((s) => ({
                      ...s,
                      linkedinUrl: e.target.value,
                    }))
                  }
                  placeholder="https://www.linkedin.com/in/..."
                  className="w-full rounded-xl a1-surface-secondary px-3 py-2 text-xs text-[var(--text-primary)]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={draftSocials.githubUrl}
                  onChange={(e) =>
                    setDraftSocials((s) => ({
                      ...s,
                      githubUrl: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl a1-surface-secondary px-3 py-2 text-xs text-[var(--text-primary)]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold"
              >
                Save Profile Links
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <a
                href={`mailto:${socials.emailId}`}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl a1-surface-secondary hover:border-[var(--accent-blue)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">
                      Email ID
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {socials.emailId}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
              </a>

              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl a1-surface-secondary hover:border-[var(--accent-blue)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Instagram className="w-5 h-5 text-[var(--accent-purple)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">
                      Instagram ID
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {socials.instagramId}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
              </a>

              <a
                href={socials.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl a1-surface-secondary hover:border-[var(--accent-blue)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Linkedin className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">
                      LinkedIn Profile
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {socials.linkedinUrl}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
              </a>

              <a
                href={socials.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl a1-surface-secondary hover:border-[var(--accent-blue)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Github className="w-5 h-5 text-[var(--text-primary)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">
                      GitHub URL
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {socials.githubUrl}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
              </a>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
};
