import React from 'react';

export default function About() {
  return (
    <section className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white py-16 px-6 flex-grow">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">About SuperFan</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          SuperFan started as a personal quest — a solo developer's journey into the world of building something meaningful from scratch. With a deep curiosity and passion for blockchain, I set out to create not just a product, but a new kind of experience that empowers both creators and fans.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          This platform was built while learning — brick by brick — to explore what fandom can look like when we mix community, communication, and crypto. It’s not perfect. It’s not finished. But it’s real — and it's evolving with every step.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          SuperFan isn’t here to be just another app. It’s here to grow, shift, and adapt with its users. As I continue building, I’m committed to transparency, thoughtful features, and keeping the vision in focus — because this isn’t just a project, it’s a passion.
        </p>
        <a
          href="/vision"
          className="inline-block mt-8 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Read the Vision
        </a>
      </div>
    </section>

  )
}