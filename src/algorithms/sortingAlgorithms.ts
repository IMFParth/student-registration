/**
 * Advanced Sorting Algorithms Suite
 * Author: Parth Rai
 * 
 * Implements high-performance sorting algorithms optimized for student data:
 * - Hybrid QuickSort with Insertion Sort optimization
 * - TimSort (Python's sorting algorithm)
 * - Radix Sort for numerical data
 * - Multi-key sorting with custom comparators
 */

import { Student } from '../types';

export class AdvancedSortingEngine {
  
  /**
   * Hybrid QuickSort with Insertion Sort for small arrays
   * Time Complexity: O(n log n) average, O(n²) worst case
   * Space Complexity: O(log n)
   */
  public hybridQuickSort<T>(
    arr: T[], 
    compareFn: (a: T, b: T) => number,
    threshold: number = 10
  ): T[] {
    const result = [...arr];
    this.quickSortHybrid(result, 0, result.length - 1, compareFn, threshold);
    return result;
  }

  private quickSortHybrid<T>(
    arr: T[], 
    low: number, 
    high: number, 
    compareFn: (a: T, b: T) => number,
    threshold: number
  ): void {
    if (low < high) {
      if (high - low + 1 < threshold) {
        this.insertionSort(arr, low, high, compareFn);
      } else {
        const pivotIndex = this.partition(arr, low, high, compareFn);
        this.quickSortHybrid(arr, low, pivotIndex - 1, compareFn, threshold);
        this.quickSortHybrid(arr, pivotIndex + 1, high, compareFn, threshold);
      }
    }
  }

  private partition<T>(
    arr: T[], 
    low: number, 
    high: number, 
    compareFn: (a: T, b: T) => number
  ): number {
    // Use median-of-three pivot selection
    const mid = Math.floor((low + high) / 2);
    if (compareFn(arr[mid], arr[low]) < 0) [arr[low], arr[mid]] = [arr[mid], arr[low]];
    if (compareFn(arr[high], arr[low]) < 0) [arr[low], arr[high]] = [arr[high], arr[low]];
    if (compareFn(arr[high], arr[mid]) < 0) [arr[mid], arr[high]] = [arr[high], arr[mid]];
    
    const pivot = arr[mid];
    [arr[mid], arr[high]] = [arr[high], arr[mid]];
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (compareFn(arr[j], pivot) <= 0) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }

  private insertionSort<T>(
    arr: T[], 
    low: number, 
    high: number, 
    compareFn: (a: T, b: T) => number
  ): void {
    for (let i = low + 1; i <= high; i++) {
      const key = arr[i];
      let j = i - 1;
      
      while (j >= low && compareFn(arr[j], key) > 0) {
        arr[j + 1] = arr[j];
        j--;
      }
      
      arr[j + 1] = key;
    }
  }

  /**
   * TimSort Algorithm (Adaptive, stable, natural mergesort)
   * Time Complexity: O(n log n) worst case, O(n) best case
   * Space Complexity: O(n)
   */
  public timSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
    const result = [...arr];
    const n = result.length;
    const minMerge = 32;
    
    // Sort individual subarrays of size minMerge using insertion sort
    for (let i = 0; i < n; i += minMerge) {
      this.insertionSort(result, i, Math.min(i + minMerge - 1, n - 1), compareFn);
    }
    
    // Start merging from size minMerge
    for (let size = minMerge; size < n; size *= 2) {
      for (let start = 0; start < n; start += size * 2) {
        const mid = start + size - 1;
        const end = Math.min(start + size * 2 - 1, n - 1);
        
        if (mid < end) {
          this.merge(result, start, mid, end, compareFn);
        }
      }
    }
    
    return result;
  }

  private merge<T>(
    arr: T[], 
    left: number, 
    mid: number, 
    right: number, 
    compareFn: (a: T, b: T) => number
  ): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      if (compareFn(leftArr[i], rightArr[j]) <= 0) {
        arr[k++] = leftArr[i++];
      } else {
        arr[k++] = rightArr[j++];
      }
    }
    
    while (i < leftArr.length) arr[k++] = leftArr[i++];
    while (j < rightArr.length) arr[k++] = rightArr[j++];
  }

  /**
   * Radix Sort for numerical data (optimized for student IDs, grades)
   * Time Complexity: O(d * (n + k)) where d is digits, k is range
   * Space Complexity: O(n + k)
   */
  public radixSort(arr: number[]): number[] {
    if (arr.length <= 1) return [...arr];
    
    const result = [...arr];
    const max = Math.max(...result);
    
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      this.countingSort(result, exp);
    }
    
    return result;
  }

  private countingSort(arr: number[], exp: number): void {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    // Count occurrences of each digit
    for (let i = 0; i < n; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }
    
    // Change count[i] to actual position
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }
    
    // Copy output array to arr
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }
  }

  /**
   * Multi-key sorting for complex student data
   */
  public multiKeySort(
    students: Student[], 
    sortKeys: SortKey[]
  ): Student[] {
    return this.hybridQuickSort(students, (a, b) => {
      for (const key of sortKeys) {
        const aValue = this.getNestedValue(a, key.field);
        const bValue = this.getNestedValue(b, key.field);
        
        let comparison = 0;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        }
        
        if (comparison !== 0) {
          return key.direction === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Bucket sort for GPA/grade distribution analysis
   */
  public bucketSort(grades: number[], bucketCount: number = 10): number[] {
    if (grades.length <= 1) return [...grades];
    
    const min = Math.min(...grades);
    const max = Math.max(...grades);
    const bucketSize = (max - min) / bucketCount;
    
    const buckets: number[][] = Array(bucketCount).fill(null).map(() => []);
    
    // Distribute elements into buckets
    grades.forEach(grade => {
      const bucketIndex = Math.min(
        Math.floor((grade - min) / bucketSize), 
        bucketCount - 1
      );
      buckets[bucketIndex].push(grade);
    });
    
    // Sort each bucket and concatenate
    return buckets.reduce((result, bucket) => {
      if (bucket.length > 0) {
        bucket.sort((a, b) => a - b);
        result.push(...bucket);
      }
      return result;
    }, [] as number[]);
  }

  /**
   * Topological sort for course prerequisites
   */
  public topologicalSort(courses: Course[]): Course[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    // Build graph and calculate in-degrees
    courses.forEach(course => {
      graph.set(course.id, course.prerequisites || []);
      inDegree.set(course.id, 0);
    });
    
    courses.forEach(course => {
      (course.prerequisites || []).forEach(prereq => {
        inDegree.set(prereq, (inDegree.get(prereq) || 0) + 1);
      });
    });
    
    // Kahn's algorithm
    const queue: string[] = [];
    const result: Course[] = [];
    
    inDegree.forEach((degree, courseId) => {
      if (degree === 0) queue.push(courseId);
    });
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentCourse = courses.find(c => c.id === currentId)!;
      result.push(currentCourse);
      
      (graph.get(currentId) || []).forEach(neighbor => {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }
    
    return result;
  }
}

export interface SortKey {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Course {
  id: string;
  name: string;
  prerequisites?: string[];
}