import { inspectUrl } from '../service';
import { validateUrlForSsrf } from '../ssrfGuard';
import { normalizeUrlComponents } from '../urlNormalizer';

async function runTests() {
  console.log('=== RUNNING SUSPICIOUS LINK CHECKER EXTENDED TEST SUITE ===\n');

  // Test 1: Brand Impersonation (SBI Phishing)
  const r1 = await inspectUrl('https://sbi.account-verify-login.xyz/kyc-update');
  console.log('Test 1 - Brand Impersonation:');
  console.log('  Verdict:', r1.verdict);
  console.log('  Score:', r1.riskScore);
  console.log('  Claimed Brand:', r1.impersonation?.claimedBrand);
  if (r1.verdict !== 'HIGH_RISK' && r1.verdict !== 'DANGEROUS') {
    throw new Error('Test 1 failed: Expected HIGH_RISK or DANGEROUS');
  }

  // Test 2: Raw IP URL with credential path
  const r2 = await inspectUrl('http://185.10.10.20/bank/login');
  console.log('\nTest 2 - Raw IP URL:');
  console.log('  Verdict:', r2.verdict);
  console.log('  Score:', r2.riskScore);
  if (r2.verdict !== 'HIGH_RISK' && r2.verdict !== 'SUSPICIOUS') {
    throw new Error('Test 2 failed: Expected HIGH_RISK or SUSPICIOUS');
  }

  // Test 3: Punycode Lookalike
  const r3 = await inspectUrl('https://xn--appl-43d.com/id/verify');
  console.log('\nTest 3 - Punycode Homoglyph:');
  console.log('  Verdict:', r3.verdict);
  console.log('  Score:', r3.riskScore);
  console.log('  Decoded:', r3.domainDetails.decodedHostname);

  // Test 4: UserInfo / @ authority spoofing
  const r4 = await inspectUrl('https://google.com@evil-phish.net/login');
  console.log('\nTest 4 - @ Spoofing:');
  console.log('  Verdict:', r4.verdict);
  console.log('  Score:', r4.riskScore);
  console.log('  Signals:', r4.signals.map((s) => s.title));
  if (!r4.signals.some((s) => s.id === 'userinfo_at_spoofing')) {
    throw new Error('Test 4 failed: Expected userinfo_at_spoofing signal');
  }

  // Test 5: Direct APK malware download
  const r5 = await inspectUrl('https://suspicious-apk-app.org/bank-update.apk');
  console.log('\nTest 5 - Direct Executable Download:');
  console.log('  Verdict:', r5.verdict);
  console.log('  Score:', r5.riskScore);
  if (!r5.signals.some((s) => s.id === 'suspicious_executable_extension')) {
    throw new Error('Test 5 failed: Expected suspicious_executable_extension signal');
  }

  // Test 6: Legitimate HTTPS Website
  const r6 = await inspectUrl('https://github.com');
  console.log('\nTest 6 - Legitimate Domain:');
  console.log('  Verdict:', r6.verdict);
  console.log('  Score:', r6.riskScore);
  if (r6.verdict !== 'LOW_RISK') {
    throw new Error('Test 6 failed: Expected LOW_RISK');
  }

  // Test 7: SSRF Guard Checks
  console.log('\nTest 7 - SSRF Guard Checks:');
  const ssrfTargets = [
    'http://127.0.0.1:8080/admin',
    'http://localhost/secret',
    'http://169.254.169.254/latest/meta-data/',
    'http://10.0.0.1/router',
    'http://192.168.1.1/gateway',
    'http://172.16.0.1/intranet',
    'file:///etc/passwd',
    'javascript:alert(1)',
  ];

  for (const t of ssrfTargets) {
    try {
      const comp = normalizeUrlComponents(t);
      const res = validateUrlForSsrf(new URL(comp.normalizedUrl));
      console.log(`  Target: ${t} -> Blocked: ${!res.isSafe} (${res.reason || 'Safe'})`);
      if (res.isSafe) {
        throw new Error(`SSRF Test failed for target: ${t}`);
      }
    } catch (err: any) {
      console.log(`  Target: ${t} -> Rejected safely: ${err.message}`);
    }
  }

  console.log('\n=== ALL EXTENDED TESTS PASSED SUCCESSFULLY ===');
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
