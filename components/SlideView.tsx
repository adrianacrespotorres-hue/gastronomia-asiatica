import React from 'react';
import { SlideContent, SlideLayout } from '../types';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Map, Sparkles, History } from 'lucide-react';

interface SlideViewProps {
  slide: SlideContent;
}

const SlideView: React.FC<SlideViewProps> = ({ slide }) => {
  const imageSrc = `https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=1200&sig=${slide.id}`;

  const renderContent = () => {
    switch (slide.layout) {
      case SlideLayout.TitleOnly:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-12 relative overflow-hidden bg-ink-black">
             <div className="absolute inset-0 z-0">
                <img src={imageSrc} alt="Art" className="w-full h-full object-cover opacity-40 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-black/80 to-ink-black"></div>
             </div>
             <div className="z-10 rice-paper-texture p-16 rounded-sm border-2 border-asian-gold shadow-2xl max-w-4xl transform -rotate-1">
                <h1 className="text-6xl font-serif text-asian-red mb-4 uppercase tracking-tighter ink-bleed">{slide.title}</h1>
                <div className="h-px w-48 bg-asian-gold mx-auto mb-6"></div>
                {slide.subtitle && <h2 className="text-2xl text-gray-800 font-sans font-light italic">{slide.subtitle}</h2>}
                <div className="mt-8 text-asian-red flex justify-center gap-4">
                    <History size={32} />
                    <Sparkles size={32} />
                </div>
             </div>
          </div>
        );

      case SlideLayout.TextAndImage:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full bg-rice-paper">
            <div className="p-16 flex flex-col justify-center border-r border-asian-gold/20">
              <div className="flex items-center gap-2 text-asian-gold mb-6">
                <BookOpen size={20} />
                <span className="uppercase tracking-widest text-xs font-bold">Investigación Histórica</span>
              </div>
              <h2 className="text-4xl font-serif text-asian-red mb-8 font-bold leading-tight">{slide.title}</h2>
              <p className="text-xl leading-relaxed text-gray-700 font-serif italic mb-6">"{slide.body}"</p>
              <div className="w-12 h-1 bg-asian-red"></div>
            </div>
            <div className="relative">
               <img src={imageSrc} alt={slide.imageKeyword} className="w-full h-full object-cover" />
               <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]"></div>
            </div>
          </div>
        );

      case SlideLayout.BulletPoints:
        return (
          <div className="flex h-full bg-silk-white rice-paper-texture">
             <div className="flex-1 p-20 flex flex-col justify-center">
                <div className="mb-12">
                    <h2 className="text-5xl font-serif text-asian-red mb-2">{slide.title}</h2>
                    <div className="h-0.5 w-full bg-gradient-to-r from-asian-gold to-transparent"></div>
                </div>
                <ul className="grid grid-cols-1 gap-8">
                  {slide.bulletPoints?.map((point, idx) => (
                    <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * idx }}
                        className="flex items-start text-xl text-ink-black group"
                    >
                      <span className="w-8 h-8 rounded-full border border-asian-gold flex items-center justify-center text-xs font-bold text-asian-gold mr-6 group-hover:bg-asian-gold group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <span className="flex-1 pb-4 border-b border-gray-100 italic">{point}</span>
                    </motion.li>
                  ))}
                </ul>
             </div>
             <div className="w-1/4 h-full border-l border-asian-gold/20 p-8 flex flex-col items-center justify-end bg-rice-paper">
                <Map className="text-asian-gold mb-4" size={40} />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 rotate-180 [writing-mode:vertical-rl]">Crónicas de la Diáspora</p>
             </div>
          </div>
        );

      case SlideLayout.Chart:
        return (
          <div className="flex flex-col h-full bg-rice-paper p-16">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-serif text-asian-red mb-2">{slide.title}</h2>
                    <p className="text-gray-600 font-sans italic">{slide.body}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-widest text-asian-gold">Análisis de Datos</span>
                </div>
            </div>
            <div className="flex-1 bg-white/50 backdrop-blur rounded-sm border border-asian-gold/10 p-12 shadow-inner">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={slide.chartData || []}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#d1d5db" />
                    <XAxis dataKey="name" tick={{fill: '#8a2323', fontSize: 12, fontWeight: 'bold'}} axisLine={{stroke: '#b8860b'}} />
                    <YAxis tick={{fill: '#4b5563'}} axisLine={false} />
                    <Tooltip 
                        cursor={{fill: '#f4f1ea'}}
                        contentStyle={{ backgroundColor: '#faf9f6', border: '1px solid #b8860b', borderRadius: '0' }}
                    />
                    <Bar dataKey="value" barSize={60}>
                        {(slide.chartData || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8a2323' : '#b8860b'} fillOpacity={0.8} />
                        ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        );

      case SlideLayout.Conclusion:
        return (
           <div className="flex flex-col items-center justify-center h-full text-center px-24 bg-ink-black text-rice-paper relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 text-[20rem] font-noto rotate-12 opacity-50">食</div>
                <div className="absolute bottom-0 right-0 text-[15rem] font-noto -rotate-12 opacity-50">和</div>
             </div>
             <div className="z-10 max-w-4xl">
                <History className="text-asian-gold mx-auto mb-8 animate-pulse" size={48} />
                <h2 className="text-6xl font-serif mb-10 tracking-tight leading-tight">{slide.title}</h2>
                <div className="h-1 w-32 bg-asian-gold mx-auto mb-10"></div>
                <p className="text-2xl font-sans font-light leading-relaxed italic opacity-80 max-w-2xl mx-auto">{slide.body}</p>
                <div className="mt-20 border-t border-white/10 pt-8">
                    <p className="text-xs uppercase tracking-[0.5em] font-bold text-asian-gold">Cátedra de Estudios Gastronómicos</p>
                </div>
             </div>
           </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
        className="w-full h-full shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden rounded-none border-8 border-ink-black"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.8, ease: "anticipate" }}
    >
      {renderContent()}
    </motion.div>
  );
};

export default SlideView;