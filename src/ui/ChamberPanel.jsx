import { createContext, useContext } from 'react';
import { Mail, Linkedin, Github, Binary, Trophy, Phone } from 'lucide-react';
import { Carved } from './Carved';
import { profile, about, achievements, experience, skills, projects, education } from '../data';

/* ------------------------------------------------------------------ *
 * The inscribed marble tablet that every chamber's text sits on.
 * Same surface in the 3D overlay and in the reduced-motion fallback,
 * so the two modes read as one identity.
 * ------------------------------------------------------------------ */
const PanelCtx = createContext({ scroll: false, viewReveal: false });

function CarvedHeading(props) {
  const { viewReveal } = useContext(PanelCtx);
  return <Carved animateOnView={viewReveal} {...props} />;
}

export function Tablet({ children, wide = false }) {
  const { scroll } = useContext(PanelCtx);
  return (
    <div
      data-scroll-panel={scroll ? '' : undefined}
      className={`marble-field tablet-scroll relative border border-flame/25 ${
        wide ? 'max-w-3xl' : 'max-w-chamber'
      } ${
        scroll ? 'max-h-[82vh] overflow-y-auto overscroll-contain' : 'overflow-hidden'
      } w-full px-7 py-8 sm:px-10 sm:py-11 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_-2px_10px_rgba(70,80,90,0.12)_inset,0_36px_90px_-34px_rgba(30,40,50,0.55)]`}
    >
      <div className="meander mb-6" />
      <div className="relative">{children}</div>
    </div>
  );
}

const heading =
  'font-inscription uppercase tracking-[0.18em] text-2xl sm:text-3xl carved-dark';
const kicker =
  'font-inscription text-[10px] sm:text-[11px] uppercase tracking-chisel text-flame';
const body = 'font-serif text-lg sm:text-xl leading-relaxed text-ink/80';

function Rule() {
  return <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-flame/55 to-transparent" />;
}

function Meter({ level }) {
  return (
    <span className="ml-auto inline-flex gap-[3px]" aria-label={`${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-3.5 w-[5px] ${i < level ? 'bg-flame' : 'bg-ink/12'}`}
        />
      ))}
    </span>
  );
}

/* --------------------------------- chambers --------------------------------- */

function Hero() {
  return (
    <Tablet>
      <p className={kicker}>{profile.role} &nbsp;·&nbsp; Oracle &nbsp;·&nbsp; OCI MARS</p>
      <Carved
        text={profile.name}
        as="h1"
        className="mt-4 font-inscription uppercase leading-[1.05] tracking-[0.12em] text-[13vw] sm:text-6xl carved-dark"
      />
      <Rule />
      <p className={`${body} max-w-xl`}>
        <span className="text-ink">{profile.tagline}</span> {profile.value}
      </p>
      <p className="mt-5 font-inscription text-[11px] uppercase tracking-[0.24em] text-ink-soft">
        {profile.location}
      </p>
    </Tablet>
  );
}

function About() {
  return (
    <Tablet wide>
      <p className={kicker}>Chamber II. The atrium</p>
      <CarvedHeading text="About" as="h2" className={`mt-3 ${heading}`} />
      <Rule />
      <div className="space-y-4">
        {about.map((p, i) => (
          <p key={i} className={i === 0 ? `${body} text-ink` : body}>
            {p}
          </p>
        ))}
      </div>
      <Rule />
      <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {achievements.map(([k, v]) => (
          <li key={k + v} className="flex items-baseline gap-3">
            <span className="font-inscription text-sm uppercase tracking-[0.14em] text-flame">
              {k}
            </span>
            <span className="font-serif text-base text-ink-soft">{v}</span>
          </li>
        ))}
      </ul>
    </Tablet>
  );
}

function Experience() {
  return (
    <Tablet wide>
      <p className={kicker}>Chamber III. The colonnade</p>
      <CarvedHeading text="Experience" as="h2" className={`mt-3 ${heading}`} />
      <Rule />
      <div className="space-y-8">
        {experience.map((job) => (
          <article key={job.company} className="border-l-2 border-flame/50 pl-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-inscription text-base uppercase tracking-[0.12em] text-ink">
                {job.role} <span className="text-flame">· {job.company}</span>
              </h3>
              <span className="font-inscription text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                {job.period}
              </span>
            </div>
            <p className="mt-2 font-serif text-base leading-relaxed text-ink-soft">
              {job.summary}
            </p>
            <div className="mt-3 space-y-3">
              {job.tracks.map((tr) => (
                <div key={tr.name}>
                  <p className="font-inscription text-[10px] uppercase tracking-[0.2em] text-flame">
                    {tr.name}
                  </p>
                  <ul className="mt-1 space-y-1.5">
                    {tr.points.map((pt, i) => (
                      <li key={i} className="flex gap-2 font-serif text-[15px] leading-snug text-ink/75">
                        <span className="mt-2 h-1 w-2 shrink-0 bg-flame/70" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Tablet>
  );
}

function Skills() {
  return (
    <Tablet wide>
      <p className={kicker}>Chamber IV. The tablets</p>
      <CarvedHeading text="Skills" as="h2" className={`mt-3 ${heading}`} />
      <Rule />
      <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {skills.map((cat) => (
          <div key={cat.group}>
            <h3 className="mb-2 font-inscription text-[11px] uppercase tracking-[0.2em] text-flame">
              {cat.group}
            </h3>
            <ul className="space-y-1.5">
              {cat.items.map(([name, lvl]) => (
                <li key={name} className="flex items-center gap-3 font-serif text-base text-ink/80">
                  <span>{name}</span>
                  <Meter level={lvl} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Tablet>
  );
}

function Projects() {
  return (
    <Tablet wide>
      <p className={kicker}>Chamber V. The exhibits</p>
      <CarvedHeading text="Projects" as="h2" className={`mt-3 ${heading}`} />
      <Rule />
      <div className="space-y-7">
        {projects.map((pr, i) => (
          <article key={pr.title} className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-inscription text-3xl text-ink/15">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-inscription text-[10px] uppercase tracking-[0.18em] text-flame">
                  {pr.tag}
                </span>
              </div>
              <h3 className="mt-1 font-inscription text-base uppercase tracking-[0.1em] text-ink">
                {pr.title}
              </h3>
              <p className="mt-2 font-serif text-[15px] leading-snug text-ink-soft">{pr.built}</p>
              <p className="mt-2 font-inscription text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
                {pr.stack.join('  ·  ')}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 self-start border-l border-flame/25 pl-4">
              {pr.impact.map(([stat, label]) => (
                <div key={label}>
                  <dt className="font-inscription text-base text-ink">{stat}</dt>
                  <dd className="font-serif text-[13px] leading-tight text-ink-soft">{label}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
      <Rule />
      <p className="font-inscription text-[10px] uppercase tracking-[0.2em] text-flame">
        {education.school}
      </p>
      <p className="font-serif text-base text-ink-soft">
        {education.degree} &nbsp;·&nbsp; {education.period} &nbsp;·&nbsp; {education.detail}
      </p>
    </Tablet>
  );
}

const LINKS = [
  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com', href: profile.links.linkedin },
  { icon: Github, label: 'GitHub', value: 'github.com', href: profile.links.github },
  { icon: Trophy, label: 'LeetCode', value: 'Knight · 1949', href: profile.links.leetcode },
  { icon: Binary, label: 'Codeforces', value: 'Specialist · 1449', href: profile.links.codeforces },
];

function Contact() {
  return (
    <Tablet>
      <p className={kicker}>Chamber VI. The altar</p>
      <CarvedHeading text="Let us talk" as="h2" className={`mt-3 ${heading}`} />
      <Rule />
      <p className={`${body}`}>
        Open to conversations about distributed systems, data-integrity problems, and backend
        platform work. Fastest on email.
      </p>
      <a
        href={`mailto:${profile.email}`}
        className="mt-6 inline-flex items-center gap-3 border border-flame bg-flame px-6 py-3.5 font-inscription text-[11px] uppercase tracking-[0.2em] text-[#231204] transition-colors hover:bg-transparent hover:text-flame"
      >
        <Mail size={15} strokeWidth={1.5} /> {profile.email}
      </a>
      <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {LINKS.map(({ icon: Icon, label, value, href }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="group flex items-center gap-3 text-ink-soft transition-colors hover:text-ink"
            >
              <Icon size={16} strokeWidth={1.5} className="text-flame" />
              <span className="font-inscription text-[10px] uppercase tracking-[0.16em]">
                {label}
              </span>
              <span className="font-serif text-[15px]">{value}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-inscription text-[9px] uppercase tracking-[0.22em] text-ink-soft/60">
        © {new Date().getFullYear()} Rahul Ranjan. Built as a walk through a marble hall
      </p>
    </Tablet>
  );
}

const MAP = {
  hero: Hero,
  about: About,
  experience: Experience,
  skills: Skills,
  work: Projects,
  contact: Contact,
};

export default function ChamberPanel({ id, scroll = false, viewReveal = false }) {
  const Cmp = MAP[id] || Hero;
  return (
    <PanelCtx.Provider value={{ scroll, viewReveal }}>
      <Cmp />
    </PanelCtx.Provider>
  );
}
