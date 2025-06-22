export interface BatchOperation {
  id: string;
  type: 'state' | 'dom' | 'animation';
  priority: 'high' | 'medium' | 'low';
  execute: () => void;
  timestamp: number;
  component?: string;
  isVisible?: boolean;
}

export interface BatchSchedulerConfig {
  maxBatchSize: number;
  batchTimeout: number;
  prioritizeVisible: boolean;
  enableDeduplication: boolean;
}

export interface PerformanceMetrics {
  batchCount: number;
  operationsProcessed: number;
  averageBatchSize: number;
  frameTime: number;
  dedupedOperations: number;
}

export interface UseBatchStateOptions {
  priority?: 'high' | 'medium' | 'low';
  component?: string;
  debounce?: number;
}

export interface AnimationBatchOptions {
  duration?: number;
  easing?: string;
  priority?: 'high' | 'medium' | 'low';
}