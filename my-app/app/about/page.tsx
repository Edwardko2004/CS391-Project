export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#071130] to-[#021428] text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full animate-fade-in">
        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg text-center">
          About Spark! Bytes
        </h1>
        <div className="w-20 h-1 bg-cyan-500 mx-auto mb-8 rounded-full" />

        <p className="text-lg text-gray-300 mb-10 text-center">
          Spark! Bytes connects students and local food creators through pop-ups, tastings,
          and community-driven events across campus. Our goal is to make food events easy to
          discover, create, and share — no matter your role.
        </p>

        <section className="mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-6">What we do</h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-[#1f2937] px-6 py-4 rounded-lg shadow-md max-w-md w-full">
              <p className="text-gray-200 text-base">
                 <strong>Discover</strong> upcoming food events in one place
              </p>
            </div>
            <div className="bg-[#1f2937] px-6 py-4 rounded-lg shadow-md max-w-md w-full">
              <p className="text-gray-200 text-base">
                 <strong>Create</strong> and promote your own pop-ups and gatherings
              </p>
            </div>
            <div className="bg-[#1f2937] px-6 py-4 rounded-lg shadow-md max-w-md w-full">
              <p className="text-gray-200 text-base">
                 <strong>Filter</strong> by tags, time, and popularity
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-8">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              <img
                src="/team1.jpg"
                alt="Imran Hussien"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Imran Hussien</h3>
              <p className="text-gray-400 text-sm">Front-end Developer</p>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <img
                src="/team2.jpg"
                alt="Edward Ko"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Edward Ko</h3>
              <p className="text-gray-400 text-sm">Front-end Developer</p>
            </div>

            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              <img
                src="/team3.jpg"
                alt="Rohaan Navin Chablani Mirpuri"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Rohaan Navin Chablani Mirpuri</h3>
              <p className="text-gray-400 text-sm">Back-end Engineer</p>
            </div>

            {/* Team Member 4 */}
            <div className="flex flex-col items-center">
              <img
                src="/team4.jpg"
                alt="Aidan Xu"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Aidan Xu</h3>
              <p className="text-gray-400 text-sm">Back-end Engineer</p>
            </div>

            {/* Team Member 5 */}
            <div className="flex flex-col items-center">
              <img
                src="/team5.jpg"
                alt="Anson Zhu"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Anson Zhu</h3>
              <p className="text-gray-400 text-sm">Full-stack Developer</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
