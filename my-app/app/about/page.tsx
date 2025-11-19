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
                alt="Alice Johnson"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Alice Johnson</h3>
              <p className="text-gray-400 text-sm">Frontend Developer</p>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <img
                src="/team2.jpg"
                alt="Brian Lee"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Brian Lee</h3>
              <p className="text-gray-400 text-sm">Backend Developer</p>
            </div>

            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              <img
                src="/team3.jpg"
                alt="Carla Smith"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Carla Smith</h3>
              <p className="text-gray-400 text-sm">UI/UX Designer</p>
            </div>

            {/* Team Member 4 */}
            <div className="flex flex-col items-center">
              <img
                src="/team4.jpg"
                alt="David Kim"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">David Kim</h3>
              <p className="text-gray-400 text-sm">Project Manager</p>
            </div>

            {/* Team Member 5 */}
            <div className="flex flex-col items-center">
              <img
                src="/team5.jpg"
                alt="Emma Patel"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Emma Patel</h3>
              <p className="text-gray-400 text-sm">Content Lead</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
