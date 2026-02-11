import React from 'react';
import { SlideContent, SlideLayout } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Quote, Utensils, ScrollText } from 'lucide-react';

interface SlideViewProps {
  slide: SlideContent;
}

const SlideView: React.FC<SlideViewProps> = ({ slide }) => {
  const imageSrc = `https://picsum.photos/seed/${slide.imageKeyword || 'food'}/1200/800`;

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.4 } }
  };

  const renderContent = () => {
    switch (slide.layout) {
      case SlideLayout.TitleOnly:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-12 relative overflow-hidden">
             <div className="absolute inset-0 bg-black/40 z-0">
                <img src={imageSrc} alt="Background" className="w-full h-full object-cover opacity-50 blur-sm" />
             </div>
             <div className="z-10 bg-rice-paper/90 p-12 rounded-lg shadow-2xl border-t-4 border-asian-red max-w-4xl">
                <h1 className="text-6xl font-serif text-asian-red mb-6">{slide.title}</h1>
                {slide.subtitle && <h2 className="text-3xl text-gray-700 font-light italic">{slide.subtitle}</h2>}
                <div className="mt-8 flex justify-center text-asian-gold">
                    <Utensils size={48} />
                </div>
             </div>
          </div>
        );

      case SlideLayout.TextAndImage:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <div className="p-12 flex flex-col justify-center bg-rice-paper text-ink-black">
              <div className="mb-4 w-16 h-1 bg-asian-gold"></div>
              <h2 className="text-4xl font-serif text-asian-red mb-8 font-bold">{slide.title}</h2>
              <p className="text-xl leading-relaxed text-gray-700 font-sans">{slide.body}</p>
            </div>
            <div className="relative h-full">
               <img src={imageSrc} alt={slide.imageKeyword} className="absolute inset-0 w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-r from-rice-paper to-transparent w-24"></div>
            </div>
          </div>
        );

      case SlideLayout.BulletPoints:
        return (
          <div className="flex h-full bg-rice-paper">
             <div className="w-1/3 relative hidden md:block">
                <img src={imageSrc} alt="Decoration" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-asian-red/20 mix-blend-multiply"></div>
             </div>
             <div className="flex-1 p-16 flex flex-col justify-center">
                <h2 className="text-5xl font-serif text-asian-red mb-10 border-b-2 border-asian-gold pb-4 inline-block">{slide.title}</h2>
                <p className="text-lg text-gray-600 mb-8 italic">{slide.body}</p>
                <ul className="space-y-6">
                  {slide.bulletPoints?.map((point, idx) => (
                    <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.1) }}
                        className="flex items-start text-xl text-gray-800"
                    >
                      <span className="text-asian-gold mr-4 mt-1">✦</span>
                      {point}
                    </motion.li>
                  ))}
                </ul>
             </div>
          </div>
        );

      case SlideLayout.Chart:
        return (
          <div className="flex flex-col h-full bg-rice-paper p-12">
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-serif text-asian-red mb-2">{slide.title}</h2>
                <p className="text-gray-600">{slide.body}</p>
            </div>
            <div className="flex-1 flex items-center justify-center bg-white rounded-xl shadow-inner p-8 border border-gray-200">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={slide.chartData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{fill: '#4b5563'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#4b5563'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderColor: '#d4af37', borderRadius: '8px' }}
                        itemStyle={{ color: '#8a2323' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {(slide.chartData || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8a2323' : '#d4af37'} />
                        ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4 italic">Datos representativos con fines didácticos.</p>
          </div>
        );

      case SlideLayout.Conclusion:
        return (
           <div className="flex flex-col items-center justify-center h-full text-center px-16 bg-asian-red text-rice-paper relative">
             <div className="absolute top-0 left-0 p-8 opacity-20"><Quote size={120} /></div>
             <div className="max-w-3xl z-10">
                <h2 className="text-5xl font-serif mb-8">{slide.title}</h2>
                <div className="w-24 h-1 bg-asian-gold mx-auto mb-8"></div>
                <p className="text-2xl font-light leading-relaxed opacity-90">{slide.body}</p>
                <div className="mt-12 opacity-80">
                    <ScrollText size={48} className="mx-auto mb-2" />
                    <span className="text-sm tracking-widest uppercase">Fin de la Presentación</span>
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
        className="w-full h-full bg-white shadow-2xl overflow-hidden rounded-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
    >
      {renderContent()}
    </motion.div>
  );
};

export default SlideView;