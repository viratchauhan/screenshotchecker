export interface PaymentFraudPattern {
  id: string;
  name: string;
  category:
    | 'fake_upi_apk'
    | 'typography_manipulation'
    | 'icon_layout_distortion'
    | 'amount_splicing'
    | 'collect_request_deception'
    | 'fake_refund_claim'
    | 'bank_balance_confusion'
    | 'delayed_notification_pressure';
  indicators: string[];
  explanation: string;
  recommendation: string;
}

export const PAYMENT_FRAUD_KNOWLEDGE_BASE: PaymentFraudPattern[] = [
  {
    id: 'fake_phonepe_apk_template',
    name: 'Spoofed PhonePe Payment Receipt Generator',
    category: 'fake_upi_apk',
    indicators: [
      'Banking name label rendered in serif font',
      'Bank icon embedded directly inside bank name text string',
      'Misaligned verified checkmark',
      'Transaction ID format mismatch',
    ],
    explanation:
      'Malicious prank APKs replicate the PhonePe transaction success screen but frequently use default system serif fonts or improper layout positioning for bank logos and secondary labels.',
    recommendation:
      'Check your official PhonePe Business / merchant app or bank statement to verify that the credited amount has settled.',
  },
  {
    id: 'fake_gpay_receipt_template',
    name: 'Spoofed Google Pay Payment Confirmation',
    category: 'fake_upi_apk',
    indicators: [
      'Incorrect Google Sans font rendering',
      'Missing or malformed UPI transaction ID',
      'Distorted GPay or bank logo proportions',
      'Mismatched timestamp',
    ],
    explanation:
      'Spoofed GPay screenshots often fail to accurately match Google Sans typography and correct spacing around transaction reference codes.',
    recommendation:
      'Always listen for your UPI Soundbox voice alert or check incoming SMS alerts from your bank.',
  },
  {
    id: 'fake_paytm_spoof_app',
    name: 'Paytm Spoof / Fake Payment Generator',
    category: 'fake_upi_apk',
    indicators: [
      'Distorted Paytm blue header banner',
      'Missing Paytm wallet or bank UTR code',
      'Incorrect font kerning on amount digits',
    ],
    explanation:
      'Paytm spoof apps simulate the green/blue success tick but cannot trigger an actual soundbox audio alert or bank credit.',
    recommendation:
      'Rely on Paytm Soundbox audio announcements or in-app merchant balance rather than customer screen displays.',
  },
  {
    id: 'amount_tampering_splicing',
    name: 'Altered or Spliced Payment Amount',
    category: 'amount_splicing',
    indicators: [
      'Conflicting amounts across summary and breakdown rows',
      'Visible compression boundaries or ELA halo around digits',
      'Added zeroes without comma realignment',
    ],
    explanation:
      'Fraudsters modify genuine lower-value receipts (e.g. ₹50) by splicing digits to show higher amounts (e.g. ₹5,000).',
    recommendation:
      'Cross-check the exact amount credited in your banking app before handing over goods or completing orders.',
  },
  {
    id: 'collect_request_impersonation',
    name: 'UPI Collect Request Disguised as Payment',
    category: 'collect_request_deception',
    indicators: [
      'Payment request / Collect request label',
      'Approve / Pay button present on screen',
      'No debited from confirmation',
    ],
    explanation:
      'Scammers send a collect request asking the merchant to enter their UPI PIN to "receive" money, which actually deducts funds from the merchant account.',
    recommendation:
      'Never enter your UPI PIN to receive money. UPI PIN is strictly used to send money or check balance.',
  },
  {
    id: 'bank_balance_screen_confusion',
    name: 'Bank Balance Screen Shown as Payment Proof',
    category: 'bank_balance_confusion',
    indicators: [
      'Bank balance fetched successfully',
      'Available balance / primary a/c',
      'No recipient or transaction ID',
    ],
    explanation:
      'A customer may show a screenshot of their own account balance to claim they have money, but an account balance screen is NOT proof of a transfer.',
    recommendation:
      'An account balance screen cannot prove payment. Require a confirmed transfer record in your own account.',
  },
  {
    id: 'delayed_notification_pressure',
    name: 'Delayed Notification Social Engineering',
    category: 'delayed_notification_pressure',
    indicators: [
      'Urgent rush to leave store before SMS arrives',
      'Claims of server delay while showing screenshot',
    ],
    explanation:
      'Fraudsters exploit busy hours and potential notification delays by showing a fake screenshot and demanding immediate release of goods.',
    recommendation:
      'Establish a strict policy: goods are released only when funds reflect in your account or are announced by your soundbox.',
  },
];
