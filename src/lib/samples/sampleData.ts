export interface SamplePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  generateDataUrl: () => Promise<string>;
}

// Helper to draw realistic smartphone mock frames
function drawPhoneMockup(
  timeText: string,
  messageLines: Array<{ text: string; isLink?: boolean; isPhone?: boolean; isBold?: boolean; isRed?: boolean }>,
  accentColor: string = '#f59e0b'
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve('');

    // Background canvas
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, 800, 960);

    // Phone body
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.roundRect(160, 60, 480, 840, 48);
    ctx.fill();
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Screen
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(176, 76, 448, 808, 38);
    ctx.fill();

    // Top Notch / Island
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.roundRect(330, 86, 140, 28, 14);
    ctx.fill();

    // Status Bar
    ctx.fillStyle = '#171717';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(timeText, 210, 115);
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('5G 🔋', 560, 115);

    // Header Back & Avatar
    ctx.fillStyle = '#404040';
    ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('‹', 205, 175);

    // Gray circle with '?' (Unknown contact)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(400, 170, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('?', 394, 177);

    // Chat Message Bubble
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(200, 240, 390, 280, 20);
    ctx.fill();

    // Message Text
    let y = 280;
    for (const line of messageLines) {
      if (line.isLink || line.isPhone) {
        ctx.fillStyle = '#2563eb';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      } else if (line.isRed) {
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      }
      ctx.fillText(line.text, 220, y);
      y += 28;
    }

    resolve(canvas.toDataURL('image/png'));
  });
}

export function createWellsFargoSample(): Promise<string> {
  return drawPhoneMockup(
    '6:45',
    [
      { text: 'Your Wells Fargo account has' },
      { text: 'been locked for suspicious' },
      { text: 'activity. Please call us at' },
      { text: '201-429-3304 to verify your', isPhone: true },
      { text: 'identity.' },
    ],
    '#f59e0b'
  );
}

export function createStudentLoanSample(): Promise<string> {
  return drawPhoneMockup(
    '3:37',
    [
      { text: 'You may qualify for a new' },
      { text: 'student loan forgiveness' },
      { text: 'program! Enrollment ends' },
      { text: 'soon. Call 1-855-412-0901', isPhone: true },
      { text: 'to apply now.' },
    ],
    '#ea580c'
  );
}

export function createTargetWinnerSample(): Promise<string> {
  return drawPhoneMockup(
    '10:46',
    [
      { text: "Congratulations! You've won a" },
      { text: '$500 gift card to Target. Click' },
      { text: 'here to claim your reward:' },
      { text: 'https://targetwinner.com', isLink: true },
    ],
    '#eab308'
  );
}

export function createUPSDeliverySample(): Promise<string> {
  return drawPhoneMockup(
    '2:31',
    [
      { text: "You've missed our delivery." },
      { text: 'To reschedule delivery of your' },
      { text: 'parcel, please visit:' },
      { text: 'https://myparcel-ups.com.', isLink: true },
    ],
    '#c2410c'
  );
}

export function createFloridaTollSample(): Promise<string> {
  return drawPhoneMockup(
    '12:38',
    [
      { text: 'Florida toll services:' },
      { text: 'We noticed an outstanding' },
      { text: 'toll amount of $34.50 on your' },
      { text: 'account. Please make a payment' },
      { text: 'now to avoid a late fee:' },
      { text: 'https://tolls-sunpass.com', isLink: true },
    ],
    '#d97706'
  );
}

export function createBankCreditSample(): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve('');

    ctx.fillStyle = '#181715';
    ctx.fillRect(0, 0, 750, 700);

    ctx.fillStyle = '#faf9f5';
    ctx.font = '18px sans-serif';
    ctx.fillText('10:15 AM', 40, 45);
    ctx.fillText('5G  98%', 650, 45);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('HDFC Bank Alerts', 280, 110);
    ctx.fillStyle = '#8e8b82';
    ctx.font = '15px sans-serif';
    ctx.fillText('Official SMS Gateway (AD-HDFCBK)', 240, 140);

    ctx.fillStyle = '#252320';
    ctx.beginPath();
    ctx.roundRect(40, 180, 670, 420, 18);
    ctx.fill();

    const lines = [
      'INR 25,000.00 credited to A/c XX4928',
      'on 22-Aug-2026 10:14 AM by UPI transfer.',
      '',
      'From: RAJESH SHARMA (rajesh@okhdfcbank)',
      'UPI Ref: 982103482189',
      '',
      'Avl Bal: INR 1,42,850.00.',
      '',
      'Never share your OTP, UPI PIN, or password with anyone.',
    ];

    let y = 230;
    for (const line of lines) {
      if (line.includes('INR 25,000.00 credited')) {
        ctx.fillStyle = '#5db872';
        ctx.font = 'bold 22px sans-serif';
      } else if (line.includes('Never share')) {
        ctx.fillStyle = '#8e8b82';
        ctx.font = 'italic 16px sans-serif';
      } else {
        ctx.fillStyle = '#faf9f5';
        ctx.font = '19px sans-serif';
      }
      ctx.fillText(line, 65, y);
      y += 34;
    }

    resolve(canvas.toDataURL('image/png'));
  });
}

export function createFakePhonePeSample(): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve('');

    // PhonePe purple tinted background
    ctx.fillStyle = '#f3f0fa';
    ctx.fillRect(0, 0, 600, 900);

    // Status bar
    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('11:17', 40, 40);
    ctx.fillText('5G 🔋', 510, 40);

    // Success Banner Card
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(30, 60, 540, 100, 20);
    ctx.fill();

    // Checkmark circle
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(80, 110, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('✓', 70, 119);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Transaction Successful', 125, 100);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('30 Aug 2026, 11:17 AM', 125, 128);

    // Main Transaction Card
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(30, 180, 540, 520, 24);
    ctx.fill();

    // Recipient row
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.roundRect(50, 205, 50, 50, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('↗', 65, 238);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('ReviewCraft Store', 115, 226);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px monospace';
    ctx.fillText('reviewcraftstore@ybl', 115, 248);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('₹500.00', 430, 235);

    // Divider
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(50, 275);
    ctx.lineTo(550, 275);
    ctx.stroke();

    // Inconsistent typography row: Serif font for "Banking name:"
    ctx.fillStyle = '#0f172a';
    ctx.font = '16px "Times New Roman", Times, serif';
    ctx.fillText('Banking name:', 50, 310);
    ctx.fillStyle = '#059669';
    ctx.font = '14px sans-serif';
    ctx.fillText('ReviewCraft Store ✓', 390, 310);

    // Payment details
    ctx.fillStyle = '#475569';
    ctx.font = '13px sans-serif';
    ctx.fillText('Payment for subscription', 60, 380);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Transaction ID', 50, 440);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('TXN1JB2JWHL', 50, 465);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Debited from', 50, 520);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('₹500.00', 460, 520);

    // State Bank of India with icon inside text string
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(50, 540, 500, 70, 16);
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(85, 575, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('S', 79, 581);

    ctx.fillStyle = '#0f172a';
    ctx.font = '15px "Times New Roman", Times, serif';
    ctx.fillText('State 🏦 Bank of India - 2845', 120, 568);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.fillText('UTR:  423189271602', 120, 592);

    // Bottom branding
    ctx.fillStyle = '#6b21a8';
    ctx.font = '12px sans-serif';
    ctx.fillText('🛡️ Secured by PhonePe • BHIM UPI', 200, 740);

    resolve(canvas.toDataURL('image/png'));
  });
}

export function createCanaraBankBalanceSample(): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve('');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 600, 800);

    // Header
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 600, 120);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Canara Bank UPI', 40, 70);

    // Balance Card
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(40, 160, 520, 320, 20);
    ctx.fill();

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('✓ Bank balance fetched successfully', 70, 220);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('Canara Bank - Savings A/c (Ending 9012)', 70, 270);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('₹ 3,884.63', 70, 340);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Available Balance at 30 Aug 2026, 11:20 AM', 70, 380);

    resolve(canvas.toDataURL('image/png'));
  });
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'fake_phonepe_sample',
    name: 'Fake PhonePe ₹500 (Typography & Icon Flaws)',
    badge: 'Fake UPI Receipt',
    description: 'PhonePe ₹500 receipt with serif fonts and embedded bank icon',
    generateDataUrl: createFakePhonePeSample,
  },
  {
    id: 'canara_bank_balance',
    name: 'Canara Bank Balance Screen (No Proof)',
    badge: 'Account Balance',
    description: 'Bank balance inquiry showing ₹3,884.63 with zero transfer proof',
    generateDataUrl: createCanaraBankBalanceSample,
  },
  {
    id: 'wells_fargo_vishing',
    name: 'Wells Fargo Locked (Vishing)',
    badge: 'Bank Phishing',
    description: 'SMS claiming account locked with unverified 201 callback number',
    generateDataUrl: createWellsFargoSample,
  },
  {
    id: 'sunpass_toll_scam',
    name: 'Florida Toll (SunPass)',
    badge: 'Toll Smishing',
    description: 'Urgent $34.50 toll payment demand with tolls-sunpass.com link',
    generateDataUrl: createFloridaTollSample,
  },
  {
    id: 'bank_credit_sms',
    name: 'Legitimate Bank SMS',
    badge: 'Safe Notice',
    description: 'Genuine HDFC Bank SMS notification claiming ₹25,000 credit',
    generateDataUrl: createBankCreditSample,
  },
];

export const PAYMENT_SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'fake_phonepe_sample',
    name: 'Fictional PhonePe-style ₹500 receipt',
    badge: 'Fake UPI Receipt',
    description: 'PhonePe ₹500 receipt with serif typography and embedded bank icon',
    generateDataUrl: createFakePhonePeSample,
  },
  {
    id: 'canara_bank_balance',
    name: 'Fictional Canara-style balance screen',
    badge: 'Account Balance Only',
    description: 'Bank balance inquiry showing ₹3,884.63 with no transfer verification',
    generateDataUrl: createCanaraBankBalanceSample,
  },
];

