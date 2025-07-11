import { ImageGallery } from "./components/imageGallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Generated Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of stunning AI-generated images. Each piece represents the cutting edge of artificial intelligence creativity.
          </p>
        </div>
        <div id="gallery">
          <ImageGallery />
        </div>
      </div>
    </main>
  );
}
      <ImageGallery />
    </main>
  );
}
