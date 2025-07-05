export default async function aiCommentBot(content: string) {
  // TODO: Integrate GPT moderation (flag spam, offensive etc)
  // Simulate always OK:
  return { isSpam: false };
}
