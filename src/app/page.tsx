import { ImageGallery } from "./components/imageGallery";
import { Instagram, Youtube, Globe, Mail } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-accent text-primary flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 flex-1 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8">
            AI Generated Gallery
          </h1>
          <p className="text-lg sm:text-xl text-primary max-w-3xl mx-auto leading-relaxed">
            Explore our collection of stunning AI-generated images. Each piece represents the cutting edge of artificial intelligence creativity.
          </p>
        </div>
        <div id="gallery" className="space-y-8">
          <ImageGallery />
        </div>
      </div>
      {/* About & Contact Section */}
      <footer className="w-full bg-primary text-accent mt-16 sm:mt-20 lg:mt-24 py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-16">
          {/* About Section */}
          <div className="text-center lg:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">About</h2>
            <p className="max-w-lg text-accent leading-relaxed">
              This gallery showcases the creative power of artificial intelligence. Our mission is to inspire and amaze by curating the best AI-generated art from around the world.
            </p>
          </div>
          {/* Contact Section */}
          <div className="text-center lg:text-right flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Contact</h2>
            <div className="flex justify-center lg:justify-end gap-8 sm:gap-10 mt-4">
              <a href="https://www.instagram.com/ai_man_and_art/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-tertiary transition-colors duration-200 p-2 rounded-full hover:bg-secondary/20">
                <Instagram className="h-8 w-8" />
              </a>
              <a href="https://www.youtube.com/@ai_man_0822" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-tertiary transition-colors duration-200 p-2 rounded-full hover:bg-secondary/20">
                <Youtube className="h-8 w-8" />
              </a>
              <a href="https://www.pinterest.com/aiman25842/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:text-tertiary transition-colors duration-200 p-2 rounded-full hover:bg-secondary/20">
                <Globe className="h-8 w-8" />
              </a>
              <a href="mailto:aiman25842@gmail.com" aria-label="Email" className="hover:text-tertiary transition-colors duration-200 p-2 rounded-full hover:bg-secondary/20">
                <Mail className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
