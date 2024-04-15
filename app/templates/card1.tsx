import React from "react"
import { Layout } from "./layout.js"
import { cn } from "../utils.js"

function IsCorrect({ isCorrect, children }) {
  return (
    <strong
      className={cn({
        "text-zinc-900/70": isCorrect,
        "text-zinc-900": !isCorrect,
      })}
    >
      {children}
    </strong>
  )
}

function Answers({ answers }) {
  return (
    <section className="max-w-md mx-auto mt-6 text-lg text-zinc-900">
      <ol className="list-inside">
        {answers
          ? answers.map(({ proxy, answer, isCorrect }, index: number) => (
            <li
              className="leading-5 pt-2"
              key={index}
            >
              <strong>{proxy}</strong>
              <IsCorrect {...{ isCorrect }}>.</IsCorrect>
              <span className="ml-2">{answer}</span>
            </li>
          ))
          : null}
      </ol>
    </section>)
}

function Question({ topic, question }) {
  return (
    <section className="max-w-md mx-auto text-slate-800">
      <p className="text-lg">
        Тема: <span className="font-bold">
          {topic}
        </span>
      </p>
      <h4
        className="text-2xl font-bold text-balance"
        dangerouslySetInnerHTML={{ __html: question }}
      />
    </section>
  )
}

function Info({ botDescription, botName, topic, id }) {
  return (
    <section className="mt-4">
      <p className="text-[8px] text-gray-200 font-mono flex gap-3">
        <span>{botDescription}</span>
        <span>{botName}</span>
        <span>{topic}</span>
        <span>id:{id}</span>
      </p>
    </section>
  )
}

export function Card1({ topic, question, answers, botDescription, botName, id }) {
  return (
    <Layout >
      <div
        className="max-w-xl py-6 bg-gray-100"
        id="root"
      >
        <div className="max-w-lg min-w-fit mx-auto p-6 rounded-xl shadow-md
        bg-gradient-to-b from-slate-300 via-sky-200 to-blue-200">
          <Question {...{ topic, question }} />
          <Answers {...{ answers }} />
          <Info {...{ botDescription, botName, topic, id }} />
        </div>
      </div>
    </Layout>
  )
}
