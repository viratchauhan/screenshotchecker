import { DICTIONARIES, type SupportedLanguage } from '../../../i18n';

const languages: SupportedLanguage[] = ['en', 'hi', 'es', 'fr', 'de', 'ja'];
const enKeys = Object.keys(DICTIONARIES.en);

let passedCount = 0;
let failedCount = 0;

console.log('================================================================');
console.log('            MULTI-LANGUAGE (i18n) INTEGRITY TEST SUITE          ');
console.log('================================================================\n');

for (const lang of languages) {
  console.log(`[Testing Language: ${lang.toUpperCase()}]`);
  const dict = DICTIONARIES[lang];
  let missingKeys: string[] = [];

  for (const key of enKeys) {
    if (!dict[key] || dict[key].trim() === '') {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length === 0) {
    console.log(`  ✓ 100% Key Completeness (${enKeys.length}/${enKeys.length} keys translated)`);
    console.log(`  ✓ Sample Title: "${dict['hero.title']}"`);
    console.log(`  ✓ Sample Action: "${dict['dashboard.protect_redact']}"`);
    console.log(`  ✓ PASS\n`);
    passedCount++;
  } else {
    console.error(`  ✗ Missing ${missingKeys.length} keys:`, missingKeys);
    console.error(`  ✗ FAIL\n`);
    failedCount++;
  }
}

console.log('================================================================');
console.log(`SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log('================================================================\n');

if (failedCount > 0) {
  process.exit(1);
}
