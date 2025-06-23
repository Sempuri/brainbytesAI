import {
  detectCategory,
  detectQuestionType,
  detectSentiment,
} from "../aiService.js";

describe("detectCategory function", () => {
  test("detects math category from symbols", () => {
    expect(detectCategory("Solve x + 5 = 10")).toBe("math");
  });

  test("detects science category from keywords", () => {
    expect(detectCategory("Explain the theory of evolution")).toBe("science");
  });

  test("detects science from specialized terms", () => {
    expect(detectCategory("What is a neutron?")).toBe("science");
  });

  test("returns general for unknown topics", () => {
    expect(detectCategory("How are you today?")).toBe("general");
  });
});

describe("detectQuestionType function", () => {
  test("detects definition type questions", () => {
    expect(detectQuestionType("What is a circle?")).toBe("definition");
  });

  test("detects explanation type questions", () => {
    expect(detectQuestionType("Why is the sky blue?")).toBe("explanation");
  });

  test("detects example type questions", () => {
    expect(detectQuestionType("Give an example of a mammal")).toBe("example");
  });

  test("detects calculation type questions", () => {
    expect(detectQuestionType("Calculate 12 * 8")).toBe("calculation");
  });
});

describe("detectSentiment function", () => {
  test("detects positive sentiment from keywords", () => {
    expect(detectSentiment("This is a great explanation, thank you")).toBe(
      "positive",
    );
  });

  test("detects negative sentiment from keywords", () => {
    expect(detectSentiment("I am disappointed with this answer")).toBe(
      "negative",
    );
  });

  test("detects neutral sentiment for questions", () => {
    expect(detectSentiment("What is the capital of Japan?")).toBe("neutral");
  });

  test("handles negated positive as negative", () => {
    expect(detectSentiment("This is not helpful at all")).toBe("negative");
  });
});
