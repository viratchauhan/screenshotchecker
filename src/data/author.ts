// The site's author: shown in guide bylines, the author page and Person schema.
export const SITE_AUTHOR = {
  name: 'Virat Chauhan',
  url: 'https://screenshotchecker.com/author/virat-chauhan/',
  path: '/author/virat-chauhan/',
  jobTitle: 'Founder and developer, ScreenshotChecker',
  shortBio:
    'Virat Chauhan builds ScreenshotChecker and writes its guides from published advice by banks, payment apps and government cyber-safety teams.',
  sameAs: [
    'https://www.linkedin.com/in/viratchauhan1/',
    'https://github.com/viratchauhan',
  ],
};

export const authorSchema = {
  '@type': 'Person',
  '@id': `${SITE_AUTHOR.url}#person`,
  name: SITE_AUTHOR.name,
  url: SITE_AUTHOR.url,
  jobTitle: SITE_AUTHOR.jobTitle,
  worksFor: { '@id': 'https://screenshotchecker.com/#organization' },
  sameAs: SITE_AUTHOR.sameAs,
};
