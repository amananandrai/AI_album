import { ImageGallery } from "./components/imageGallery";
import { Instagram, Youtube, Globe, Mail, Sparkles, Zap, Star, ArrowDown } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 mb-8">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-slate-200">Powered by AI Technology</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 animate-slide-up">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Generated
              </span>
              <br />
              <span className="text-white">Gallery</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
              Explore our collection of stunning AI-generated images. Each piece represents the cutting edge of 
              <span className="text-purple-400 font-semibold"> artificial intelligence creativity</span>.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1000+</div>
                <div className="text-slate-400">AI Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-slate-400">AI Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-slate-400">Updated</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in" style={{animationDelay: '0.6s'}}>
              <a 
                href="#gallery" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <Star className="h-5 w-5" />
                Explore Gallery
              </a>
              <a 
                href="/upload" 
                className="inline-flex items-center gap-3 px-8 py-4 glass border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <Zap className="h-5 w-5" />
                Upload Artwork
              </a>
            </div>
            
            {/* Scroll Indicator */}
            <div className="animate-bounce">
              <ArrowDown className="h-6 w-6 text-slate-400 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Featured <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Artworks</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover incredible AI-generated art from talented creators around the world
            </p>
          </div>
          <ImageGallery />
        </div>
      </section>

      {/* About & Contact Section */}
      <footer id="about" className="relative mt-20 py-20 glass border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* About Section */}
            <div className="text-center lg:text-left animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Gallery</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                This gallery showcases the creative power of artificial intelligence. Our mission is to inspire and amaze by curating the best AI-generated art from around the world. We believe AI is not just a tool, but a new medium for artistic expression.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-200">AI Powered</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-slate-200">Curated</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-200">Innovative</span>
                </div>
              </div>
            </div>
            
            {/* Contact Section */}
            <div id="contact" className="text-center lg:text-right animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-lg text-slate-300 mb-8">
                Connect with us and stay updated on the latest AI art trends
              </p>
              <div className="flex justify-center lg:justify-end gap-6">
                <a 
                  href="https://www.instagram.com/ai_man_and_art/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram" 
                  className="p-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
                >
                  <Instagram className="h-6 w-6 text-slate-300 group-hover:text-pink-400 transition-colors" />
                </a>
                <a 
                  href="https://www.youtube.com/@ai_man_0822" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="YouTube" 
                  className="p-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
                >
                  <Youtube className="h-6 w-6 text-slate-300 group-hover:text-red-400 transition-colors" />
                </a>
                <a 
                  href="https://www.pinterest.com/aiman25842/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Pinterest" 
                  className="p-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
                >
                  <Globe className="h-6 w-6 text-slate-300 group-hover:text-blue-400 transition-colors" />
                </a>
                <a 
                  href="mailto:aiman25842@gmail.com" 
                  aria-label="Email" 
                  className="p-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
                >
                  <Mail className="h-6 w-6 text-slate-300 group-hover:text-green-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center pt-16 mt-16 border-t border-white/10">
            <p className="text-slate-400">
              © 2024 AI Gallery. Made with ❤️ for the AI art community.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
