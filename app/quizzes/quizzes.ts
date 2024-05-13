import { TQuizBundle } from "./quiz";

export const testQuiz: TQuizBundle = [
  {
    id: 1,
    isActive: true,
    topic: "Тестовый вопрос",
    question: "Какой <i>ответ</i> на главный вопрос жизни, вселенной и всего такого?",
    answers: [
      {
        isCorrect: false,
        answer: "40",
      },
      {
        isCorrect: true,
        answer: "42",
      },
      {
        isCorrect: false,
        answer: "44",
      },
      {
        isCorrect: false,
        answer: "46",
      },
    ],
    explanation: "<a href=\"https://ru.wikipedia.org/wiki/%D0%9E%D1%82%D0%B2%D0%B5%D1%82_%D0%BD%D0%B0_%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9_%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81_%D0%B6%D0%B8%D0%B7%D0%BD%D0%B8,_%D0%B2%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9_%D0%B8_%D0%B2%D1%81%D0%B5%D0%B3%D0%BE_%D1%82%D0%B0%D0%BA%D0%BE%D0%B3%D0%BE/\">Ответ на главный вопрос жизни, вселенной и всего такого</a>",
  },
  {
    id: 2,
    isActive: true,
    topic: "Тестовый вопрос",
    question: "<b>Ответьте</b> на главный вопрос жизни, вселенной и всего такого?",
    answers: [
      {
        isCorrect: false,
        answer: "41",
      },
      {
        isCorrect: true,
        answer: "42",
      },
      {
        isCorrect: false,
        answer: "43",
      },
      {
        isCorrect: false,
        answer: "44",
      },
    ],
    explanation: "<a href=\"https://ru.wikipedia.org/wiki/%D0%9E%D1%82%D0%B2%D0%B5%D1%82_%D0%BD%D0%B0_%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9_%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81_%D0%B6%D0%B8%D0%B7%D0%BD%D0%B8,_%D0%B2%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9_%D0%B8_%D0%B2%D1%81%D0%B5%D0%B3%D0%BE_%D1%82%D0%B0%D0%BA%D0%BE%D0%B3%D0%BE/\">Ответ на главный вопрос жизни, вселенной и всего такого</a>",
  }
]
