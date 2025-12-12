/**
 * File: /app/about/page.tsx
 * 
 * Description:
 *   This component renders the About page for Spark! Bytes.
 *   It uses a gradient background and glassmorphism cards to present:
 *     - A title and mission statement
 *     - A "What We Do" section highlighting key features
 *     - A "Meet the Team" section with member photos and roles
 * 
 * The page is styled with Tailwind CSS and animated fade-in effects
 * to match the overall design system of the app.
 */

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full animate-fade-in">
        
        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-center">
          About Spark! Bytes
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8 rounded-full" />

        <p className="text-lg text-gray-300 mb-10 text-center">
          Spark! Bytes connects students and local food creators through pop-ups, tastings,
          and community-driven events across campus. Our goal is to make food events easy to
          discover, create, and share: no matter your role.
        </p>

        {/* What We Do Section */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-white">What we do</h2>

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-700 shadow-xl w-full max-w-xl">
              <p className="text-gray-200 text-base text-center">
                <strong className="text-cyan-400">Discover</strong> upcoming food events in one place
              </p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-700 shadow-xl w-full max-w-xl">
              <p className="text-gray-200 text-base text-center">
                <strong className="text-cyan-400">Create</strong> and promote your own pop-ups and gatherings
              </p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-700 shadow-xl w-full max-w-xl">
              <p className="text-gray-200 text-base text-center">
                <strong className="text-cyan-400">Filter</strong> by tags, time, and popularity
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-white">Meet the Team</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">

            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              <img
                src="assets/profHeadshot.jpg"
                alt="Imran Hussien"
                className="w-32 h-32 rounded-full object-cover shadow-lg border border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Imran Hussien</h3>
              <p className="text-purple-300 text-sm">Front-end Developer</p>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <img
                src="assets/edward.PNG"
                alt="Edward Ko"
                className="w-32 h-32 rounded-full object-cover shadow-lg border border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Edward Ko</h3>
              <p className="text-purple-300 text-sm">Front-end Developer</p>
            </div>

            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              <img
                src="https://cs-people.bu.edu/rohan204/assets/Profile.jpg"
                alt="Rohaan Navin Chablani Mirpuri"
                className="w-32 h-32 rounded-full object-cover shadow-lg border border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">
                Rohaan Navin Chablani Mirpuri
              </h3>
              <p className="text-purple-300 text-sm">Back-end Engineer</p>
            </div>

            {/* Team Member 4 */}
            <div className="flex flex-col items-center">
              <img
                src="assets/aidan.jpg"
                alt="Aidan Xu"
                className="w-32 h-32 rounded-full object-cover shadow-lg border border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Aidan Xu</h3>
              <p className="text-purple-300 text-sm">Full-stack Developer</p>
            </div>

            {/* Team Member 5 */}
            <div className="flex flex-col items-center">
              <img
                src="assets/Anson.jpeg"
                alt="Anson Zhu"
                className="w-32 h-32 rounded-full object-cover shadow-lg border border-cyan-500"
              />
              <h3 className="mt-4 text-lg font-semibold">Anson Zhu</h3>
              <p className="text-purple-300 text-sm">Full-stack Developer</p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
