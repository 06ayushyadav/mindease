const CRISIS = [
  "suicide",
  "self harm",
  "kill myself",
  "end my life",
  "cut myself",
  "खुदकुशी",
  "आत्महत्या",
  "मैं खुद को मार",
  "self-harm",
];

export function scanCrisis(text: string) {
  const t = text.toLowerCase();
  const crisis = CRISIS.some((keyword) => t.includes(keyword));

  return {
    crisis,
    flags: crisis ? ["crisis"] : [],
  };
}
