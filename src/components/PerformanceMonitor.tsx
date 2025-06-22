import React from 'react';
import { Activity, Zap, Target, Clock } from 'lucide-react';
import { useSchedulerMetrics } from '../lib/hooks';

interface PerformanceMonitorProps {
  className?: string;
}

export function PerformanceMonitor({ className = '' }: PerformanceMonitorProps) {
  const metrics = useSchedulerMetrics();

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <div className={`bg-slate-900 text-white p-6 rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold">Performance Monitor</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Batches</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {formatNumber(metrics.batchCount)}
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Operations</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {formatNumber(metrics.operationsProcessed)}
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Frame Time</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {formatNumber(metrics.frameTime)}ms
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Avg Batch</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {formatNumber(metrics.averageBatchSize)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Deduped Operations:</span>
          <span className="text-red-400 font-medium">
            {formatNumber(metrics.dedupedOperations)}
          </span>
        </div>
      </div>
    </div>
  );
}