import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Video paths from the public folder should start with "/"
const videoList = [
  "/id-1.mp4",
  "/id-2.mp4"
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
              <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.241 0.145316C15.5516 -0.190755 16.1064 0.103007 16.0027 0.548637L15.3172 3.48907C15.2915 3.59901 15.3088 3.71443 15.365 3.81231L17.0261 6.70196C17.0637 6.76728 17.0844 6.84146 17.0857 6.9168L17.1199 8.96758C17.3901 9.05515 17.6524 9.16 17.9051 9.28203L20.4109 7.75664C20.4736 7.71838 20.526 7.66473 20.5633 7.60137L22.1951 4.82207C22.271 4.69307 22.407 4.61119 22.5564 4.60332L25.7019 4.44122C26.159 4.41769 26.3504 5.01611 25.9646 5.2625L23.4207 6.8875C23.3255 6.9483 23.2564 7.04277 23.2283 7.15215L22.3992 10.3807C22.3804 10.4537 22.3436 10.5211 22.2918 10.576L20.7986 12.158C20.9119 12.3888 21.01 12.628 21.0945 12.8738L23.9558 13.6053C24.0271 13.6235 24.1022 13.6239 24.1736 13.6063L27.3025 12.8338C27.4479 12.798 27.6017 12.8376 27.7117 12.9393L30.0242 15.077C30.3602 15.3876 30.0664 15.9423 29.6209 15.8387L26.6804 15.1531C26.5705 15.1275 26.4551 15.1448 26.3572 15.201L23.4666 16.8621C23.4013 16.8996 23.3279 16.9203 23.2527 16.9217L21.0847 16.9578C20.9945 17.2164 20.8884 17.467 20.7664 17.7088L22.282 20.2654C22.3195 20.3286 22.3724 20.3817 22.4353 20.4197L25.1941 22.0867C25.3222 22.1642 25.4029 22.3004 25.409 22.45L25.533 25.5975C25.5507 26.0545 24.9505 26.2387 24.7088 25.8504L23.114 23.2859C23.0544 23.1903 22.9612 23.12 22.8523 23.0906L19.6336 22.2225C19.5609 22.2028 19.4944 22.1654 19.4402 22.1131L17.8308 20.5574C17.6128 20.6593 17.3879 20.7485 17.157 20.825C17.1567 20.8262 17.1573 20.8277 17.157 20.8289L16.4451 23.7606C16.4277 23.832 16.4276 23.9072 16.4461 23.9783L17.2576 27.0975C17.2953 27.2426 17.2574 27.3973 17.157 27.5086L15.0476 29.8465C14.7411 30.1864 14.1825 29.8989 14.281 29.452L14.9304 26.5037C14.9548 26.3934 14.9372 26.2777 14.8797 26.1805L13.1824 23.3113C13.144 23.2464 13.1231 23.1728 13.1209 23.0975L13.0525 20.7645C12.8608 20.6943 12.6734 20.615 12.491 20.5272C12.4569 20.5714 12.416 20.6103 12.367 20.6395L9.77126 22.1785C9.708 22.216 9.65499 22.2689 9.61697 22.3318L7.95095 25.0906C7.87345 25.2189 7.73648 25.2996 7.58669 25.3055L4.44021 25.4295C3.98285 25.4475 3.79858 24.847 4.18728 24.6053L6.75076 23.0106C6.84654 22.951 6.9166 22.8577 6.94607 22.7488L7.81423 19.5301C7.83383 19.4574 7.8714 19.3909 7.92361 19.3367L9.57888 17.6238C9.48081 17.4218 9.39432 17.2133 9.31814 16.9998C9.26792 17.0051 9.21683 17.0041 9.16677 16.992L6.23415 16.2811C6.16283 16.2638 6.08839 16.2636 6.01736 16.282L2.89822 17.0926C2.75317 17.1303 2.5984 17.0933 2.48708 16.993L0.149193 14.8836C-0.19068 14.577 0.096741 14.0185 0.543725 14.117L3.49197 14.7664C3.60225 14.7907 3.718 14.7721 3.81521 14.7147L6.68435 13.0184C6.74926 12.98 6.82286 12.959 6.89822 12.9568L9.28982 12.8865C9.35734 12.6887 9.43499 12.4957 9.52126 12.3074C9.48635 12.2773 9.45489 12.2431 9.43044 12.2029L7.86013 9.62676C7.82186 9.56396 7.76827 9.51167 7.70486 9.47442L4.92654 7.84161C4.79729 7.76568 4.71454 7.62998 4.70681 7.48028L4.5447 4.33477C4.52157 3.878 5.11967 3.6865 5.36599 4.07207L6.99099 6.617C7.05175 6.712 7.14642 6.78029 7.25564 6.8084L10.4842 7.6375C10.5571 7.65625 10.6246 7.69324 10.6795 7.74493L12.3699 9.33965C12.5882 9.22856 12.8135 9.12896 13.0457 9.04375L13.7703 6.21368C13.7885 6.14242 13.7879 6.0673 13.7703 5.9959L12.9978 2.867C12.962 2.72158 13.0017 2.56786 13.1033 2.45782L15.241 0.145316Z" fill="white"/>
              </svg>
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
            <svg width="100" height="auto" viewBox="0 0 869 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M859.512 102.83C865.112 102.83 868.676 106.563 868.676 112.672C868.676 119.799 864.773 123.702 858.494 123.702C853.064 123.702 849.501 119.799 849.501 113.52C849.501 107.412 854.082 102.83 859.512 102.83Z" fill="white"/>
            <path d="M807.681 16.4595H810.905V42.4216H830.758V48.5303H810.905V100.455C810.905 109.787 813.111 114.029 819.389 114.029C822.444 114.029 825.838 112.333 829.74 109.109L831.946 112.163C824.989 120.138 818.032 124.041 810.905 124.041C797.67 124.041 796.651 115.387 796.651 98.588V48.5303H786.131V44.6275C796.991 40.7247 804.796 30.8829 807.681 16.4595Z" fill="white"/>
            <path d="M714.859 40.2158H718.083V57.1845C727.077 45.6458 735.391 40.2158 746.591 40.2158C763.39 40.2158 775.777 54.4695 775.777 76.5288C775.777 104.018 759.826 121.666 740.821 121.666C731.998 121.666 725.21 118.272 719.95 111.654V143.895C719.95 154.585 720.459 155.942 732.677 156.112V159.336C724.022 158.997 717.405 158.657 712.823 158.657C706.884 158.657 700.097 158.997 692.291 159.336V156.112C704.848 156.112 705.696 154.585 705.696 143.895V61.4267C705.696 54.4695 704.339 52.0939 697.042 52.0939C696.024 52.0939 695.006 52.2636 693.818 52.2636V48.8699C700.436 46.8336 707.393 43.9489 714.859 40.2158ZM719.78 104.188C725.38 112.163 732.167 116.236 739.803 116.236C753.209 116.236 763.05 103.679 763.05 83.6557C763.05 63.6326 752.7 51.0758 738.446 51.0758C731.658 51.0758 724.701 54.9786 719.78 62.2751V104.188Z" fill="white"/>
            <path d="M668.885 67.8748C668.885 54.4695 660.91 45.6458 650.389 45.6458C640.208 45.6458 632.402 53.6211 630.536 67.8748H668.885ZM683.648 72.7957H629.857V75.0016C629.857 97.2306 641.905 111.145 657.516 111.145C667.867 111.145 676.351 105.545 682.46 94.1763L685.854 95.3641C678.218 114.199 666.17 123.871 650.728 123.871C631.554 123.871 618.148 108.43 618.148 83.9951C618.148 57.1845 633.081 40.2158 653.783 40.2158C671.43 40.2158 683.817 52.0939 683.817 69.911C683.817 70.9292 683.648 71.7776 683.648 72.7957Z" fill="white"/>
            <path d="M484.141 0C491.607 0.33937 499.243 0.339369 506.879 0.339369H537.422C579.674 0.339369 603.091 22.0593 603.091 58.542C603.091 97.57 577.638 121.666 534.538 121.666C527.92 121.666 518.587 121.156 506.879 121.156C497.885 121.156 490.419 121.496 484.141 122.175V118.441C498.055 118.102 498.055 116.066 498.055 104.188V17.8171C498.055 5.93904 498.055 3.9028 484.141 3.56342V0ZM515.872 102.152C515.872 113.181 517.06 115.048 530.805 115.048C566.099 115.048 583.917 97.0609 583.917 61.4267C583.917 25.7924 564.063 5.76935 527.92 5.76935H521.641C516.211 5.76935 515.872 6.27842 515.872 11.5387V102.152Z" fill="white"/>
            <path d="M470.928 66.5171V81.6193H400.508C402.714 98.2486 412.895 108.26 426.809 108.26C437.669 108.26 446.493 102.151 449.717 92.9883H470.08C466.177 111.145 449.378 124.38 426.809 124.38C399.32 124.38 380.824 104.697 380.824 75.0015C380.824 44.1184 399.659 25.6226 426.809 25.6226C452.262 25.6226 470.928 43.1003 470.928 66.5171ZM426.809 41.7428C412.725 41.7428 403.053 51.7544 400.678 64.9899H452.093C450.056 51.2453 440.554 41.7428 426.809 41.7428Z" fill="white"/>
            <path d="M346.525 104.527C365.53 104.527 374.693 113.181 374.693 127.095C374.693 141.179 365.53 150.512 346.186 150.512H314.794C297.825 150.512 288.832 143.385 288.832 133.034C288.832 124.889 293.244 118.611 304.104 116.066C293.074 113.69 287.983 106.054 287.983 98.2486C287.983 90.2733 293.583 83.1464 304.613 81.2799C297.656 75.6802 293.583 67.5352 293.583 57.6934C293.583 38.0097 310.212 25.6226 331.423 25.6226C341.774 25.6226 350.937 28.5072 357.725 33.7675H357.894C357.385 30.0344 362.476 25.9619 366.888 25.9619H373.845V41.9125H370.451C368.924 41.9125 366.888 41.7428 364.682 41.4035C367.567 45.985 369.263 51.415 369.263 57.6934C369.263 77.3771 352.464 89.7642 331.423 89.7642H312.249C307.328 89.7642 304.443 92.1399 304.443 96.0427C304.443 101.303 309.364 104.527 318.697 104.527H346.525ZM331.423 41.7428C320.903 41.5731 312.927 47.3425 312.927 57.6934C312.927 68.214 320.903 73.8137 331.423 73.644C341.774 73.4743 349.749 68.214 349.749 57.6934C349.749 47.3425 341.774 41.9125 331.423 41.7428ZM309.025 80.7708H310.212H309.025ZM346.525 134.222C352.464 134.222 355.179 132.186 355.179 127.095C355.179 122.174 352.295 120.817 346.186 120.817H314.794C309.364 120.817 305.97 122.853 305.97 127.095C305.97 132.356 309.194 134.222 314.624 134.222H346.525Z" fill="white"/>
            <path d="M275.965 105.375H283.771V121.665H273.25C261.372 121.665 255.094 115.048 254.585 105.545C250.003 118.611 238.295 124.72 224.55 124.72C206.054 124.72 190.273 114.878 190.273 93.3277C190.273 72.7955 205.206 63.8021 227.435 63.8021H234.901C248.815 63.8021 253.058 60.069 253.058 53.9603C253.058 46.4941 245.591 41.7428 234.731 41.7428C222.005 41.7428 213.69 48.0212 212.502 58.5418H193.837C195.194 39.1975 207.582 25.6226 234.731 25.6226C262.73 25.6226 272.232 40.046 272.232 59.7296V100.794C272.232 103.848 273.42 105.375 275.965 105.375ZM253.567 78.2255V67.5352H253.397C251.7 75.5105 243.555 80.0921 230.489 80.0921H227.774C214.199 80.0921 209.787 86.0311 209.787 93.3277C209.787 100.964 214.878 108.43 227.605 108.43C242.198 108.43 253.567 99.2667 253.567 78.2255Z" fill="white"/>
            <path d="M143.923 25.6226C162.928 25.6226 174.975 40.2156 174.975 62.784V121.665H156.31V64.3112C156.31 48.8697 149.353 42.2519 139.341 42.2519C127.463 42.2519 117.112 51.2453 117.112 68.8927V121.665H98.4465V64.3112C98.4465 48.8697 91.3196 42.2519 81.3081 42.2519C69.43 42.2519 59.4185 51.415 59.4185 69.0624V121.665H40.7529V28.3376H59.0791V42.2519H59.4185C63.8304 34.616 71.9753 25.6226 86.0594 25.6226C100.143 25.6226 110.494 33.0888 114.906 46.6637L114.397 42.4216H114.906C120.675 32.9191 129.33 25.6226 143.923 25.6226Z" fill="white"/>
            <path d="M0 121.666V2.88477H19.1746V121.666H0Z" fill="white"/>
            </svg>
          </motion.div>
          <motion.nav 
            className="space-x-8 text-xs font-semibold uppercase tracking-[0.15em] hidden md:block"
            initial={{ opacity: 0, y: -20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
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

        {/* Center Single Line Text Overlay */}
        <main className="flex-1 flex items-center justify-center title-id">
          <motion.p 
            className="text-sm md:text-base uppercase tracking-[0.1em] text-white/90 text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            A creative studio born in Buenos Aires. Working Globally.
          </motion.p>
        </main>

        {/* Footer / Controls */}
        <footer className="flex justify-between items-end w-full text-[10px] md:text-xs uppercase tracking-[0.15em] text-gray-400">
          <motion.div
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ delay: 1.1 }}
          >
            ImageDept. Recoleta, Buenos Aires.
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