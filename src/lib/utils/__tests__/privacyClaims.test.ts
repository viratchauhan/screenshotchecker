import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { getToolFaqs } from '../../../data/toolFaqs';

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');

test('shared copy avoids whole-site zero-data or zero-storage guarantees', () => {
  const paths = [
    'components/TrustPrivacy.astro', 'components/Footer.astro', 'components/Hero.astro',
    'components/HowItWorks.astro', 'components/SeoContent.astro', 'pages/privacy.astro',
    'pages/about.astro', 'pages/image-metadata-remover.astro',
    'components/Uploader.astro', 'components/workspaces/RedactorWorkspace.astro',
  ];
  for (const path of paths) {
    assert.doesNotMatch(read(path), /Zero Data Leaves|Zero Data Storage|Zero Server Storage|zero data retained|100% In-Browser Privacy|Privacy Guarantee|zero-knowledge|Transmitted: 0 Bytes|personal data never leave|zero\s*<code>POST/i, path);
  }
  assert.match(read('components/TrustPrivacy.astro'), /analytics.*downloads.*session storage/is);
});

test('policy separates processing, analytics, storage and explicit URL submission', () => {
  const policy = read('pages/privacy.astro');
  for (const text of ['Google Analytics', 'cookies', 'original image', 'sessionStorage',
    'source-tool label and timestamp', 'not a scheduled deletion timer',
    'successful read or New Scan does not clear', 'session restoration',
    'localStorage', 'ten recent URL results', 'Clear History',
    'full trimmed URL or message', '/api/check-link', 'request method alone']) {
    assert.ok(policy.includes(text), text);
  }
  assert.doesNotMatch(policy, /guaranteed deletion|deleted after one hour|only in (?:RAM|memory)/i);
});

test('shared OCR, redactor and scanner FAQs disclose storage and page requests', () => {
  for (const slug of ['screenshot-ocr', 'screenshot-redactor', 'screenshot-privacy-checker']) {
    const answers = getToolFaqs(slug).map(faq => faq.answer).join(' ');
    assert.match(answers, /sessionStorage/, slug);
    assert.match(answers, /analytics/, slug);
    assert.match(answers, /privacy policy/, slug);
    assert.doesNotMatch(answers, /completely in-memory|ever recorded or transmitted/, slug);
  }
  const linkFaq = getToolFaqs('suspicious-link-checker').map(faq => faq.answer).join(' ');
  assert.match(linkFaq, /POSTs the full trimmed submission/);
  assert.match(linkFaq, /localStorage.*Clear History/);
});

test('every language keeps the privacy badge scoped to browser image processing', () => {
  const expected: Record<string, string> = {
    en: 'Image processing in your browser', de: 'Bildverarbeitung in Ihrem Browser',
    es: 'Procesamiento de imágenes en tu navegador', fr: 'Traitement des images dans votre navigateur',
    hi: 'आपके ब्राउज़र में इमेज प्रोसेसिंग', ja: 'ブラウザ内で画像を処理',
  };
  for (const [language, value] of Object.entries(expected)) {
    assert.equal(JSON.parse(read(`i18n/${language}.json`))['hero.privacy_pill'], value);
  }
  assert.ok(read('components/Hero.astro').includes(`>${expected.en}</span>`));
});
