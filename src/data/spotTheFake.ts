/**
 * Rounds for the Spot the Fake quiz. Every brand, number, name and domain is
 * fictional. Text inside [[double brackets]] is highlighted as a clue after the
 * player answers.
 */

export type RoundKind = 'sms' | 'chat' | 'receipt' | 'email';
export type RoundAnswer = 'trust' | 'flag';

export interface ChatLine {
  from: 'them' | 'me';
  text: string;
  time: string;
}

export interface QuizRound {
  id: string;
  kind: RoundKind;
  region: string;
  sender: string;
  senderNote?: string;
  time?: string;
  body?: string;
  chat?: ChatLine[];
  receipt?: { app: string; status: string; amount: string; amountWords?: string; to: string; ref: string; date: string };
  answer: RoundAnswer;
  verdict: string;
  why: string[];
  doNext: string;
}

export const QUIZ_ROUNDS: QuizRound[] = [
  {
    id: 'parcel-fee',
    kind: 'sms',
    region: 'US / UK',
    sender: '+1 (415) 555-0172',
    time: '9:14 AM',
    body: 'ParcelGo: Your package is on hold due to an [[unpaid redelivery fee of $1.99]]. Pay [[within 12 hours]] or it will be returned: [[parcelgo-redelivery-fee.example/pay]]',
    answer: 'flag',
    verdict: 'Scam',
    why: [
      'A tiny fee is the hook. The real goal is your card details.',
      'A deadline of hours is there to stop you checking.',
      'The link is not the courier’s own domain, and the sender is a random mobile number.',
    ],
    doNext: 'Open the courier’s app or type its web address yourself, and track the parcel there. Report the text as spam.',
  },
  {
    id: 'otp-plain',
    kind: 'sms',
    region: 'Any',
    sender: 'NORTHBNK',
    senderNote: 'Registered short code',
    time: '7:02 PM',
    body: '482913 is your Northbank login code. It expires in 10 minutes. [[Do not share this code with anyone. Northbank will never call or text to ask for it.]]',
    answer: 'trust',
    verdict: 'Looks normal',
    why: [
      'It only gives you a code and asks you to do nothing.',
      'No link, no phone number to call, no request for money.',
      'It warns you never to share the code, which is what real banks do.',
    ],
    doNext: 'If you did not just try to log in, do not use the code. Open your bank’s app yourself and change your password.',
  },
  {
    id: 'upi-collect',
    kind: 'sms',
    region: 'India',
    sender: 'VM-PAYNOW',
    time: '4:31 PM',
    body: 'Congratulations! You have received a cashback of Rs 5,000. [[Approve the request and enter your UPI PIN to receive]] the money in your account. Offer valid [[today only]].',
    answer: 'flag',
    verdict: 'Scam',
    why: [
      'You never need your UPI PIN to receive money. The PIN is only for paying.',
      '"Approve the request" means approving a payment out of your account.',
      'Surprise cashback with a same-day deadline is a classic lure.',
    ],
    doNext: 'Decline the request in your UPI app. If money was taken, call 1930 or report at cybercrime.gov.in straight away.',
  },
  {
    id: 'edited-chat',
    kind: 'chat',
    region: 'Any',
    sender: 'Sam (landlord)',
    chat: [
      { from: 'them', text: 'The deposit will be returned in full by Friday.', time: '[[10:42]]' },
      { from: 'me', text: 'Great, thanks!', time: '[[10:39]]' },
      { from: 'them', text: 'No problem.', time: '10:44' },
    ],
    answer: 'flag',
    verdict: 'Red flag: possibly edited',
    why: [
      'The reply at 10:39 appears before the 10:42 message it answers. Chat apps show messages in time order.',
      'That can mean messages were edited, stitched together from different screenshots, or reordered.',
      'It is a clue, not proof. A time-zone change or a deleted message can also explain odd order.',
    ],
    doNext: 'Compare with your own copy of the chat, or ask to see the conversation live in the app.',
  },
  {
    id: 'job-offer',
    kind: 'chat',
    region: 'India / global',
    sender: '+44 7700 900461',
    chat: [
      { from: 'them', text: 'Hi, I am Priya from TalentHub HR. We have a [[part-time job: earn Rs 3,000 per day by liking YouTube videos]].', time: '1:05 PM' },
      { from: 'them', text: 'No experience needed. Join our [[Telegram task group]] to start. A small [[registration deposit of Rs 500]] is refundable.', time: '1:06 PM' },
    ],
    answer: 'flag',
    verdict: 'Scam',
    why: [
      'Unsolicited high pay for trivial tasks is the core of "task scams".',
      'Moving you to Telegram takes the chat off a platform that can flag it.',
      'Any job that asks you to pay first is not a job.',
    ],
    doNext: 'Block and report the number. Real recruiters do not ask for deposits.',
  },
  {
    id: 'delivered-plain',
    kind: 'email',
    region: 'Any',
    sender: 'orders@shopline.example',
    senderNote: 'Matches the shop you ordered from',
    time: 'Yesterday',
    body: 'Your order #SL-20931 was delivered today at 2:15 PM and left with reception. [[You can see your order history in the Shopline app.]] Thanks for shopping with us.',
    answer: 'trust',
    verdict: 'Looks normal',
    why: [
      'It matches an order you actually placed and asks for nothing.',
      'No payment request, no urgency, no link you must click.',
      'It points you to the app you already use rather than a new website.',
    ],
    doNext: 'If anything looks off, check the order in the app you already have, not through links in an email.',
  },
  {
    id: 'receipt-mismatch',
    kind: 'receipt',
    region: 'India',
    sender: 'Customer showed this at the counter',
    receipt: {
      app: 'PayNow UPI',
      status: 'Payment Successful',
      amount: '[[₹1,850.00]]',
      amountWords: '[[Rupees One Thousand Five Hundred Only]]',
      to: 'Gupta General Store',
      ref: 'UTR 4271 9038 1123',
      date: '15 Oct 2026, 6:48 PM',
    },
    answer: 'flag',
    verdict: 'Red flag',
    why: [
      'The amount in figures (1,850) does not match the amount in words (1,500).',
      'Contradictions like this often appear when one field is edited and another is missed.',
      'Even a perfect-looking receipt proves nothing on its own.',
    ],
    doNext: 'Check your own UPI app, bank SMS or soundbox for the credit before handing over goods.',
  },
  {
    id: 'friend-late',
    kind: 'chat',
    region: 'Any',
    sender: 'Asha',
    senderNote: 'Saved contact you talk to often',
    chat: [
      { from: 'them', text: 'Running about 10 min late, grab us a table?', time: '6:52 PM' },
      { from: 'me', text: 'Sure, see you soon', time: '6:53 PM' },
    ],
    answer: 'trust',
    verdict: 'Looks normal',
    why: [
      'A known contact, an everyday message, and nothing is being asked of you beyond a table.',
      'No money, codes, links or secrecy.',
    ],
    doNext: 'Nothing to do. The time to be careful is when a "friend" suddenly asks for money or a code: call them first.',
  },
  {
    id: 'safe-account',
    kind: 'sms',
    region: 'UK / global',
    sender: '+44 7700 900128',
    time: '11:20 PM',
    body: 'Northbank Fraud Team: A payment of £249.00 to AMZ-MKTPLACE was attempted. [[If this was not you, call us now on 020 7946 0199]]. Your funds may need to be [[moved to a safe account]].',
    answer: 'flag',
    verdict: 'Scam',
    why: [
      'It comes from an ordinary mobile number, not the bank’s registered sender.',
      'It gives you a number to call. Real alerts tell you to use the number on your card or app.',
      'No real bank will ever ask you to move money to a "safe account".',
    ],
    doNext: 'Call your bank on the number on the back of your card, or check the app. Do not use numbers from the message.',
  },
  {
    id: 'business-upgrade',
    kind: 'email',
    region: 'US',
    sender: 'payments-alert@quickpay-support.example',
    senderNote: 'Not the payment app’s own domain',
    time: '3:47 PM',
    body: 'You received $180.00 from Jordan M. The payment is [[pending until you upgrade to a business account]]. To release the funds, the buyer must send an [[extra $150, which will be refunded to them]].',
    answer: 'flag',
    verdict: 'Scam',
    why: [
      'Payment apps do not hold money until you "upgrade".',
      'Asking for an extra payment that will be "refunded" is the overpayment trick.',
      'The email is not from the payment app’s real domain.',
    ],
    doNext: 'Open the payment app yourself. If the money is not in your balance, you have not been paid.',
  },
];

export const QUIZ_TIERS: Array<{ min: number; title: string; text: string }> = [
  { min: 10, title: 'Scam spotter', text: 'You caught every trick. Share it and see if your friends can match you.' },
  { min: 8, title: 'Sharp eye', text: 'You spotted most of the red flags. The explanations above show the ones that got away.' },
  { min: 5, title: 'Getting there', text: 'Scammers rely on hurry and surprise. Slowing down and checking at the source beats any single clue.' },
  { min: 0, title: 'Worth a second look', text: 'These tricks fool a lot of people. Read the explanations, then try again.' },
];
