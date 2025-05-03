import React from "react";

export default function VisionPage() {
  return (
    <div className="px-4 sm:px-8 py-12 max-w-4xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white h-full min-w-full">
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">The Vision Behind SuperFan & FAN</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">A new kind of fandom, built on-chain.</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why SuperFan Exists</h2>
          <p className="text-gray-700 mb-2 dark:text-gray-200">
            Social platforms made fans into numbers. SuperFan makes fans into <strong>supporters</strong>, <strong>participants</strong>, and <strong>owners</strong>.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 dark:text-gray-200">
            <li>We believe creators should own their audience.</li>
            <li>We believe fans deserve recognition beyond a like or follow.</li>
            <li>The connection between the two should be <strong>direct</strong>, <strong>rewarding</strong>, and <strong>on-chain</strong>.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What is FAN?</h2>
          <p className="text-gray-700 mb-2 dark:text-gray-200">
            <strong>FAN is the token that powers the SuperFan ecosystem.</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 dark:text-gray-200">
            <li>It’s used to tip creators</li>
            <li>It unlocks access (later: events, NFT rewards, exclusive perks)</li>
            <li>It’s a badge of honor—proof you’ve supported someone</li>
            <li>And it’s shared by the entire community, not locked to any one person</li>
          </ul>
          <p className="mt-2 text-gray-700 font-medium dark:text-white font-semibold">FAN is currency + status.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why It Matters (to Fans)</h2>
          <p className="text-gray-700 mb-2 dark:text-gray-200"><strong>Be more than a follower.</strong></p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 dark:text-gray-200">
            <li>Show real support for your favorite creators</li>
            <li>Join a growing economy where fandom has value</li>
            <li>Keep a record of your journey as a fan, on-chain forever</li>
            <li>Participate in future rewards and features as the platform grows</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why It Matters (to Creators)</h2>
          <p className="text-gray-700 mb-2 dark:text-gray-200"><strong>Build your economy without platforms.</strong></p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 dark:text-gray-200">
            <li>Get tipped in FAN or ETH directly, no middlemen</li>
            <li>See your top supporters on-chain</li>
            <li>Reward fans with exclusive content or NFTs</li>
            <li>More tools coming—events, analytics, drops, and more</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">The Road Ahead</h2>
          <p className="text-gray-700 mb-2 dark:text-gray-200">SuperFan is just getting started.</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 dark:text-gray-200">
            <li>NFT access passes to live sessions/events</li>
            <li>Creator reward dashboards</li>
            <li>Leaderboards + fan ranking</li>
            <li>Exclusive airdrops for active fans</li>
            <li>Voting or fan-powered decisions</li>
          </ul>
          <p className="mt-2 font-medium text-gray-700 dark:text-gray-200">Everything will revolve around FAN. Hold it. Use it. Grow with it.</p>
        </section>

        <footer className="text-center">
          <p className="text-lg font-semibold mb-4">Whether you're a creator or a fan—SuperFan is for you.</p>
          <div className="space-x-4">
            <a href="/" className="inline-block font-semibold px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Explore the App</a>
            {/* <a href="/follow" className="inline-block font-semibold px-6 py-3 bg-gray-100 text-blue-700 rounded hover:bg-gray-200 transition">Follow the Journey</a> */}
          </div>
        </footer>
      </div>
    </div>
  );
}
