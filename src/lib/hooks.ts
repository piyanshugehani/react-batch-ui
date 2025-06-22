import { useState, useCallback, useRef, useEffect } from 'react';
import { globalScheduler } from './scheduler';
import type { UseBatchStateOptions, AnimationBatchOptions } from '../types';

let operationCounter = 0;

export function useBatchState<T>(
  initialValue: T,
  options: UseBatchStateOptions = {}
): [T, (newValue: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState(initialValue);
  const elementRef = useRef<Element | null>(null);
  const operationIdRef = useRef<string>(`batch-state-${++operationCounter}`);
  const debounceRef = useRef<NodeJS.Timeout>();

  const batchedSetValue = useCallback((newValue: T | ((prev: T) => T)) => {
    const operationId = operationIdRef.current;
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const executeUpdate = () => {
      globalScheduler.schedule({
        id: operationId,
        type: 'state',
        priority: options.priority || 'medium',
        component: options.component,
        timestamp: Date.now(),
        execute: () => {
          setValue(prev => 
            typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue
          );
        }
      });
    };

    if (options.debounce) {
      debounceRef.current = setTimeout(executeUpdate, options.debounce);
    } else {
      executeUpdate();
    }
  }, [options.priority, options.component, options.debounce]);

  return [value, batchedSetValue];
}

export function useBatchAnimation(
  element: Element | null,
  options: AnimationBatchOptions = {}
): (keyframes: Keyframe[], animationOptions?: KeyframeAnimationOptions) => Promise<void> {
  const operationIdRef = useRef<string>(`batch-animation-${++operationCounter}`);

  useEffect(() => {
    if (element) {
      globalScheduler.observeVisibility(element, operationIdRef.current);
    }
    
    return () => {
      globalScheduler.unobserveVisibility(operationIdRef.current);
    };
  }, [element]);

  return useCallback(async (keyframes: Keyframe[], animationOptions?: KeyframeAnimationOptions) => {
    if (!element) return;

    return new Promise<void>((resolve, reject) => {
      globalScheduler.schedule({
        id: `${operationIdRef.current}-${Date.now()}`,
        type: 'animation',
        priority: options.priority || 'medium',
        timestamp: Date.now(),
        execute: () => {
          try {
            const animation = element.animate(keyframes, {
              duration: options.duration || 300,
              easing: options.easing || 'ease-in-out',
              ...animationOptions
            });
            
            animation.addEventListener('finish', () => resolve());
            animation.addEventListener('cancel', () => reject(new Error('Animation cancelled')));
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }, [element, options.duration, options.easing, options.priority]);
}

export function useBatchDOM(): (element: Element, operation: () => void, priority?: 'high' | 'medium' | 'low') => void {
  return useCallback((element: Element, operation: () => void, priority: 'high' | 'medium' | 'low' = 'medium') => {
    const operationId = `batch-dom-${++operationCounter}`;
    
    globalScheduler.schedule({
      id: operationId,
      type: 'dom',
      priority,
      timestamp: Date.now(),
      execute: operation
    });

    globalScheduler.observeVisibility(element, operationId);
  }, []);
}

export function useSchedulerMetrics() {
  const [metrics, setMetrics] = useState(globalScheduler.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(globalScheduler.getMetrics());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}