import React, { useState, useEffect, useCallback } from 'react';
import { generatePresentation } from './services/api';
import { SlideContent } from './types';
import SlideView from './components/SlideView';
import { ChevronLeft, ChevronRight, Loader2, PlayCircle, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startPresentation = async () => {
    setLoading(true);
    const data = await generatePresentation();
    setSlides(data);
    setLoading(false);
    setStarted(true);
    setCurrentSlideIndex(0);
  };

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rice-paper flex flex-col items-center justify-center text-asian-red">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
            <Loader2 size={64} className="mb-4" />
        </motion.div>
        <h2 className="text-2xl font-serif mb-2">Consultando los Archivos Imperiales...</h2>
        <p className="text-gray-600">Generando presentación gastronómica con IA</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-rice-paper relative overflow-hidden flex flex-col items-center justify-center p-8">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-asian-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-asian-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-2xl z-10 text-center bg-white/80 backdrop-blur-md p-12 rounded-2xl shadow-xl border border-asian-gold/20">
            <h1 className="text-5xl md:text-6xl font-serif text-asian-red mb-6">Gastronomía Asiática</h1>
            <p className="text-xl text-gray-700 mb-8 font-light italic">
                "Historia, Tradición y Evolución"
            </p>
            <div className="w-16 h-1 bg-asian-gold mx-auto mb-8"></div>
            <p className="text-gray-600 mb-10 leading-relaxed">
                Herramienta didáctica para estudiantes de gastronomía. 
                Genera una presentación completa de 10 diapositivas analizando 
                la influencia cultural en la cocina asiática.
            </p>
            
            <button 
                onClick={startPresentation}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-asian-red font-sans rounded-full hover:bg-red-800 focus:outline-none ring-offset-2 focus:ring-2 ring-asian-red"
            >
                <span className="mr-2">Iniciar Presentación</span>
                <PlayCircle size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
        
        <footer className="absolute bottom-4 text-gray-400 text-sm">
            Powered by Gemini AI • Designed for Gastronomy Students
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Toolbar */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 text-white">
        <h2 className="font-serif text-lg text-asian-gold tracking-wider hidden md:block">
            Módulo de Historia Gastronómica
        </h2>
        <div className="flex gap-4">
             <button onClick={startPresentation} className="hover:text-asian-gold transition-colors" title="Regenerar">
                <RefreshCw size={20} />
             </button>
             <button onClick={toggleFullscreen} className="hover:text-asian-gold transition-colors" title="Pantalla Completa">
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
             </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="w-full max-w-6xl aspect-video bg-black rounded-lg shadow-2xl relative">
        <AnimatePresence mode="wait">
             {slides[currentSlideIndex] && (
                 <SlideView key={currentSlideIndex} slide={slides[currentSlideIndex]} />
             )}
        </AnimatePresence>
      </div>

      {/* Controls & Progress */}
      <div className="w-full max-w-6xl mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-4 text-white font-mono text-sm">
            <span className="text-asian-gold">{String(currentSlideIndex + 1).padStart(2, '0')}</span>
            <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-asian-gold transition-all duration-300" 
                    style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
                ></div>
            </div>
            <span className="text-gray-500">{String(slides.length).padStart(2, '0')}</span>
         </div>

         <div className="flex items-center gap-6">
            <button 
                onClick={prevSlide} 
                disabled={currentSlideIndex === 0}
                className="p-3 rounded-full bg-white/10 hover:bg-asian-gold/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={nextSlide} 
                disabled={currentSlideIndex === slides.length - 1}
                className="p-3 rounded-full bg-white/10 hover:bg-asian-gold/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={24} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default App;