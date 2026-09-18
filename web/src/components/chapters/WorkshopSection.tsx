import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WorkshopCanvas } from '../workshop/WorkshopCanvas';
import { WorkOrderForm } from '../workshop/WorkOrderForm';
import { MovableWindow } from '../workshop/MovableWindow';
import { DIMENSIONAL_CHAPTERS } from '../../data/content';

export const WorkshopSection: React.FC = () => {
  const chapter = DIMENSIONAL_CHAPTERS['Singularity'];

  // Workshop Interactive State
  const [screwsTightened, setScrewsTightened] = useState<boolean[]>([false, false, false, false]);
  const [isBooted, setIsBooted] = useState(false);
  const [isAntiG, setIsAntiG] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTightening, setIsTightening] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isWaving, setIsWaving] = useState(true);

  // Dynamic speech bubble text
  const [speechText, setSpeechText] = useState(
    "Hey! Welcome to the workshop. Got an ambitious project? Let's build it together."
  );

  // Initial wave on mount for 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Handle individual screw fastening
  const handleScrewClick = (index: number) => {
    if (screwsTightened[index]) return;

    const nextScrews = [...screwsTightened];
    nextScrews[index] = true;
    setScrewsTightened(nextScrews);

    // Trigger Arth's tightening gesture
    setIsTightening(true);
    setTimeout(() => setIsTightening(false), 1200);

    const tightenedCount = nextScrews.filter(Boolean).length;

    if (tightenedCount === 4) {
      // All screws fastened -> BOOT SEQUENCE!
      setIsBooted(true);
      setIsCelebrating(true);
      setSpeechText(
        'RIG-01 is online! All 4 screws secured. Subsystems nominal and ready for launch!'
      );

      // Trigger victory confetti burst
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f7ff', '#38bdf8', '#818cf8', '#22c55e'],
      });

      setTimeout(() => setIsCelebrating(false), 3500);
    } else {
      setSpeechText(`Nice torque! That's screw #${tightenedCount}/4 locked in.`);
    }
  };

  // Quick assemble shortcut
  const handleQuickAssemble = () => {
    if (isBooted) return;
    setScrewsTightened([true, true, true, true]);
    setIsBooted(true);
    setIsCelebrating(true);
    setSpeechText('All 4 screws locked in! RIG-01 is fully assembled & online.');

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00f7ff', '#38bdf8', '#818cf8', '#22c55e'],
    });

    setTimeout(() => setIsCelebrating(false), 3000);
  };

  // Toggle Anti-G
  const handleToggleAntiG = () => {
    const nextState = !isAntiG;
    setIsAntiG(nextState);
    if (nextState) {
      setSpeechText('Zero-G field activated! Keep an eye on floating coffee and ducks.');
    } else {
      setSpeechText('Gravity restored. Hardware resting securely on the bench.');
    }
  };

  // Typing focus handlers
  const handleFormFocus = () => {
    setIsTyping(true);
    setSpeechText("I'm listening! Tell me about the technical specs and goals of your project.");
  };

  const handleFormBlur = () => {
    setIsTyping(false);
  };

  const handleResetLayout = () => {
    try {
      localStorage.removeItem('workshop_window_viewport');
    } catch {
      // Ignore
    }
  };

  return (
    <section
      id="chapter-singularity"
      className="min-h-[100dvh] w-full max-w-full flex flex-col justify-center px-3 sm:px-6 lg:px-12 xl:px-16 relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16 select-none overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* ================= HEADER & DIMENSION BADGE ================= */}
        <div className="mb-4 sm:mb-6 p-4 sm:p-5 lg:p-6 rounded-2xl bg-void-950/80 backdrop-blur-md border border-white/10 shadow-xl relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs mb-2 sm:mb-3 shadow-[0_0_12px_rgba(0,247,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>
              {chapter.dimension} // THE WORKSHOP &bull; {chapter.coordinates} &bull; {chapter.title}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            The Workshop:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Build &amp; Connect
            </span>
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-slate-300 font-display max-w-2xl">
            A luminous cyberpunk hardware studio where ideas get compiled and prototypes come to
            life. Inspect the PC rig in full 360°, fasten screws to boot the system, or transmit a
            work order below.
          </p>
        </div>

        {/* ================= 3D WORKSHOP & CLIPBOARD FORM GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
          {/* Left Column: Movable 3D Workshop Window (7 cols on desktop) */}
          <div className="lg:col-span-7 w-full flex flex-col">
            <MovableWindow
              id="viewport"
              title="THE WORKSHOP // 3D HARDWARE STUDIO"
              defaultSize={{ width: 720, height: 600 }}
              minWidth={280}
              minHeight={360}
              className="w-full max-w-full"
            >
              <WorkshopCanvas
                screwsTightened={screwsTightened}
                onScrewClick={handleScrewClick}
                isBooted={isBooted}
                isAntiG={isAntiG}
                isTyping={isTyping}
                isTightening={isTightening}
                isCelebrating={isCelebrating}
                isWaving={isWaving}
              />
            </MovableWindow>
          </div>

          {/* Right Column: Work Order Clipboard Form (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <WorkOrderForm
              onFormFocus={handleFormFocus}
              onFormBlur={handleFormBlur}
              screwsTightenedCount={screwsTightened.filter(Boolean).length}
              isBooted={isBooted}
              onQuickAssemble={handleQuickAssemble}
              isAntiG={isAntiG}
              onToggleAntiG={handleToggleAntiG}
              speechText={speechText}
              onResetLayout={handleResetLayout}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
