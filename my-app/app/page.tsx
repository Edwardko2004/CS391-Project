import EventCards from "./components/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="text-center py-12 bg-black">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Spark! Bytes
        </h1>
        <p className="text-gray-400 text-lg">
          Discover amazing food events around campus
        </p>
      </div>

      {/* Events Section */}
      <div className="bg-black">
        <EventCards />
      </div>
    </div>
  );
}
