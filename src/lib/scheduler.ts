import type { BatchOperation, BatchSchedulerConfig, PerformanceMetrics } from '../types';

export class BatchScheduler {
  private operations: Map<string, BatchOperation> = new Map();
  private rafId: number | null = null;
  private config: BatchSchedulerConfig;
  private metrics: PerformanceMetrics = {
    batchCount: 0,
    operationsProcessed: 0,
    averageBatchSize: 0,
    frameTime: 0,
    dedupedOperations: 0
  };
  private observers: Map<string, IntersectionObserver> = new Map();

  constructor(config: Partial<BatchSchedulerConfig> = {}) {
    this.config = {
      maxBatchSize: 50,
      batchTimeout: 16, // ~60fps
      prioritizeVisible: true,
      enableDeduplication: true,
      ...config
    };
  }

  schedule(operation: BatchOperation): void {
    const existingOperation = this.operations.get(operation.id);
    
    if (existingOperation && this.config.enableDeduplication) {
      // Dedupe: keep the latest operation
      this.metrics.dedupedOperations++;
      this.operations.set(operation.id, {
        ...operation,
        timestamp: Date.now()
      });
    } else {
      this.operations.set(operation.id, operation);
    }

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => this.processBatch());
    }
  }

  private processBatch(): void {
    const startTime = performance.now();
    const operations = Array.from(this.operations.values());
    
    if (operations.length === 0) {
      this.rafId = null;
      return;
    }

    // Sort by priority and visibility
    const sortedOperations = this.sortOperations(operations);
    
    // Process operations in batches
    const batchSize = Math.min(this.config.maxBatchSize, sortedOperations.length);
    const batch = sortedOperations.slice(0, batchSize);

    // Execute batch
    batch.forEach(operation => {
      try {
        operation.execute();
        this.operations.delete(operation.id);
      } catch (error) {
        console.warn('BatchScheduler: Operation failed', error);
        this.operations.delete(operation.id);
      }
    });

    // Update metrics
    const endTime = performance.now();
    this.updateMetrics(batch.length, endTime - startTime);

    // Schedule next batch if operations remain
    if (this.operations.size > 0) {
      this.rafId = requestAnimationFrame(() => this.processBatch());
    } else {
      this.rafId = null;
    }
  }

  private sortOperations(operations: BatchOperation[]): BatchOperation[] {
    return operations.sort((a, b) => {
      // Priority order: high > medium > low
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Visible operations first if enabled
      if (this.config.prioritizeVisible) {
        if (a.isVisible && !b.isVisible) return -1;
        if (!a.isVisible && b.isVisible) return 1;
      }
      
      // Older operations first
      return a.timestamp - b.timestamp;
    });
  }

  private updateMetrics(batchSize: number, frameTime: number): void {
    this.metrics.batchCount++;
    this.metrics.operationsProcessed += batchSize;
    this.metrics.averageBatchSize = this.metrics.operationsProcessed / this.metrics.batchCount;
    this.metrics.frameTime = frameTime;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  clear(): void {
    this.operations.clear();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  observeVisibility(element: Element, operationId: string): void {
    if (!this.config.prioritizeVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const operation = this.operations.get(operationId);
          if (operation) {
            operation.isVisible = entry.isIntersecting;
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    this.observers.set(operationId, observer);
  }

  unobserveVisibility(operationId: string): void {
    const observer = this.observers.get(operationId);
    if (observer) {
      observer.disconnect();
      this.observers.delete(operationId);
    }
  }
}

// Global scheduler instance
export const globalScheduler = new BatchScheduler();