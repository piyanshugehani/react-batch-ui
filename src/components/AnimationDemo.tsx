import React, { useRef, useState } from 'react';
import { Play, Square, Shuffle } from 'lucide-react';
import { useBatchAnimation } from '../lib/hooks';

export function AnimationDemo() {
  const [isAnimating, setIsAnimating] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const animate = useBatchAnimation(boxRef.current, { priority: 'high' });

  const runAnimation = async (type: 'bounce' | 'spin' | 'scale' | 'slide') => {
    if (isAnimating || !boxRef.current) return;
    
    setIsAnimating(true);
    
    try {
      switch (type) {
        case 'bounce':
          await animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(-50px)' },
            { transform: 'translateY(0px)' }
          ], { duration: 600 });
          break;
          
        case 'spin':
          await animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
          ], { duration: 800 });
          break;
          
        case 'scale':
          await animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.5)' },
            { transform: 'scale(1)' }
          ], { duration: 500 });
          break;
          
        case 'slide':
          await animate([
            { transform: 'translateX(0px)' },
            { transform: 'translateX(100px)' },
            { transform: 'translateX(0px)' }
          ], { duration: 700 });
          break;
      }
    } catch (error) {
      console.warn('Animation failed:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const runRandomAnimations = async () => {
    if (isAnimating) return;
    
    const animations = ['bounce', 'spin', 'scale', 'slide'] as const;
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    await runAnimation(randomAnimation);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Batched Animations</h3>
      
      <div className="flex justify-center mb-6">
        <div 
          ref={boxRef}
          className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md"
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => runAnimation('bounce')}
          disabled={isAnimating}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
        >
          <Play className="w-3 h-3" />
          Bounce
        </button>
        
        <button
          onClick={() => runAnimation('spin')}
          disabled={isAnimating}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
        >
          <Play className="w-3 h-3" />
          Spin
        </button>
        
        <button
          onClick={() => runAnimation('scale')}
          disabled={isAnimating}
          className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
        >
          <Play className="w-3 h-3" />
          Scale
        </button>
        
        <button
          onClick={() => runAnimation('slide')}
          disabled={isAnimating}
          className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
        >
          <Play className="w-3 h-3" />
          Slide
        </button>
        
        <button
          onClick={runRandomAnimations}
          disabled={isAnimating}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
        >
          <Shuffle className="w-3 h-3" />
          Random
        </button>
      </div>

      {isAnimating && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Animation in progress...
        </div>
      )}
    </div>
  );
}