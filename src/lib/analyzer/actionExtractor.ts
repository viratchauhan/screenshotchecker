import type { RequestedAction, ExtractedEntitiesResult, ActionType } from './types';

export function extractRequestedActions(
  text: string,
  entities: ExtractedEntitiesResult
): RequestedAction[] {
  const actions: RequestedAction[] = [];
  const lower = text.toLowerCase();

  // 1. Share OTP / Enter OTP & Password (Ensure "do not share" is excluded)
  const isNegativeOtpWarning = /\b(?:do not share|never share|don't share)\b/i.test(lower);
  if (
    !isNegativeOtpWarning &&
    /\b(?:share (?:the|your|a)?\s*(?:\d+[- ]digit\s*)?(?:otp|code|pin)|send (?:the|your)? (?:otp|code)|forward (?:this|the)? (?:code|otp)|enter (?:your)? (?:password|otp|pin))\b/i.test(
      lower
    )
  ) {
    actions.push({
      id: 'act_otp',
      actionType: 'SHARE_OTP',
      label: 'Disclose OTP / Passcode',
      description: 'The message requests that you enter, share, or forward a secret one-time verification passcode (OTP) or password.',
      evidence: 'Explicit request for verification code / OTP disclosure detected in text',
    });
  }

  // 2. Download / Install App or APK
  if (
    /\b(?:download\.(?:apk|exe|dmg|zip)|download (?:app|attachment|file|apk)|install (?:anydesk|teamviewer|quicksupport|software|the remote)|install\b)/i.test(
      lower
    ) ||
    lower.includes('.apk')
  ) {
    actions.push({
      id: 'act_download',
      actionType: 'DOWNLOAD_FILE',
      label: 'Download / Install Application',
      description: 'The message instructs you to install an application, remote support tool, or download a file.',
      evidence: 'Software installation or APK file download directive identified',
    });
  }

  // 3. Make Payment / Send Money / Processing Fee / Gift Card
  if (
    /\b(?:send (?:₹|\$|money|funds|[\d,]+)|pay|transfer (?:funds|\$|₹|money|to this upi)|buy gift card|wire (?:funds|money)|processing fee|release fee|pay with (?:bitcoin|crypto))\b/i.test(
      lower
    ) &&
    !lower.includes('payment successful') &&
    !lower.includes('credited to') &&
    !lower.includes('debited from')
  ) {
    actions.push({
      id: 'act_pay',
      actionType: 'MAKE_PAYMENT',
      label: 'Make Payment / Transfer Funds',
      description: 'The message instructs you to transmit money, pay an upfront fee, or purchase prepaid gift cards.',
      evidence: 'Payment demand, processing fee, or fund transfer directive detected',
    });
  }

  // 4. Click Link / Login / Verify Account via Link
  if (
    entities.urls.length > 0 &&
    /\b(?:click|tap|visit|verify|login|sign in|auth|unlock|link below|open|check at|go to|secure your account|restore access)\b/i.test(
      lower
    )
  ) {
    if (/\b(?:login|sign in|auth|password|credentials|restore access)\b/i.test(lower)) {
      actions.push({
        id: 'act_login',
        actionType: 'LOGIN',
        label: 'Log In or Enter Credentials',
        description: 'The message directs you to navigate to an external link to authenticate or enter account credentials.',
        target: entities.urls[0],
        evidence: `URL included with authentication directive: ${entities.urls[0]}`,
      });
    } else if (/\b(?:verify (?:account|identity|kyc)|unlock|reactivate)\b/i.test(lower)) {
      actions.push({
        id: 'act_verify',
        actionType: 'VERIFY_ACCOUNT',
        label: 'Verify Identity / Account via Link',
        description: 'The message demands that you follow a link to complete identity verification or prevent account suspension.',
        target: entities.urls[0],
        evidence: `Verification call to action paired with web URL: ${entities.urls[0]}`,
      });
    } else {
      actions.push({
        id: 'act_link',
        actionType: 'CLICK_LINK',
        label: 'Click External Web Link',
        description: 'The communication directs you to open an external web address.',
        target: entities.urls[0],
        evidence: `External hyperlink provided in text: ${entities.urls[0]}`,
      });
    }
  }

  // 5. Call Phone Number
  if (
    entities.phoneNumbers.length > 0 &&
    /\b(?:call|contact|helpline|ring|phone us at|call support|agent helpline)\b/i.test(lower)
  ) {
    actions.push({
      id: 'act_call',
      actionType: 'CALL_NUMBER',
      label: 'Call Unverified Phone Number',
      description: 'The message urges you to call a specific telephone number provided directly in the text.',
      target: entities.phoneNumbers[0],
      evidence: `Telephone number embedded with call prompt: ${entities.phoneNumbers[0]}`,
    });
  }

  // 6. Reply via SMS
  if (/\b(?:reply (?:yes|stop|confirm|with)|text (?:stop|yes|help))\b/i.test(lower)) {
    actions.push({
      id: 'act_reply',
      actionType: 'REPLY',
      label: 'Reply via Text Message',
      description: 'The message asks you to reply with a keyword or response.',
      evidence: 'Keyword reply prompt detected in text',
    });
  }

  // 7. No Action Demanded
  if (actions.length === 0) {
    actions.push({
      id: 'act_none',
      actionType: 'DO_NOTHING',
      label: 'No Explicit Action Demanded',
      description: 'The screenshot appears to be an informational notice, transaction receipt, or general conversation without an immediate call to action.',
      evidence: 'No active directive, payment demand, or link navigation request identified',
    });
  }

  return actions;
}

export function extractRequestedAction(
  text: string,
  entities: ExtractedEntitiesResult
): RequestedAction {
  const all = extractRequestedActions(text, entities);
  return all[0];
}
