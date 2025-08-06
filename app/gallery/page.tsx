export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore moments from our school life, events, and achievements
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Coming Soon</h2>
          <p className="text-lg text-gray-600">
            Our photo gallery is being updated with the latest school events and activities.
          </p>
        </div>
      </div>
    </div>
  )
}
