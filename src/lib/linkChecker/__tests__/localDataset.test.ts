import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, extractRegistrableDomain } from '../urlNormalizer';
import { verifyUrlLocally, verifyMessageUrlsLocally } from '../localDatasetService';

describe('Local Dataset URL Verification Suite (urldata.csv)', () => {
  it('1. Exact URL match identifies exact URL record from dataset', async () => {
    const report = await verifyUrlLocally('https://crackspider.us/toolbar/install.php?pack=exe');
    assert.equal(report.matched, true);
    assert.equal(report.matchLevel, 'EXACT_URL');
    assert.equal(report.label, 'bad');
    assert.equal(report.verdict, 'KNOWN_BAD');
  });

  it('2. Exact hostname match identifies bad domain in dataset', async () => {
    const report = await verifyUrlLocally('diaryofagameaddict.com');
    assert.equal(report.matched, true);
    assert.equal(report.label, 'bad');
    assert.equal(report.verdict, 'KNOWN_BAD');
  });

  it('3. Registrable domain match matches sub-pages of known domain', async () => {
    const report = await verifyUrlLocally('https://iamagameaddict.com/any/random/path');
    assert.equal(report.matched, true);
    assert.equal(report.label, 'bad');
    assert.equal(report.verdict, 'KNOWN_BAD');
  });

  it('4. www variation matches seamlessly', async () => {
    const report = await verifyUrlLocally('https://www.diaryofagameaddict.com');
    assert.equal(report.matched, true);
    assert.equal(report.label, 'bad');
  });

  it('5. HTTP / HTTPS variation normalizes properly', async () => {
    const reportHttp = await verifyUrlLocally('http://kalantzis.net');
    const reportHttps = await verifyUrlLocally('https://kalantzis.net');
    assert.equal(reportHttp.matched, true);
    assert.equal(reportHttps.matched, true);
    assert.equal(reportHttp.label, reportHttps.label);
  });

  it('6. Trailing slash variation normalizes properly', async () => {
    const reportSlash = await verifyUrlLocally('https://pos-kupang.com/');
    const reportNoSlash = await verifyUrlLocally('https://pos-kupang.com');
    assert.equal(reportSlash.matched, true);
    assert.equal(reportNoSlash.matched, true);
  });

  it('7. Uppercase URL normalizes to lowercase hostname', async () => {
    const report = await verifyUrlLocally('HTTPS://TODDSCARWASH.COM/INDEX.HTML');
    assert.equal(report.matched, true);
    assert.equal(report.label, 'bad');
    assert.equal(report.target.hostname, 'toddscarwash.com');
  });

  it('8. Subdomain on known domain correctly resolves registrable domain', async () => {
    const report = await verifyUrlLocally('https://portal.secure.tubemoviez.com/watch');
    assert.equal(report.matched, true);
    assert.equal(report.target.registrableDomain, 'tubemoviez.com');
    assert.equal(report.label, 'bad');
  });

  it('9. Attacker domain containing target name (target.com.attacker.com) does NOT match target.com', async () => {
    const regDomain = extractRegistrableDomain('tubemoviez.com.attackerdomain123.com');
    assert.equal(regDomain, 'attackerdomain123.com');

    const report = await verifyUrlLocally('https://tubemoviez.com.attackerdomain123.com');
    // Registrable domain is attackerdomain123.com, so it must not falsely match tubemoviez.com
    assert.notEqual(report.target.registrableDomain, 'tubemoviez.com');
    assert.equal(report.matched, false);
    assert.equal(report.verdict, 'NO_LOCAL_MATCH');
  });

  it('10. notgoogle.com does NOT match google.com', async () => {
    const regDomain = extractRegistrableDomain('notgoogle.com');
    assert.equal(regDomain, 'notgoogle.com');
    assert.notEqual(regDomain, 'google.com');
  });

  it('11. Multi-part TLD .co.uk extracts registrable domain properly', () => {
    const regDomain = extractRegistrableDomain('test.bank.co.uk');
    assert.equal(regDomain, 'bank.co.uk');
  });

  it('12. Multi-part TLD .com.au matches dataset record', async () => {
    const report = await verifyUrlLocally('https://espdesign.com.au');
    assert.equal(report.target.registrableDomain, 'espdesign.com.au');
    assert.equal(report.matched, true);
    assert.equal(report.label, 'bad');
  });

  it('13. Multi-part TLD .co.in extracts registrable domain properly', () => {
    const regDomain = extractRegistrableDomain('login.service.co.in');
    assert.equal(regDomain, 'service.co.in');
  });

  it('14. Invalid / Malformed URL returns INVALID_URL verdict', async () => {
    const report = await verifyUrlLocally('ftp://invalid-protocol');
    assert.equal(report.verdict, 'INVALID_URL');
  });

  it('15. Empty input returns INVALID_URL', async () => {
    const report = await verifyUrlLocally('');
    assert.equal(report.verdict, 'INVALID_URL');
  });

  it('16. Extremely long URL (> 2048 chars) normalizes without crashing', async () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(3000);
    const norm = normalizeUrl(longUrl);
    assert.equal(norm.isValid, true);
    assert.equal(norm.registrableDomain, 'example.com');
  });

  it('17. Good classification in dataset is reported accurately', async () => {
    const report = await verifyUrlLocally('https://en.wikipedia.org/wiki/Bernard_Avishai');
    assert.equal(report.matched, true);
    assert.equal(report.label, 'good');
    assert.equal(report.verdict, 'GOOD');
    assert.ok(report.summary.includes('classified as "good"'));
  });

  it('18. Unknown domain returns NO_LOCAL_MATCH without claiming safe', async () => {
    const report = await verifyUrlLocally('https://myunlistedcustomtestsite998877.org');
    assert.equal(report.matched, false);
    assert.equal(report.matchLevel, 'NONE');
    assert.equal(report.verdict, 'NO_LOCAL_MATCH');
    assert.ok(report.explanation.includes('Not being found in the dataset does not guarantee that the URL is safe'));
    assert.ok(!report.summary.toLowerCase().includes('is safe'));
  });

  it('19. Multiple URLs in text message are analyzed independently', async () => {
    const message = 'Check https://diaryofagameaddict.com and https://myunlisteddomain123.xyz and https://en.wikipedia.org/wiki/Bernie_Parent';
    const multi = await verifyMessageUrlsLocally(message);
    assert.equal(multi.extractedUrls.length, 3);
    assert.equal(multi.reports.length, 3);
    assert.equal(multi.reports[0].verdict, 'KNOWN_BAD');
    assert.equal(multi.reports[1].verdict, 'NO_LOCAL_MATCH');
    assert.equal(multi.reports[2].verdict, 'GOOD');
  });

  it('20. Transparent technical details are always returned', async () => {
    const report = await verifyUrlLocally('https://sub.diaryofagameaddict.com:443/login?ref=test');
    assert.equal(report.domainDetails.hostname, 'sub.diaryofagameaddict.com');
    assert.equal(report.domainDetails.registrableDomain, 'diaryofagameaddict.com');
    assert.equal(report.domainDetails.subdomain, 'sub');
    assert.equal(report.domainDetails.protocol, 'HTTPS');
  });
});
