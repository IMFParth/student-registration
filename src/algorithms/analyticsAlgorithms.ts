/**
 * Advanced Analytics Algorithms
 * Author: Parth Rai
 * 
 * Sophisticated statistical and analytical algorithms for student data:
 * - Statistical analysis with advanced metrics
 * - Clustering algorithms (K-means, DBSCAN)
 * - Correlation analysis
 * - Anomaly detection
 * - Performance trend analysis
 */

import { Student } from '../types';

export class AdvancedAnalyticsEngine {
  
  /**
   * Comprehensive Statistical Analysis
   */
  public calculateStatistics(values: number[]): StatisticalSummary {
    if (values.length === 0) {
      throw new Error('Cannot calculate statistics for empty array');
    }

    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;
    
    // Variance and Standard Deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);
    
    // Median
    const median = n % 2 === 0 
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
      : sorted[Math.floor(n / 2)];
    
    // Quartiles
    const q1 = this.calculatePercentile(sorted, 25);
    const q3 = this.calculatePercentile(sorted, 75);
    const iqr = q3 - q1;
    
    // Skewness (Pearson's moment coefficient)
    const skewness = values.reduce((acc, val) => 
      acc + Math.pow((val - mean) / standardDeviation, 3), 0) / n;
    
    // Kurtosis
    const kurtosis = values.reduce((acc, val) => 
      acc + Math.pow((val - mean) / standardDeviation, 4), 0) / n - 3;
    
    // Mode
    const frequency = new Map<number, number>();
    values.forEach(val => frequency.set(val, (frequency.get(val) || 0) + 1));
    const maxFreq = Math.max(...frequency.values());
    const mode = Array.from(frequency.entries())
      .filter(([, freq]) => freq === maxFreq)
      .map(([val]) => val);

    return {
      count: n,
      sum,
      mean,
      median,
      mode,
      variance,
      standardDeviation,
      min: sorted[0],
      max: sorted[n - 1],
      range: sorted[n - 1] - sorted[0],
      q1,
      q3,
      iqr,
      skewness,
      kurtosis,
      outliers: this.detectOutliers(sorted, q1, q3, iqr)
    };
  }

  private calculatePercentile(sortedArray: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (lower === upper) {
      return sortedArray[lower];
    }
    
    return sortedArray[lower] * (upper - index) + sortedArray[upper] * (index - lower);
  }

  private detectOutliers(sorted: number[], q1: number, q3: number, iqr: number): number[] {
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return sorted.filter(val => val < lowerBound || val > upperBound);
  }

  /**
   * K-Means Clustering Algorithm
   * Time Complexity: O(n * k * i * d) where n=points, k=clusters, i=iterations, d=dimensions
   */
  public kMeansClustering(
    students: Student[], 
    k: number, 
    features: string[],
    maxIterations: number = 100
  ): ClusterResult {
    const points = students.map(student => 
      features.map(feature => this.extractNumericFeature(student, feature))
    );
    
    // Initialize centroids randomly
    let centroids = this.initializeCentroids(points, k);
    let clusters: number[][] = [];
    let assignments: number[] = new Array(points.length);
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const newAssignments = points.map(point => 
        this.findNearestCentroid(point, centroids)
      );
      
      // Check for convergence
      if (this.arraysEqual(assignments, newAssignments)) {
        break;
      }
      
      assignments = newAssignments;
      
      // Update centroids
      const newCentroids = this.updateCentroids(points, assignments, k);
      centroids = newCentroids;
    }
    
    // Group students by cluster
    clusters = Array(k).fill(null).map(() => []);
    assignments.forEach((clusterIndex, studentIndex) => {
      clusters[clusterIndex].push(studentIndex);
    });
    
    return {
      clusters: clusters.map(cluster => cluster.map(index => students[index])),
      centroids,
      assignments,
      inertia: this.calculateInertia(points, centroids, assignments)
    };
  }

  private initializeCentroids(points: number[][], k: number): number[][] {
    const centroids: number[][] = [];
    const dimensions = points[0].length;
    
    for (let i = 0; i < k; i++) {
      const centroid: number[] = [];
      for (let d = 0; d < dimensions; d++) {
        const values = points.map(point => point[d]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        centroid.push(Math.random() * (max - min) + min);
      }
      centroids.push(centroid);
    }
    
    return centroids;
  }

  private findNearestCentroid(point: number[], centroids: number[][]): number {
    let minDistance = Infinity;
    let nearestIndex = 0;
    
    centroids.forEach((centroid, index) => {
      const distance = this.euclideanDistance(point, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });
    
    return nearestIndex;
  }

  private euclideanDistance(point1: number[], point2: number[]): number {
    return Math.sqrt(
      point1.reduce((sum, val, index) => 
        sum + Math.pow(val - point2[index], 2), 0
      )
    );
  }

  private updateCentroids(
    points: number[][], 
    assignments: number[], 
    k: number
  ): number[][] {
    const centroids: number[][] = [];
    const dimensions = points[0].length;
    
    for (let cluster = 0; cluster < k; cluster++) {
      const clusterPoints = points.filter((_, index) => assignments[index] === cluster);
      
      if (clusterPoints.length === 0) {
        // Keep the old centroid if no points assigned
        centroids.push(new Array(dimensions).fill(0));
        continue;
      }
      
      const centroid = new Array(dimensions).fill(0);
      clusterPoints.forEach(point => {
        point.forEach((value, dim) => {
          centroid[dim] += value;
        });
      });
      
      centroid.forEach((sum, dim) => {
        centroid[dim] = sum / clusterPoints.length;
      });
      
      centroids.push(centroid);
    }
    
    return centroids;
  }

  private calculateInertia(
    points: number[][], 
    centroids: number[][], 
    assignments: number[]
  ): number {
    return points.reduce((sum, point, index) => {
      const centroid = centroids[assignments[index]];
      return sum + Math.pow(this.euclideanDistance(point, centroid), 2);
    }, 0);
  }

  /**
   * DBSCAN Clustering Algorithm for anomaly detection
   */
  public dbscanClustering(
    students: Student[], 
    features: string[],
    epsilon: number = 0.5, 
    minPoints: number = 5
  ): DBSCANResult {
    const points = students.map(student => 
      features.map(feature => this.extractNumericFeature(student, feature))
    );
    
    const clusters: number[][] = [];
    const visited = new Set<number>();
    const noise: number[] = [];
    
    points.forEach((point, index) => {
      if (visited.has(index)) return;
      
      visited.add(index);
      const neighbors = this.getNeighbors(points, index, epsilon);
      
      if (neighbors.length < minPoints) {
        noise.push(index);
      } else {
        const cluster: number[] = [];
        this.expandCluster(points, index, neighbors, cluster, visited, epsilon, minPoints);
        clusters.push(cluster);
      }
    });
    
    return {
      clusters: clusters.map(cluster => cluster.map(index => students[index])),
      noise: noise.map(index => students[index]),
      clusterCount: clusters.length
    };
  }

  private getNeighbors(points: number[][], pointIndex: number, epsilon: number): number[] {
    const neighbors: number[] = [];
    const point = points[pointIndex];
    
    points.forEach((otherPoint, index) => {
      if (index !== pointIndex && this.euclideanDistance(point, otherPoint) <= epsilon) {
        neighbors.push(index);
      }
    });
    
    return neighbors;
  }

  private expandCluster(
    points: number[][],
    pointIndex: number,
    neighbors: number[],
    cluster: number[],
    visited: Set<number>,
    epsilon: number,
    minPoints: number
  ): void {
    cluster.push(pointIndex);
    
    for (let i = 0; i < neighbors.length; i++) {
      const neighborIndex = neighbors[i];
      
      if (!visited.has(neighborIndex)) {
        visited.add(neighborIndex);
        const neighborNeighbors = this.getNeighbors(points, neighborIndex, epsilon);
        
        if (neighborNeighbors.length >= minPoints) {
          neighbors.push(...neighborNeighbors);
        }
      }
      
      if (!cluster.includes(neighborIndex)) {
        cluster.push(neighborIndex);
      }
    }
  }

  /**
   * Correlation Analysis using Pearson correlation coefficient
   */
  public calculateCorrelationMatrix(
    students: Student[], 
    features: string[]
  ): CorrelationMatrix {
    const matrix: number[][] = [];
    const featureData = features.map(feature => 
      students.map(student => this.extractNumericFeature(student, feature))
    );
    
    features.forEach((feature1, i) => {
      const row: number[] = [];
      features.forEach((feature2, j) => {
        const correlation = this.pearsonCorrelation(featureData[i], featureData[j]);
        row.push(correlation);
      });
      matrix.push(row);
    });
    
    return {
      matrix,
      features,
      strongCorrelations: this.findStrongCorrelations(matrix, features, 0.7)
    };
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private findStrongCorrelations(
    matrix: number[][], 
    features: string[], 
    threshold: number
  ): Array<{ feature1: string; feature2: string; correlation: number }> {
    const correlations: Array<{ feature1: string; feature2: string; correlation: number }> = [];
    
    for (let i = 0; i < features.length; i++) {
      for (let j = i + 1; j < features.length; j++) {
        const correlation = matrix[i][j];
        if (Math.abs(correlation) >= threshold) {
          correlations.push({
            feature1: features[i],
            feature2: features[j],
            correlation
          });
        }
      }
    }
    
    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }

  private extractNumericFeature(student: Student, feature: string): number {
    const value = (student as any)[feature];
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    if (value instanceof Date) return value.getTime();
    return 0;
  }

  private arraysEqual(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  /**
   * Time Series Analysis for performance trends
   */
  public analyzePerformanceTrends(
    performanceData: Array<{ date: Date; value: number }>
  ): TrendAnalysis {
    const values = performanceData.map(d => d.value);
    const n = values.length;
    
    // Linear regression for trend
    const xValues = performanceData.map((_, index) => index);
    const { slope, intercept, rSquared } = this.linearRegression(xValues, values);
    
    // Moving averages
    const movingAverage7 = this.calculateMovingAverage(values, 7);
    const movingAverage30 = this.calculateMovingAverage(values, 30);
    
    // Seasonal decomposition (simplified)
    const seasonality = this.detectSeasonality(values);
    
    return {
      trend: {
        slope,
        intercept,
        rSquared,
        direction: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable'
      },
      movingAverages: {
        short: movingAverage7,
        long: movingAverage30
      },
      seasonality,
      volatility: this.calculateVolatility(values),
      forecast: this.generateForecast(values, slope, intercept, 5)
    };
  }

  private linearRegression(x: number[], y: number[]): { slope: number; intercept: number; rSquared: number } {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const yMean = sumY / n;
    const totalSumSquares = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const residualSumSquares = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const rSquared = 1 - (residualSumSquares / totalSumSquares);
    
    return { slope, intercept, rSquared };
  }

  private calculateMovingAverage(values: number[], window: number): number[] {
    const result: number[] = [];
    for (let i = window - 1; i < values.length; i++) {
      const sum = values.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
    return result;
  }

  private detectSeasonality(values: number[]): { period: number; strength: number } {
    // Simplified autocorrelation for seasonality detection
    let maxCorrelation = 0;
    let bestPeriod = 1;
    
    for (let period = 2; period <= Math.floor(values.length / 2); period++) {
      const correlation = this.autocorrelation(values, period);
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestPeriod = period;
      }
    }
    
    return { period: bestPeriod, strength: maxCorrelation };
  }

  private autocorrelation(values: number[], lag: number): number {
    const n = values.length - lag;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (values[i] - mean) * (values[i + lag] - mean);
    }
    
    for (let i = 0; i < values.length; i++) {
      denominator += Math.pow(values[i] - mean, 2);
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateVolatility(values: number[]): number {
    const returns = values.slice(1).map((value, i) => 
      (value - values[i]) / values[i]
    );
    const stats = this.calculateStatistics(returns);
    return stats.standardDeviation;
  }

  private generateForecast(
    values: number[], 
    slope: number, 
    intercept: number, 
    periods: number
  ): number[] {
    const forecast: number[] = [];
    const lastIndex = values.length - 1;
    
    for (let i = 1; i <= periods; i++) {
      const predicted = slope * (lastIndex + i) + intercept;
      forecast.push(predicted);
    }
    
    return forecast;
  }
}

// Type definitions
export interface StatisticalSummary {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  standardDeviation: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
  outliers: number[];
}

export interface ClusterResult {
  clusters: Student[][];
  centroids: number[][];
  assignments: number[];
  inertia: number;
}

export interface DBSCANResult {
  clusters: Student[][];
  noise: Student[];
  clusterCount: number;
}

export interface CorrelationMatrix {
  matrix: number[][];
  features: string[];
  strongCorrelations: Array<{
    feature1: string;
    feature2: string;
    correlation: number;
  }>;
}

export interface TrendAnalysis {
  trend: {
    slope: number;
    intercept: number;
    rSquared: number;
    direction: 'increasing' | 'decreasing' | 'stable';
  };
  movingAverages: {
    short: number[];
    long: number[];
  };
  seasonality: {
    period: number;
    strength: number;
  };
  volatility: number;
  forecast: number[];
}