import React, { useState, useRef } from 'react';
import { Zap, Square, Play } from 'lucide-react';
import { useBatchState } from '../lib/hooks';

interface StressTestItemProps {
  id: number;
  onUpdate: () => void;
}

function StressTestItem({ id, onUpdate }: StressTestItemProps) {
  const [value, setValue] = useBatchState(0, { 
    priority: 'low',
    component: `stress-item-${id}`,
    debounce: 50
  });

  const increment = () => {
    setValue(v => v + 1);
    onUpdate();
  };

  return (
    <div className="bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="text-sm text-gray-600 mb-1">Item #{id}</div>
      <div className="text-xl font-bold text-blue-600 mb-2">{value}</div>
      <button
        onClick={increment}
        className="w-full px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
      >
        +1
      </button>
    </div>
  );
}

export function StressTest() {
  const [itemCount, setItemCount] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const handleUpdate = () => {
    setUpdateCount(c => c + 1);
  };

  const startStressTest = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setUpdateCount(0);
    
    intervalRef.current = setInterval(() => {
      // Randomly trigger updates on multiple items
      const itemsToUpdate = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i < itemsToUpdate; i++) {
        const randomItem = document.querySelector(`[data-stress-item="${Math.floor(Math.random() * itemCount)}"] button`) as HTMLButtonElement;
        if (randomItem) {
          randomItem.click();
        }
      }
    }, 100);

    // Auto-stop after 10 seconds
    setTimeout(() => {
      stopStressTest();
    }, 10000);
  };

  const stopStressTest = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const items = Array.from({ length: itemCount }, (_, i) => i);

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500" />
        Stress Test - Batched Updates
      </h3>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Items:</label>
          <select
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
            disabled={isRunning}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <button
          onClick={isRunning ? stopStressTest : startStressTest}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Stop Test' : 'Start Test'}
        </button>

        <div className="text-sm text-gray-600">
          Updates: <span className="font-semibold text-blue-600">{updateCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 max-h-96 overflow-y-auto">
        {items.map(id => (
          <div key={id} data-stress-item={id}>
            <StressTestItem id={id} onUpdate={handleUpdate} />
          </div>
        ))}
      </div>

      {isRunning && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Stress test running... (auto-stops in 10s)
        </div>
      )}
    </div>
  );
}