// All content sourced from rahulranjan_resume_july.pdf - no invented achievements.

export const profile = {
  name: 'Rahul Ranjan',
  role: 'Software Engineer',
  tagline: 'I build and operate billion-scale distributed backend systems.',
  value:
    'Three years at Oracle running the migration and validation services behind OCI MARS, a tier-0 artifact platform that CI/CD and security patching depend on.',
  location: 'Bengaluru, India',
  email: 'rahulranjan5sep@gmail.com',
  phone: '+91 88735 84854',
  // NOTE: resume lists these platforms without URLs - replace the handles below with your real ones.
  links: {
    linkedin: 'https://www.linkedin.com/in/rahulranjan5/',
    github: 'https://github.com/codingkick',
    leetcode: 'https://leetcode.com/u/codingkick/',
    codeforces: 'https://codeforces.com/profile/perseverance_2021',
  },
};

export const about = [
  'I work on the unglamorous half of infrastructure: moving data at a scale where a 1% error rate means ten million broken records, and making sure the system can tell you exactly which ten million.',
  'At Oracle I own the migration and validation services for OCI MARS, an internal artifact platform that CI/CD pipelines and security patching build on top of. That has meant migrating 1B+ Docker artifacts out of JFrog Artifactory, rewriting SQL that ran for two minutes so it runs in fifteen seconds, and building the self-healing workflows that fix inconsistencies before a human has to look at them.',
  'Outside of work I compete (Knight on LeetCode, Specialist on Codeforces), which is mostly where the instinct for tight, correct code comes from.',
];

export const experience = [
  {
    company: 'Oracle',
    role: 'Member of Technical Staff',
    place: 'Bengaluru, India',
    start: 'Jun 2023',
    end: 'May 2026',
    period: '2023 - 2026',
    summary:
      'End-to-end development and operations of the migration and validation services for OCI MARS, a tier-0 internal artifact platform underpinning CI/CD and security patching for billion-scale datasets.',
    tracks: [
      {
        name: 'Migration Service',
        points: [
          'Led end-to-end migration of large-scale artifact repositories from Artifactory (JFrog) to internal MARS: 1B+ Docker artifacts and 11M+ generic artifacts at 99% data integrity with zero critical outages.',
          'Designed and optimized high-performance SQL for billion-scale datasets, cutting average query latency from 120s to 15s and compute cost by ~25%.',
        ],
      },
      {
        name: 'Validation Service',
        points: [
          'Built a scalable validation system ensuring consistency between Artifactory and MARS across 1B+ records, raising data correctness from 99% to 99.99%.',
          'Developed automated self-healing remediation workflows that auto-fixed ~5M validation failures and cut manual effort by 90%.',
          'Reduced MTTR for migration incidents from 45 min to 10 min with Grafana dashboards, runbooks, and internal operational tooling.',
          'Identified and resolved 10+ production issues and security vulnerabilities (DB connection leaks, API defects, security patching) before they reached CI/CD.',
        ],
      },
    ],
  },
  {
    company: 'GAP Inc',
    role: 'Software Engineer Intern',
    place: 'Hyderabad, India',
    start: 'Jun 2022',
    end: 'Aug 2022',
    period: 'Summer 2022',
    summary: 'Observability work for the Product Augmentation team.',
    tracks: [
      {
        name: 'Observability',
        points: [
          'Designed 15+ Splunk dashboards tracking 50+ schedules and processes, reducing MTTR through real-time anomaly detection.',
          'Built a proof-of-concept for New Relic Java agent installation across 5 microservices, capturing 90% of custom metrics such as thread-pool usage and API latency.',
        ],
      },
    ],
  },
];

export const projects = [
  {
    tag: 'OCI MARS',
    title: 'Artifact repository migration',
    built:
      'Orchestrated the move of 1B+ Docker artifacts and 11M+ generic artifacts from JFrog Artifactory into Oracle’s internal MARS platform, designing the batching, retry, and cutover strategy.',
    stack: ['Java', 'Spring Boot', 'SQL', 'Kafka', 'OCI'],
    impact: [
      ['99%', 'data integrity across the migration'],
      ['0', 'critical outages during cutover'],
      ['~25%', 'lower compute cost from query tuning'],
      ['120s → 15s', 'average query latency'],
    ],
  },
  {
    tag: 'OCI MARS',
    title: 'Migration validation & self-healing',
    built:
      'A validation service that continuously reconciles Artifactory against MARS, plus remediation workflows that repair detected inconsistencies without human intervention.',
    stack: ['Java', 'Spring Boot', 'Distributed Systems', 'Grafana'],
    impact: [
      ['99% → 99.99%', 'data correctness across 1B+ records'],
      ['~5M', 'validation failures auto-remediated'],
      ['90%', 'reduction in manual effort'],
      ['45m → 10m', 'MTTR for migration incidents'],
    ],
  },
  {
    tag: 'GAP Inc',
    title: 'Observability rollout',
    built:
      'Splunk dashboards for the Product Augmentation team and a New Relic Java-agent proof-of-concept across five microservices.',
    stack: ['Splunk', 'New Relic', 'Java'],
    impact: [
      ['15+', 'Splunk dashboards built'],
      ['50+', 'schedules & processes tracked'],
      ['90%', 'custom metrics captured in the PoC'],
    ],
  },
];

export const skills = [
  {
    group: 'Languages',
    items: [
      ['C++', 5],
      ['Java', 5],
      ['Python', 5],
      ['SQL', 5],
    ],
  },
  {
    group: 'Backend & Distributed',
    items: [
      ['Spring Boot', 5],
      ['Microservices', 4],
      ['REST APIs', 5],
      ['Kafka', 5],
      ['Distributed Systems', 5],
      ['Node.js', 3],
    ],
  },
  {
    group: 'Data & Storage',
    items: [
      ['MySQL', 5],
      ['Oracle DB', 5],
      ['MongoDB', 4],
      ['Firebase', 4],
    ],
  },
  {
    group: 'Ops & Cloud',
    items: [
      ['OCI', 5],
      ['Grafana', 5],
      ['Splunk', 4],
    ],
  },
  {
    group: 'AI / Applied',
    items: [
      ['LangChain', 5],
      ['RAG', 4],
      ['Langgraph', 4],
    ],
  },
];

export const education = {
  school: 'National Institute of Technology, Jaipur',
  degree: 'B.Tech, Computer Science and Engineering',
  period: 'Aug 2019 - May 2023',
  detail: 'CGPA 8.13 / 10',
  coursework: [
    'Data Structures & Algorithms',
    'Object-Oriented Programming',
    'Database Management Systems',
  ],
};

export const achievements = [
  ['Knight', 'LeetCode, max rating 1949, top 3.3%'],
  ['Rank 53', 'LeetCode contest, out of ~17,000 contestants'],
  ['Specialist', 'Codeforces, max rating 1449'],
  ['Rank 95', 'CodeChef contest'],
];
