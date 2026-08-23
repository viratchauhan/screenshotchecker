---
name: fraud-sms-whatsapp-patterns
description: >-
  Expert pattern knowledge, indicators, extraction rules, and analysis guidelines
  for detecting Fraud SMS, Smishing, and WhatsApp Scams from screenshots.
---

# Fraud SMS & WhatsApp Scam Pattern Knowledge Base

This skill provides comprehensive pattern recognition rules, indicator matrices, signal extraction guidelines, and multilingual explanation frameworks for analyzing SMS and WhatsApp screenshots.

---

## 1. Verified Fraud Screenshot Dataset

The following core patterns are verified from real-world fraud screenshots:

### Pattern 1: Bank Account Lockout / Vishing Bait
* **Screenshot OCR Text:**
  > "Your Wells Fargo account has been locked for suspicious activity. Please call us at 201-429-3304 to verify your identity."
* **Claimed Identity:** Wells Fargo (Major Financial Institution)
* **Attack Mechanism:** Urgent security fear tactic + Phone Phishing (Vishing)
* **Red Flag Signals:**
  - `account_threat`: Claims account locked for suspicious activity.
  - `urgency`: Pressures recipient to resolve immediately.
  - `phone_vishing`: Instructs user to dial an unverified standard phone number (201 area code) rather than the official number printed on their card or in the banking app.
  - `identity_harvesting`: Stated goal is to "verify your identity" (harvest SSN, PIN, OTP, card details).
* **Risk Score:** 92/100 (HIGH RISK)
* **Scam Category:** `Bank Phishing / Account Takeover / Vishing`
* **Hinglish Summary:**
  > "Ye message claim kar raha hai ki aapka Wells Fargo account suspicious activity ki wajah se lock kar diya gaya hai aur identity verify karne ke liye 201-429-3304 par call karne ko bol raha hai. Bank kabhi bhi aise random number par call karke identity verify karne ko nahi kehta."
* **Recommended Action:**
  > Do not call the provided number. Open your official Wells Fargo banking app or call the verified customer care number printed on the back of your debit/credit card.

---

### Pattern 2: Student Loan Forgiveness / Debt Relief Bait
* **Screenshot OCR Text:**
  > "You may qualify for a new student loan forgiveness program! Enrollment ends soon. Call 1-855-412-0901 to apply now."
* **Claimed Identity:** Government / Federal Student Loan Program (implied)
* **Attack Mechanism:** Advance-fee debt relief bait + Artificial deadline pressure + Toll-free call-back
* **Red Flag Signals:**
  - `financial_incentive`: Unsolicited claim of qualifying for student loan forgiveness.
  - `urgency`: "Enrollment ends soon" / "apply now".
  - `unsolicited_outreach`: Cold SMS outreach to an unverified recipient.
  - `phone_vishing`: Unknown 1-855 toll-free number designed to harvest personal information or charge upfront "processing fees".
* **Risk Score:** 88/100 (HIGH RISK)
* **Scam Category:** `Fake Loan / Government Impersonation Scam`
* **Hinglish Summary:**
  > "Ye message claim kar raha hai ki aap new student loan forgiveness program ke liye qualify ho gaye hain aur apply karne ke liye 1-855-412-0901 par call karein. Ye ek unsolicited debt-relief scam pattern hai jo upfront fees ya personal information steal karne ke liye use hota hai."
* **Recommended Action:**
  > Do not call the number. Check official government student aid portals (e.g. StudentAid.gov) directly for legitimate loan forgiveness information.

---

### Pattern 3: Retail Brand / $500 Gift Card Prize Scam
* **Screenshot OCR Text:**
  > "Congratulations! You've won a $500 gift card to Target. Click here to claim your reward: https://targetwinner.com"
* **Claimed Identity:** Target Corporation
* **Attack Mechanism:** Unsolicited lottery/reward incentive + Lookalike phishing domain (`targetwinner.com`)
* **Red Flag Signals:**
  - `unsolicited_prize`: "Congratulations! You've won a $500 gift card".
  - `brand_impersonation`: Using "Target" name to build trust.
  - `suspicious_domain`: Link goes to `targetwinner.com` (unrelated third-party domain, NOT `target.com`).
  - `data_harvesting`: Prompting to "claim your reward" by entering personal and credit card information for "shipping/handling".
* **Risk Score:** 95/100 (CRITICAL RISK)
* **Scam Category:** `Fake Prize / Gift Card Phishing Scam`
* **Hinglish Summary:**
  > "Ye message claim kar raha hai ki aapne Target ka $500 gift card jeeta hai aur link par click karke claim karne ko bol raha hai. Provided link (targetwinner.com) Target ki official website (target.com) nahi hai balki ek fake phishing page hai."
* **Recommended Action:**
  > Do not click the link or provide any personal information. Legitimate retailers do not send unsolicited $500 gift cards via random text messages.

---

### Pattern 4: Parcel Reschedule / UPS Delivery Phishing
* **Screenshot OCR Text:**
  > "You've missed our delivery. To reschedule delivery of your parcel, please visit: https://myparcel-ups.com."
* **Claimed Identity:** UPS (United Parcel Service)
* **Attack Mechanism:** Missed parcel pretext + Lookalike domain (`myparcel-ups.com`) + Redelivery fee harvesting
* **Red Flag Signals:**
  - `delivery_impersonation`: Claims missed parcel delivery without tracking number or recipient name.
  - `suspicious_domain`: Domain is `myparcel-ups.com` (spoofed / hyphenated domain, NOT official `ups.com`).
  - `action_pressure`: Pressures user to visit external link to reschedule.
  - `credential_credit_harvesting`: Fake page requests credit card for a $1-$3 "redelivery fee".
* **Risk Score:** 93/100 (HIGH RISK)
* **Scam Category:** `Parcel / Delivery Phishing Scam`
* **Hinglish Summary:**
  > "Ye message claim kar raha hai ki aapka ek parcel miss ho gaya hai aur delivery reschedule karne ke liye myparcel-ups.com par jana hoga. Ye UPS ka official portal (ups.com) nahi hai balki card details churane ke liye banayi gayi fake site hai."
* **Recommended Action:**
  > Do not click the link. If expecting a package, track it directly through the official UPS app or website using your original tracking number.

---

### Pattern 5: Road Toll / SunPass Late Fee Smishing
* **Screenshot OCR Text:**
  > "Florida toll services: We noticed an outstanding toll amount of $34.50 on your account. Please make a payment now to avoid a late fee: https://tolls-sunpass.com"
* **Claimed Identity:** Florida Toll Services / SunPass
* **Attack Mechanism:** Fake debt claim ($34.50) + Threat of late fees + Spoofed domain (`tolls-sunpass.com`)
* **Red Flag Signals:**
  - `government_toll_impersonation`: Claims to be "Florida toll services".
  - `financial_demand`: Demands urgent settlement of alleged $34.50 debt.
  - `penalty_threat`: "make a payment now to avoid a late fee".
  - `suspicious_domain`: `tolls-sunpass.com` is a fake phishing link (official portal is `sunpass.com`).
* **Risk Score:** 95/100 (CRITICAL RISK)
* **Scam Category:** `Toll / Smishing Payment Scam`
* **Hinglish Summary:**
  > "Ye message claim kar raha hai ki aapka $34.50 ka Florida toll bill pending hai aur late fee se bachne ke liye urgently payment karni hogi. Link (tolls-sunpass.com) fake hai aur direct payment harvesting ke liye banaya gaya hai."
* **Recommended Action:**
  > Do not make any payment through the link. Check your toll account independently on the official SunPass website (sunpass.com).

---

### Pattern 6: Bank ReKYC / APK Malicious Attachment (India Vector)
* **Screenshot OCR Text:**
  > "URGENT: Bank of Maharashtra ReKYC pending. To avoid A/c blocking, download and install attached Bank_of_Maharashtra.apk."
* **Claimed Identity:** Bank of Maharashtra
* **Attack Mechanism:** Account lockout threat + APK malware file
* **Red Flag Signals:**
  - `malicious_attachment`: Distribution of an `.apk` file for banking KYC.
  - `account_threat`: "avoid A/c blocking".
  - `urgency`: "URGENT".
* **Risk Score:** 98/100 (CRITICAL RISK)
* **Scam Category:** `Bank KYC Phishing + Malicious Attachment`
* **Recommended Action:**
  > Never install APK files received via SMS or WhatsApp. Banks only operate through Google Play Store / Apple App Store or physical branches.

---

### Pattern 7: WhatsApp Unsolicited Job / Google Review Scam
* **Screenshot OCR Text:**
  > "Hi! We offer part-time remote work. Like Google Maps locations and earn ₹2,000 to ₹5,000 daily. Reply YES to start."
* **Attack Mechanism:** Unsolicited WhatsApp message + Unrealistic compensation + Social engineering task progression
* **Risk Score:** 86/100 (HIGH RISK)
* **Scam Category:** `Fake Job / Task Scam`
* **Recommended Action:**
  > Block and report the sender on WhatsApp. Do not transfer any "deposit" or "prepaid task" money.

---

## 2. Core Detection & Analysis Pipeline

When analyzing any message screenshot:

```
Screenshot Image
  │
  ├─► 1. OCR Extraction (Full message text, Sender info, URLs, Phone numbers, Filenames)
  ├─► 2. Entity & Brand Extraction (Claimed Organization, Stated Amounts, Identifiers)
  ├─► 3. Link & Domain Security Audit (Official domain vs Lookalike/Hyphenated/Shortener)
  ├─► 4. Signal Analysis (Urgency, Threats, Attachments, Call-back numbers, Financial demands)
  ├─► 5. Intent Understanding (What does the sender want the user to do?)
  ├─► 6. Risk Scoring (0–100 calibrated score with confidence bounds)
  └─► 7. Multilingual Output (Clear explanation in English, Hindi, or Hinglish)
```

---

## 3. Scam Categories Taxonomy

* `bank_phishing`: Bank account suspensions, login alerts, credential harvesting.
* `kyc_scam`: ReKYC deadlines, document updates, PAN/Aadhaar linking threats.
* `vishing_call_scam`: Fake security warnings prompting calls to non-bank phone numbers.
* `toll_smishing`: Unpaid toll violations, DMV license non-renewal threats.
* `parcel_delivery_scam`: Missed delivery notifications, fee payments to reschedule.
* `prize_giftcard_scam`: Unsolicited lottery, $500 store gift card, or reward claims.
* `fake_loan_scam`: Student loan forgiveness, pre-approved low-interest loans.
* `fake_job_scam`: WhatsApp task offers, Google review likes, high daily salary.
* `malicious_attachment`: Distribution of `.apk`, `.exe`, `.zip`, or macro files.
* `tech_support_scam`: Computer virus alerts, Microsoft/Apple security prompts.

---

## 4. Legitimate Message Safeguards

Do **NOT** classify messages as fraud merely because they contain an OTP, bank name, or delivery status.

* **Legitimate OTP:** "123456 is your secret OTP for login. Never share OTP with anyone." → **SAFE / INFORMATIONAL**
* **Fraudulent OTP:** "Account blocked. Share OTP with executive to verify." → **CRITICAL RISK**
* **Legitimate Delivery:** "Your package was delivered at front door. Tracking: 1Z999..." (Official domain only) → **SAFE**
* **Fraudulent Delivery:** "Missed delivery. Reschedule at myparcel-ups.com" → **HIGH RISK**
