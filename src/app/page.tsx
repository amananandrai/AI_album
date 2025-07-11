import { ImageGallery } from "./components/imageGallery";
import { Instagram, Youtube, Pinterest, Mail } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-accent text-primary py-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            AI Generated Gallery
          </h1>
          <p className="text-lg text-primary max-w-2xl mx-auto">
            Explore our collection of stunning AI-generated images. Each piece represents the cutting edge of artificial intelligence creativity.
          </p>
        </div>
        <div id="gallery">
          <ImageGallery />
        </div>
      </div>
      {/* About & Contact Section */}
      <footer className="w-full bg-primary text-accent mt-12 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          {/* About Section */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">About</h2>
            <p className="max-w-md text-accent">
              This gallery showcases the creative power of artificial intelligence. Our mission is to inspire and amaze by curating the best AI-generated art from around the world.
            </p>
          </div>
          {/* Contact Section */}
          <div className="text-center md:text-right">
            <h2 className="text-2xl font-bold mb-2">Contact</h2>
            <div className="flex justify-center md:justify-end gap-6 mt-2">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-tertiary transition-colors">
                <Instagram className="h-7 w-7" />
              </a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-tertiary transition-colors">
                <Youtube className="h-7 w-7" />
              </a>
              <a href="https://pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:text-tertiary transition-colors">
                <Pinterest className="h-7 w-7" />
              </a>
              <a href="mailto:info@example.com" aria-label="Email" className="hover:text-tertiary transition-colors">
                <Mail className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
