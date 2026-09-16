import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded list of 5 high-quality placeholder videos
const videoList = [
  "public/video1.mp4",
  "public/video2.mp4",
  "public/video1.mp4",
  "public/video2.mp4",
  "public/video1.mp4"
];

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [activePlayer, setActivePlayer] = useState(1);
  const [idx1, setIdx1] = useState(0);
  const [idx2, setIdx2] = useState(1);
  const [isMuted, setIsMuted] = useState(true);

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  // Handle the slick intro animation timing
  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Ensure the first video plays automatically once the intro clears
  useEffect(() => {
    if (introDone) {
      if (activePlayer === 1 && video1Ref.current) {
        video1Ref.current.play().catch(e => console.log("Autoplay blocked:", e));
      } else if (activePlayer === 2 && video2Ref.current) {
        video2Ref.current.play().catch(e => console.log("Autoplay blocked:", e));
      }
    }
  }, [introDone, activePlayer]);

  // Player 1 ends -> Hard cut to Player 2, preload next video in Player 1
  const handleEnded1 = () => {
    setActivePlayer(2);
    if (video2Ref.current) video2Ref.current.play().catch(e => console.log(e));
    setIdx1((idx2 + 1) % videoList.length);
  };

  // Player 2 ends -> Hard cut to Player 1, preload next video in Player 2
  const handleEnded2 = () => {
    setActivePlayer(1);
    if (video1Ref.current) video1Ref.current.play().catch(e => console.log(e));
    setIdx2((idx1 + 1) % videoList.length);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* Intro Animation Layer */}
      <AnimatePresence>
        {!introDone && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div className="overflow-hidden">
              <motion.h1 
                className="text-3xl md:text-5xl tracking-[0.2em] uppercase font-light text-white"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Visionary
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Double Buffer System */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Video Player 1 */}
        <video
          ref={video1Ref}
          src={videoList[idx1]}
          muted={isMuted}
          playsInline
          autoPlay={false}
          onEnded={handleEnded1}
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover ${activePlayer === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        />

        {/* Video Player 2 */}
        <video
          ref={video2Ref}
          src={videoList[idx2]}
          muted={isMuted}
          playsInline
          autoPlay={false}
          onEnded={handleEnded2}
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover ${activePlayer === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        />
        
        {/* Subtle dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Overlay Minimalist UI */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        
        {/* Header Navigation */}
        <header className="flex justify-between items-center w-full">
          <motion.div 
            className="text-xl md:text-2xl font-bold tracking-tighter"
            initial={{ opacity: 0, y: -20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            STUDIO.
          </motion.div>
          <motion.nav 
            className="space-x-8 text-xs font-semibold uppercase tracking-[0.15em] hidden md:block"
            initial={{ opacity: 0, y: -20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <a href="#" className="hover:text-gray-300 transition-colors pointer-events-auto">Showreel</a>
            <a href="#" className="hover:text-gray-300 transition-colors pointer-events-auto">Directors</a>
            <a href="#" className="hover:text-gray-300 transition-colors pointer-events-auto">Contact</a>
          </motion.nav>
          
          {/* Mobile menu icon */}
          <motion.button 
            className="md:hidden pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </motion.button>
        </header>
        
        {/* Footer / Controls */}
        <footer className="flex justify-between items-end w-full text-[10px] md:text-xs uppercase tracking-[0.15em] text-gray-400">
          <motion.div
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ delay: 1.1 }}
          >
            © {new Date().getFullYear()} Studio Inc.
          </motion.div>
          
          {/* Global Mute Toggle */}
          <motion.button 
            className="pointer-events-auto hover:text-white transition-colors flex items-center gap-3"
            onClick={() => setIsMuted(!isMuted)}
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ delay: 1.1 }}
          >
            {isMuted ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                <span>Sound Off</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                <span>Sound On</span>
              </>
            )}
          </motion.button>
        </footer>
      </div>
    </div>
  );
}