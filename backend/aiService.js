import { GoogleGenAI } from "@google/genai";

// Initialize our AI client using Gemini
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Expanded subject categories with keywords
const subjectKeywords = {
  math: [
    "calculate",
    "math",
    "addition",
    "subtraction",
    "multiply",
    "division",
    "equation",
    "algebra",
    "geometry",
    "calculus",
    "trigonometry",
    "fraction",
    "decimal",
    "percentage",
    "sum",
    "difference",
    "product",
    "quotient",
  ],
  science: [
    "science",
    "evaporation",
    "precipitation",
    "plants",
    "animals",
    "ecosystem",
    "photosynthesis",
    "water",
    "chemical",
    "biology",
    "physics",
    "chemistry",
    "atoms",
    "molecules",
    "cells",
    "DNA",
    "evolution",
    "energy",
    "force",
    "gravity",
    "electricity",
    "magnetism",
    "ecosystem",
    "planet",
    "solar system",
    "temperature",
  ],
  history: [
    "history",
    "capital",
    "philippines",
    "president",
    "war",
    "revolution",
    "empire",
    "civilization",
    "ancient",
    "medieval",
    "modern",
    "century",
    "decade",
    "era",
    "dynasty",
    "kingdom",
    "democracy",
    "monarch",
    "constitution",
  ],
  literature: [
    "book",
    "novel",
    "poem",
    "author",
    "character",
    "plot",
    "literature",
    "fiction",
    "nonfiction",
    "protagonist",
    "antagonist",
    "setting",
    "dialogue",
    "genre",
    "metaphor",
    "simile",
    "theme",
    "symbolism",
    "playwright",
    "poetry",
    "prose",
    "narrative",
    "story",
  ],
  geography: [
    "country",
    "mountain",
    "river",
    "ocean",
    "continent",
    "climate",
    "population",
    "city",
    "map",
    "region",
    "latitude",
    "longitude",
    "equator",
    "hemisphere",
    "border",
    "terrain",
    "landform",
    "geography",
  ],
  language: [
    "language",
    "grammar",
    "vocabulary",
    "noun",
    "verb",
    "adjective",
    "adverb",
    "syntax",
    "semantics",
    "pronunciation",
    "dialect",
    "idiom",
    "phrase",
    "translation",
    "linguistic",
    "bilingual",
    "multilingual",
  ],
};

// Question type patterns
const questionTypes = {
  definition: [
    "what is",
    "define",
    "meaning of",
    "definition of",
    "describe what",
    "what does",
    "what are",
    "what was",
    "what were",
  ],
  explanation: [
    "how does",
    "explain",
    "why does",
    "why is",
    "why are",
    "how is",
    "how are",
    "what happens",
    "what caused",
    "how can",
  ],
  example: [
    "give an example",
    "for example",
    "show me an example",
    "such as",
    "provide an example",
    "what is an example",
    "like what",
  ],
  calculation: [
    "calculate",
    "compute",
    "solve",
    "find the value",
    "what is the result",
    "how much is",
    "evaluate",
  ],
};

// Sentiment analysis keywords
const sentimentKeywords = {
  negative: [
    "sad",
    "confused",
    "frustrating",
    "frustrated",
    "difficult",
    "hard",
    "not understand",
    "don't get it",
    "can't grasp",
    "stupid",
    "unclear",
    "complicated",
    "confusing",
    "impossible",
    "hate",
    "annoyed",
    "annoying",
    "doesn't make sense",
    "doesn't work",
    "wrong",
    "bad",
    "terrible",
    "horrible",
    "awful",
    "worst",
    "useless",
    "buggy",
    "waste",
    "broken",
    "slow",
    "disappointed",
    "pain",
    "pointless",
    "sucks",
    "poor",
    "meh",
    "inconsistent",
    "unreliable",
    "regret",
    "crash",
    "overwhelming",
    "inaccurate",
  ],
  positive: [
    "happy",
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "brilliant",
    "clear",
    "helpful",
    "useful",
    "thanks",
    "thank you",
    "appreciate",
    "love",
    "like",
    "enjoy",
    "perfect",
    "awesome",
    "superb",
    "well done",
    "beautiful",
    "smooth",
    "efficient",
    "intuitive",
    "fast",
    "impressive",
    "reliable",
    "flawless",
    "neat",
    "genius",
    "nice",
    "satisfying",
    "simple",
    "straightforward",
    "responsive",
    "clean",
    "cool",
    "great job",
    "lifesaver",
  ],
};

// Sample fallback examples by category and type
const sampleExamples = {
  math: [
    {
      q: "What is the derivative of x^2?",
      a: "The derivative of x^2 with respect to x is 2x.",
    },
    { q: "Calculate 12 * 8", a: "The result of 12 * 8 is 96." },
  ],
  science: [
    {
      q: "Give an example of a chemical reaction.",
      a: "Mixing vinegar and baking soda produces carbon dioxide gas.",
    },
    {
      q: "Define photosynthesis.",
      a: "Photosynthesis is the process by which plants convert sunlight into chemical energy.",
    },
  ],
  history: [
    {
      q: "Who was the first president of the Philippines?",
      a: "Emilio Aguinaldo was the first President of the Philippines.",
    },
    {
      q: "What was the Renaissance?",
      a: "The Renaissance was a cultural movement in Europe from the 14th to 17th century emphasizing art, science, and humanism.",
    },
  ],
  literature: [
    { q: "Who wrote 'Hamlet'?", a: "William Shakespeare wrote 'Hamlet'." },
    {
      q: "What is a novel?",
      a: "A novel is a long-form narrative work of fiction typically published as a book.",
    },
  ],
  geography: [
    {
      q: "What is the highest mountain?",
      a: "Mount Everest is the highest mountain above sea level.",
    },
    {
      q: "Name a continent.",
      a: "Asia is the largest continent by both area and population.",
    },
  ],
  language: [
    {
      q: "What is a noun?",
      a: "A noun is a word that names a person, place, thing, or idea.",
    },
    {
      q: "Define syntax.",
      a: "Syntax is the set of rules that governs the structure of sentences in a language.",
    },
  ],
};

function cleanMarkdown(text) {
  // Remove markdown artifacts but preserve newlines
  return text
    .replace(/```[a-z]*\n/g, "") // Remove code block language identifiers
    .replace(/```/g, "") // Remove code block markers
    .replace(/#+\s/g, "") // Remove heading markers
    .trim();
}

function detectCategory(question) {
  const lower = question.toLowerCase();
  // Create a scoring system instead of first-match
  let scores = {
    math: 0,
    science: 0,
    history: 0,
    literature: 0,
    geography: 0,
    language: 0,
    general: 0,
  };

  // Check for math symbols and expressions with better context
  if (
    (/[+\-*/=><]/.test(lower) && /\d+/.test(lower)) ||
    /calculate|solve|equation|formula|compute/.test(lower)
  ) {
    scores.math += 5;
  }

  // Check for specific science terms not in the keywords list
  const scienceTerms = [
    "neutron",
    "proton",
    "electron",
    "quark",
    "boson",
    "hadron",
    "lepton",
    "isotope",
    "nucleus",
    "orbital",
    "valence",
    "radioactive",
    "half-life",
  ];

  if (scienceTerms.some((term) => lower.includes(term))) {
    scores.science += 3; // Give a strong boost to science score
  }

  // Score each category based on keyword matches
  for (const [cat, kws] of Object.entries(subjectKeywords)) {
    kws.forEach((keyword) => {
      // Check for whole word matches or key phrases for better accuracy
      const regex = new RegExp(`\\b${keyword}\\b|${keyword}\\s`, "i");
      if (regex.test(lower)) {
        scores[cat] += 1;
      }
    });
  }

  // Return the highest scoring category
  const bestCategory = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter((entry) => entry[1] > 0)[0];

  return bestCategory ? bestCategory[0] : "general";
}

function detectSentiment(question) {
  const lower = question.toLowerCase();

  console.log("Analyzing sentiment for:", lower);

  // Calculate sentiment scores with context awareness
  let posScore = 0;
  let negScore = 0;
  let matchedWords = { positive: [], negative: [] };

  // Check for negations that might reverse sentiment
  const negations = ["not", "don't", "doesn't", "can't", "won't", "never"];

  // Use better word boundary detection with regex
  sentimentKeywords.positive.forEach((word) => {
    // Create regex to match whole words or phrases
    const regex = new RegExp(`\\b${word}\\b|\\b${word}\\s`, "i");
    if (regex.test(lower)) {
      // Track which words matched
      matchedWords.positive.push(word);

      // Check for negation (keep this logic)
      const wordIndex = lower.indexOf(word);
      const precedingText = lower.substring(
        Math.max(0, wordIndex - 20),
        wordIndex,
      );

      if (negations.some((neg) => precedingText.includes(neg))) {
        negScore += 1.0; // Increase from 0.5 to 1.0 to meet the threshold
        matchedWords.negative.push("negated positive");
      } else {
        // Assign higher scores to stronger positive words
        const strongPositives = [
          "excellent",
          "amazing",
          "fantastic",
          "brilliant",
        ];
        posScore += strongPositives.includes(word) ? 2 : 1;
      }
    }
  });

  // Similar improvement for negative words
  sentimentKeywords.negative.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b|\\b${word}\\s`, "i");
    if (regex.test(lower)) {
      matchedWords.negative.push(word);

      // Assign higher scores to stronger negative words
      const strongNegatives = ["terrible", "horrible", "awful", "hate"];
      negScore += strongNegatives.includes(word) ? 2 : 1;
    }
  });

  // Special cases that strongly indicate sentiment
  if (
    lower.includes("thank you so much") ||
    lower.includes("really appreciate")
  ) {
    posScore += 3;
    matchedWords.positive.push("strong gratitude");
  }

  if (
    lower.includes("extremely disappointed") ||
    lower.includes("very frustrated")
  ) {
    negScore += 3;
    matchedWords.negative.push("strong frustration");
  }

  // Log what we found for debugging
  console.log("Sentiment matches:", {
    positive: matchedWords.positive,
    negative: matchedWords.negative,
    posScore,
    negScore,
  });

  // Lower threshold for sentiment detection
  if (posScore > negScore && posScore >= 1) return "positive";
  if (negScore > posScore && negScore >= 1) return "negative";
  return "neutral";
}

function detectQuestionType(question) {
  const lower = question.toLowerCase();

  // Score different question types
  let scores = {
    definition: 0,
    explanation: 0,
    example: 0,
    calculation: 0,
    general: 1, // Default score
  };

  // Check for explicit question markers
  if (lower.startsWith("what is") || lower.startsWith("define")) {
    scores.definition += 3;
  }

  if (lower.startsWith("why") || lower.startsWith("how does")) {
    scores.explanation += 3;
  }

  if (lower.includes("example") || lower.includes("instance of")) {
    scores.example += 3;
  }

  if (
    lower.startsWith("calculate") ||
    lower.startsWith("compute") ||
    /find the (value|result|answer)/.test(lower)
  ) {
    scores.calculation += 3;
  }

  // Add scores from keyword patterns
  for (const [type, patterns] of Object.entries(questionTypes)) {
    patterns.forEach((pattern) => {
      if (lower.includes(pattern)) {
        scores[type] += 1;
      }
    });
  }

  // Return highest scoring type
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function formatResponseByType(resp, type) {
  // Clean response and preserve line breaks
  let cleanResp = cleanMarkdown(resp);

  // Make sure paragraphs are properly separated
  cleanResp = cleanResp.replace(/\n\s*\n/g, "\n\n");

  // Ensure single newlines are preserved
  cleanResp = cleanResp.replace(/\n(?!\n)/g, "\n\n");

  switch (type) {
    case "definition":
      return cleanResp; // Keep original formatting
    case "explanation":
      return cleanResp; // Keep original formatting
    case "example":
      return cleanResp; // Keep original formatting
    case "calculation":
      // For calculations, preserve any line breaks that might separate steps
      return cleanResp;
    default:
      return cleanResp;
  }
}

async function generateResponse(question) {
  const category = detectCategory(question);
  const qType = detectQuestionType(question);
  const sentiment = detectSentiment(question);

  try {
    const gen = await aiClient.models.generateContent({
      model: "gemini-2.0-flash",
      contents: question,
    });
    let text = gen.text.trim();
    text = cleanMarkdown(text);
    if (sentiment === "negative") {
      text = `I see you're frustrated. ${text}`;
    }
    return {
      category,
      response: formatResponseByType(text, qType),
      questionType: qType,
      sentiment,
    };
  } catch (e) {
    console.error("Gemini error:", e);
    const examples = sampleExamples[category] || [];
    const fallback =
      examples.length > 0
        ? examples[Math.floor(Math.random() * examples.length)].a
        : getDefaultFallback(category);
    const text = formatResponseByType(fallback, qType);
    return { category, response: text, questionType: qType, sentiment };
  }
}

function getDefaultFallback(category) {
  switch (category) {
    case "math":
      return "Could you specify the math problem you'd like me to solve?";
    case "science":
      return "What science topic would you like to explore?";
    default:
      return "Could you please rephrase or provide more details?";
  }
}

export {
  generateResponse,
  detectCategory,
  detectQuestionType,
  detectSentiment,
  formatResponseByType,
};
