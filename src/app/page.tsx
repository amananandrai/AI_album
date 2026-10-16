import { ImageGallery } from "./components/imageGallery";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImageGallery />
        </div>
      </section>
    </main>
  );
}
