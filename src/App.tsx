import React from 'react';
import { Cpu, Zap, Target, Timer } from 'lucide-react';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { BatchedCounter } from './components/BatchedCounter';
import { AnimationDemo } from './components/AnimationDemo';
import { StressTest } from './components/StressTest';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">React Batch UI</h1>
              <p className="text-sm text-gray-600">Smart UI Mutation Scheduler - DOM + State + Animation Coalescer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl mb-8 shadow-lg">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">🧠 Concurrent React, but actually usable.</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Smart Batching</h3>
                  <p className="text-blue-100 text-sm">Batches setStates, DOM reads, and animations into single frames</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-green-300 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Priority System</h3>
                  <p className="text-blue-100 text-sm">Auto-prioritizes visible updates for better UX</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Timer className="w-6 h-6 text-pink-300 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Performance</h3>
                  <p className="text-blue-100 text-sm">Reduces layout thrashing and improves battery life</p>
                </div>
              </div>
            </div>
            <p className="text-blue-100">
              Think of it as <code className="bg-blue-500 px-2 py-1 rounded">requestIdleCallback()</code> for your entire React UI.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Counters */}
          <div className="space-y-6">
            <BatchedCounter title="High Priority" priority="high" />
            <BatchedCounter title="Medium Priority" priority="medium" />
            <BatchedCounter title="Low Priority" priority="low" />
          </div>

          {/* Middle Column - Demos */}
          <div className="space-y-6">
            <AnimationDemo />
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <p><strong>Batch Operations:</strong> Multiple state updates are collected and executed together</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <p><strong>Priority Scheduling:</strong> Visible and high-priority updates are processed first</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <p><strong>Deduplication:</strong> Redundant operations are automatically merged</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <p><strong>Frame Coordination:</strong> All updates happen within requestAnimationFrame</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Performance */}
          <div className="space-y-6">
            <PerformanceMonitor />
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage Example</h3>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
{`import { useBatchState } from 'react-batch-ui';

function MyComponent() {
  const [count, setCount] = useBatchState(0, {
    priority: 'high',
    component: 'MyComponent'
  });

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Stress Test Section */}
        <div className="mt-8">
          <StressTest />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            React Batch UI - Smart UI Mutation Scheduler for Production Apps
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Built with React 18 • TypeScript • Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;