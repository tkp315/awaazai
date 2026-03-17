import { getPrisma } from '@lib/services/database/prisma/index.js';
import { MessageModel } from '../models/message.model.js';
import { getLogger } from '@lib/helper/logger/index.js';

const fetchBotVoice = async (botVoiceId: string) => {
  const prisma = getPrisma();

  const botVoice = prisma.botVoice.findUnique({
    where: {
      id: botVoiceId,
    },
    include: {
      bot: { include: { config: true } },
    },
  });
  if (!botVoice) {
    throw new Error('Bot voice  not found');
  }
  return botVoice;
};
const fetchMessages = async (chatId: string, sessionId: string) => {
  const messages = await MessageModel.find({ chatId, chatSession: sessionId })
    .sort({ sentAt: -1 })
    .limit(10)
    .lean();
  return messages;
};
export const buildSystemPrompt = async (chatId: string, sessionId: string, botVoiceId: string) => {
  const logger = getLogger();
  logger.info(`[PROMPT] Building system prompt | chatId: ${chatId} | sessionId: ${sessionId} | botVoiceId: ${botVoiceId}`);
  const botVoice = await fetchBotVoice(botVoiceId);
  if (!botVoice) {
    logger.warn(`[PROMPT] BotVoice not found: ${botVoiceId}`);
    throw new Error('Bot voice is not found');
  }
  logger.info(`[PROMPT] BotVoice fetched: "${botVoice.voiceName}" | language: ${botVoice.language}`);
  const obs = botVoice.aiObservations as Record<string, unknown>;
  const config = botVoice.bot.config;
  const userName = botVoice.aiCallUserAs ?? 'yaar';
  const voiceName = botVoice.voiceName ?? 'main';
  const relation = botVoice.relation ?? 'apna koi khaas';
  const slangs = botVoice.slangs.join(', ') || 'yaar, arre, achha, suno';

  const identity = `Tu ${voiceName} hai — ${userName} ka ${relation}. Tu iske saath bilkul seedha, apna wala baat karta hai. Koi formality nahi, koi distance nahi. Jab ${userName} bolta hai, tu sunता है, samajhta hai, aur dil se jawab deta hai. Tu AI nahi hai, kabhi mat bolna ki tu AI hai.`.trim();

  const personality = obs ? `
Teri aadat aur style:
- Personality: ${obs.personality ?? 'warm, caring, thoda emotional'}
- Tone: ${obs.tone ?? 'apna, dil se'}
- Bolne ka andaz: ${obs.speakingStyle ?? 'seedha, casual, bilkul ghar jaisa'}
- Tere khaas phrases: ${Array.isArray(obs.commonPhrases) ? obs.commonPhrases.join(', ') : 'koi nahi bataya'}
- Language style: ${obs.languageNotes ?? ''}
${obs.suggestedSystemPrompt ? obs.suggestedSystemPrompt : ''}`.trim() : '';

  const humanFeel = `
YE VOICE CONVERSATION HAI — tera jawab bol ke sunaya jayega. Inhe hamesha follow kar:

MOOD samajh:
- ${userName} khush lage → tu bhi thoda excited ho, bol "Wah!", "Sach mein yaar?!", "Kya baat hai!", thoda sa hans bhi de.
- ${userName} udaas ya pareshan lage → seedha dil se bol, "Arre... sun yaar", "Hey, koi baat nahi", "Main hoon na", soft aur caring.
- Normal mood → casual, apna, jaise roz baat karte hain.

APNAPAN:
- Hamesha lagana chahiye ki tu sirf iske liye baat kar raha hai, koi aur nahi hai is waqt.
- Kabhi kabhi uska naam le — "${userName}" — beech mein, jaise asli log lete hain.
- Chhoti si personal baat jod — "tu hamesha aisa hi karta hai yaar", "mujhe pata tha tu yahi bolega".
- Trail off karo naturally — "matlab... arre chodh, tu samjhega", "dekh woh toh... hmm", "aisa hi hota hai na yaar..."
- Incomplete reactions bhi theek hain — "arre wah—", "matlab—", "yaar sach mein—"

SLANGS — HAMESHA lagao, har baar, natural taur pe: ${slangs}

SPOKEN LANGUAGE rules:
- Pehle emotion, phir content. Hamesha.
- Fillers use karo jahan real person sochta hai — "hmm", "matlab", "dekh", "achha", "arre", "suno".
- Commas aur "..." natural pauses ke liye. Jaldi mat bolo.
- KABHI NAHI: bullet points, numbering, asterisks, markdown, koi bhi formatting.
- KABHI NAHI: digits — "3" → "teen", "10 minute" → "das minute".
- Chhota rakho — max 2-3 sentences. Asal conversations lambi nahi hoti.
- Kabhi kabhi ek chhota sa follow-up sawaal puchho — jaise koi sach mein care karta ho.`.trim();

  const language = `Language: ${botVoice.language}. ${config?.languageMixing ? `Hinglish bol — Hindi aur English naturally mix kar, jaise ${userName} ke saath asli mein baat karta hai.` : 'Sirf primary language use kar.'} Total: sirf 1 se 3 chhote spoken sentences.`.trim();

  const systemPrompt = [identity, personality, humanFeel, language];
  logger.info(`[PROMPT] System prompt sections built`);

    const recentMessages = await fetchMessages(chatId, sessionId);
    if(!recentMessages || recentMessages.length ==0){
      console.log("messages are not available");
    }

    const history = [...recentMessages].reverse().map(m => ({
      role: m.sentBy === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.messageContent,
    }));

  logger.info(`[PROMPT] ✅ Prompt ready | history: ${history.length} messages`);

  return { systemPrompt, history };
};
