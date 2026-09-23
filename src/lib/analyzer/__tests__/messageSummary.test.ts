import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateFraudPatterns, generateMessageSummary } from '../fraudPatternEngine';
test('text1: summary stays grounded in source or explicitly abstains', () => {
 const text='State Bank of India: Your SBI KYC is pending. Download SBI_KYC.apk to avoid account blocking immediately.';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text2: summary stays grounded in source or explicitly abstains', () => {
 const text='*URGENTLY REQUIRED:-Your Bank of Maharashtra ReKYC pending for Bank of Maharashtra CustID XXXX.Complete ReKYC Last Date 13.may 2025 to avoid A/c blocking. Open PDF file. Immediately Thank you! 18 MB · APK';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text3: summary stays grounded in source or explicitly abstains', () => {
 const text="You've missed our delivery. To reschedule delivery of your parcel, please visit: https://myparcel-ups.com.";
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text4: summary stays grounded in source or explicitly abstains', () => {
 const text="Congratulations! You've won a $500 gift card to Target. Click here to claim your reward: https://targetwinner.com";
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text5: summary stays grounded in source or explicitly abstains', () => {
 const text='Your Wells Fargo account has been locked for suspicious activity. Please call us at 201-429-3304 to verify your identity.';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text6: summary stays grounded in source or explicitly abstains', () => {
 const text='May you send me your emails and address for our record?';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text7: summary stays grounded in source or explicitly abstains', () => {
 const text='Florida toll services: We noticed an outstanding toll amount of $34.50 on your account. Please make a payment now to avoid a late fee: https://tolls-sunpass.com';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text8: summary stays grounded in source or explicitly abstains', () => {
 const text='May I share the job information with you? Great. We are Big Mover Company Llc. Your role is to right Google reviews for us. Each review pays $10. Can I share the links to the Google Doc with you?';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text9: summary stays grounded in source or explicitly abstains', () => {
 const text='Your OTP for ICICI NetBanking login is 849201. Valid for 5 mins. Do not share OTP with anyone including bank staff.';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text10: summary stays grounded in source or explicitly abstains', () => {
 const text='HDFC Bank: Rs 4,500.00 credited to A/C XX4920 on 12-FEB-26 by UPI/Salary. Avl Bal: Rs 52,430.00.';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text11: summary stays grounded in source or explicitly abstains', () => {
 const text='Aapka bank account block ho gaya hai. Turant diye gaye link par click karke KYC complete karein nahi to account band ho jayega: https://sbi-kyc-update.com';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
test('text12: summary stays grounded in source or explicitly abstains', () => {
 const text='Hey, what time are we meeting for lunch tomorrow? Let me know!';
 const r=evaluateFraudPatterns(text);
 const literal=generateMessageSummary(text, '', {}, null, [], [], [], []);
 assert.ok(literal.includes(text.replace(/\s+/g, ' ').trim().slice(0,600)));
 if (r.verdict === 'INSUFFICIENT_EVIDENCE') { assert.match(r.summary,/No reliable match/); assert.equal(r.matchedPatternId,undefined); }
});
