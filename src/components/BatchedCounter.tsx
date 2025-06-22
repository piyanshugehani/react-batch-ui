import React, { useRef, useEffect } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useBatchState, useBatchAnimation } from '../lib/hooks';

interface BatchedCounterProps {
  title: string;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
}

export function BatchedCounter({ 
  title, 
  priority = 'medium', 
  className = '' 
}: BatchedCounterProps) {
  const [count, setCount] = useBatchState(0, { 
    priority, 
    component: title,
    debounce: priority === 'low' ? 100 : 0
  });
  
  const counterRef = useRef<HTMLDivElement>(null);
  const animate = useBatchAnimation(counterRef.current, { 
    priority,
    duration: 200 
  });

  useEffect(() => {
    if (counterRef.current && count !== 0) {
      animate([
        { transform: 'scale(1)', color: '#374151' },
        { transform: 'scale(1.1)', color: count > 0 ? '#059669' : '#dc2626' },
        { transform: 'scale(1)', color: '#374151' }
      ]);
    }
  }, [count, animate]);

  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-blue-200 bg-blue-50',
    low: 'border-green-200 bg-green-50'
  };

  const priorityButtonColors = {
    high: 'bg-red-500 hover:bg-red-600 text-white',
    medium: 'bg-blue-500 hover:bg-blue-600 text-white',
    low: 'bg-green-500 hover:bg-green-600 text-white'
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${priorityColors[priority]} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          priority === 'high' ? 'bg-red-100 text-red-800' :
          priority === 'medium' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {priority.toUpperCase()}
        </span>
      </div>

      <div 
        ref={counterRef}
        className="text-4xl font-bold text-center py-8 text-gray-700"
      >
        {count}
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setCount(c => c - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${priorityButtonColors[priority]}`}
        >
          <Minus className="w-4 h-4" />
          Decrease
        </button>
        
        <button
          onClick={() => setCount(0)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        
        <button
          onClick={() => setCount(c => c + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${priorityButtonColors[priority]}`}
        >
          <Plus className="w-4 h-4" />
          Increase
        </button>
      </div>
    </div>
  );
}