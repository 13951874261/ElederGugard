import { GoogleGenAI, Type } from "@google/genai";
import { ScamAnalysisResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTextForScam = async (text: string): Promise<ScamAnalysisResult> => {
  const ai = getClient();
  if (!ai) {
    // Fallback if no API key
    return localAnalysis(text);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // Explicitly request Simplified Chinese in the prompt
      contents: `分析以下文本是否包含诈骗信息、诱导转账、或恶意推广。请务必使用简体中文回答。\n文本：\n"${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isScam: { type: Type.BOOLEAN },
            riskLevel: { type: Type.STRING, enum: ["safe", "low", "medium", "high"] },
            reason: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["isScam", "riskLevel", "reason", "category"]
        }
      }
    });

    const resultText = response.text;
    if (resultText) {
      return JSON.parse(resultText) as ScamAnalysisResult;
    }
    throw new Error("Empty response");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return localAnalysis(text);
  }
};

// PRD 5.2: Local Pattern Matching (Regex + NLP-Lite)
const localAnalysis = (text: string): ScamAnalysisResult => {
  // Keywords from PRD: “转账”、“安全账户”、“投资”、“回报率”、“冻结”
  const highRiskKeywords = ["转账", "安全账户", "投资", "回报率", "冻结", "公检法", "洗钱", "验证码"];
  
  const hitKeywords = highRiskKeywords.filter(k => text.includes(k));
  const isSuspicious = hitKeywords.length > 0;

  if (isSuspicious) {
    return {
      isScam: true,
      riskLevel: 'high',
      reason: `触发高危关键词：${hitKeywords.join(', ')} (离线防御模式)`,
      category: "关键词阻断"
    };
  }

  return {
    isScam: false,
    riskLevel: 'safe',
    reason: "未检测到明显风险 (离线模式)",
    category: "安全"
  };
};