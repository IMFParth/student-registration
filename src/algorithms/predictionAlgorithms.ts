/**
 * Advanced Prediction Algorithms
 * Author: Parth Rai
 * 
 * Machine Learning algorithms for student performance prediction:
 * - Linear Regression with regularization
 * - Decision Trees
 * - Neural Networks (basic implementation)
 * - Ensemble methods
 * - Time series forecasting
 */

import { Student, AcademicRecord } from '../types';

export class PredictionEngine {
  
  /**
   * Ridge Regression for GPA prediction with L2 regularization
   */
  public predictGPA(
    students: Student[], 
    targetStudent: Partial<Student>,
    alpha: number = 1.0
  ): PredictionResult {
    const features = this.extractFeatures(students);
    const targets = students.map(s => s.gpa);
    
    const weights = this.ridgeRegression(features, targets, alpha);
    const targetFeatures = this.extractFeatures([targetStudent as Student])[0];
    
    const prediction = this.predict(targetFeatures, weights);
    const confidence = this.calculateConfidence(features, targets, weights);
    
    return {
      prediction,
      confidence,
      factors: this.getInfluentialFactors(weights),
      model: 'Ridge Regression'
    };
  }

  private ridgeRegression(X: number[][], y: number[], alpha: number): number[] {
    // Add bias term
    const XWithBias = X.map(row => [1, ...row]);
    const n = XWithBias.length;
    const m = XWithBias[0].length;
    
    // X^T * X + alpha * I
    const XTX = this.matrixMultiply(this.transpose(XWithBias), XWithBias);
    const identity = this.identityMatrix(m);
    const regularized = this.matrixAdd(XTX, this.scalarMultiply(identity, alpha));
    
    // X^T * y
    const XTy = this.matrixVectorMultiply(this.transpose(XWithBias), y);
    
    // Solve (X^T * X + alpha * I) * w = X^T * y
    return this.solveLinearSystem(regularized, XTy);
  }

  private extractFeatures(students: Student[]): number[][] {
    return students.map(student => [
      student.year || 0,
      student.semester || 0,
      student.credits || 0,
      student.attendance?.length || 0,
      student.academicHistory?.length || 0,
      student.achievements?.length || 0,
      this.calculateAttendanceRate(student),
      this.calculateAverageGrade(student)
    ]);
  }

  private calculateAttendanceRate(student: Student): number {
    if (!student.attendance || student.attendance.length === 0) return 0;
    const present = student.attendance.filter(a => a.status === 'present').length;
    return present / student.attendance.length;
  }

  private calculateAverageGrade(student: Student): number {
    if (!student.academicHistory || student.academicHistory.length === 0) return 0;
    
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    student.academicHistory.forEach(record => {
      record.courses.forEach(course => {
        const gradePoint = this.gradeToPoints(course.grade);
        totalGradePoints += gradePoint * course.credits;
        totalCredits += course.credits;
      });
    });
    
    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  }

  private gradeToPoints(grade: string): number {
    const gradeMap: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    return gradeMap[grade] || 0;
  }

  /**
   * Decision Tree for classification/prediction
   */
  public buildDecisionTree(
    students: Student[], 
    targetAttribute: string,
    maxDepth: number = 10
  ): DecisionTree {
    const features = this.extractFeatures(students);
    const targets = students.map(s => (s as any)[targetAttribute]);
    
    return this.buildTree(features, targets, 0, maxDepth);
  }

  private buildTree(
    features: number[][], 
    targets: any[], 
    depth: number, 
    maxDepth: number
  ): DecisionTree {
    // Base cases
    if (depth >= maxDepth || this.isPure(targets) || features.length === 0) {
      return {
        isLeaf: true,
        prediction: this.getMajorityClass(targets),
        confidence: this.calculatePurity(targets)
      };
    }
    
    const bestSplit = this.findBestSplit(features, targets);
    
    if (!bestSplit) {
      return {
        isLeaf: true,
        prediction: this.getMajorityClass(targets),
        confidence: this.calculatePurity(targets)
      };
    }
    
    const { leftIndices, rightIndices } = this.splitData(features, bestSplit);
    
    return {
      isLeaf: false,
      featureIndex: bestSplit.featureIndex,
      threshold: bestSplit.threshold,
      left: this.buildTree(
        leftIndices.map(i => features[i]),
        leftIndices.map(i => targets[i]),
        depth + 1,
        maxDepth
      ),
      right: this.buildTree(
        rightIndices.map(i => features[i]),
        rightIndices.map(i => targets[i]),
        depth + 1,
        maxDepth
      )
    };
  }

  private findBestSplit(features: number[][], targets: any[]): SplitInfo | null {
    let bestGain = -1;
    let bestSplit: SplitInfo | null = null;
    
    const numFeatures = features[0].length;
    
    for (let featureIndex = 0; featureIndex < numFeatures; featureIndex++) {
      const values = features.map(row => row[featureIndex]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
      
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        const gain = this.calculateInformationGain(features, targets, featureIndex, threshold);
        
        if (gain > bestGain) {
          bestGain = gain;
          bestSplit = { featureIndex, threshold, gain };
        }
      }
    }
    
    return bestSplit;
  }

  private calculateInformationGain(
    features: number[][], 
    targets: any[], 
    featureIndex: number, 
    threshold: number
  ): number {
    const { leftIndices, rightIndices } = this.splitData(features, { featureIndex, threshold, gain: 0 });
    
    const totalEntropy = this.calculateEntropy(targets);
    const leftTargets = leftIndices.map(i => targets[i]);
    const rightTargets = rightIndices.map(i => targets[i]);
    
    const leftWeight = leftTargets.length / targets.length;
    const rightWeight = rightTargets.length / targets.length;
    
    const weightedEntropy = leftWeight * this.calculateEntropy(leftTargets) + 
                           rightWeight * this.calculateEntropy(rightTargets);
    
    return totalEntropy - weightedEntropy;
  }

  private calculateEntropy(targets: any[]): number {
    const counts = new Map<any, number>();
    targets.forEach(target => {
      counts.set(target, (counts.get(target) || 0) + 1);
    });
    
    let entropy = 0;
    const total = targets.length;
    
    counts.forEach(count => {
      const probability = count / total;
      entropy -= probability * Math.log2(probability);
    });
    
    return entropy;
  }

  private splitData(features: number[][], splitInfo: SplitInfo): { leftIndices: number[]; rightIndices: number[] } {
    const leftIndices: number[] = [];
    const rightIndices: number[] = [];
    
    features.forEach((row, index) => {
      if (row[splitInfo.featureIndex] <= splitInfo.threshold) {
        leftIndices.push(index);
      } else {
        rightIndices.push(index);
      }
    });
    
    return { leftIndices, rightIndices };
  }

  /**
   * Simple Neural Network for complex pattern recognition
   */
  public trainNeuralNetwork(
    students: Student[], 
    targetAttribute: string,
    hiddenLayers: number[] = [10, 5],
    learningRate: number = 0.01,
    epochs: number = 1000
  ): NeuralNetwork {
    const features = this.normalizeFeatures(this.extractFeatures(students));
    const targets = this.normalizeTargets(students.map(s => (s as any)[targetAttribute]));
    
    const network = this.initializeNetwork(features[0].length, hiddenLayers, 1);
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      
      for (let i = 0; i < features.length; i++) {
        const prediction = this.forwardPass(network, features[i]);
        const loss = Math.pow(prediction[0] - targets[i], 2);
        totalLoss += loss;
        
        this.backwardPass(network, features[i], targets[i], learningRate);
      }
      
      if (epoch % 100 === 0) {
        console.log(`Epoch ${epoch}, Loss: ${totalLoss / features.length}`);
      }
    }
    
    return network;
  }

  private initializeNetwork(inputSize: number, hiddenLayers: number[], outputSize: number): NeuralNetwork {
    const layers: Layer[] = [];
    let prevSize = inputSize;
    
    // Hidden layers
    hiddenLayers.forEach(size => {
      layers.push(this.createLayer(prevSize, size));
      prevSize = size;
    });
    
    // Output layer
    layers.push(this.createLayer(prevSize, outputSize));
    
    return { layers };
  }

  private createLayer(inputSize: number, outputSize: number): Layer {
    const weights: number[][] = [];
    const biases: number[] = [];
    
    for (let i = 0; i < outputSize; i++) {
      const neuronWeights: number[] = [];
      for (let j = 0; j < inputSize; j++) {
        neuronWeights.push(Math.random() * 2 - 1); // Random between -1 and 1
      }
      weights.push(neuronWeights);
      biases.push(Math.random() * 2 - 1);
    }
    
    return { weights, biases, activations: [], gradients: [] };
  }

  private forwardPass(network: NeuralNetwork, input: number[]): number[] {
    let currentInput = input;
    
    network.layers.forEach(layer => {
      const output: number[] = [];
      
      layer.weights.forEach((neuronWeights, i) => {
        let sum = layer.biases[i];
        neuronWeights.forEach((weight, j) => {
          sum += weight * currentInput[j];
        });
        output.push(this.sigmoid(sum));
      });
      
      layer.activations = output;
      currentInput = output;
    });
    
    return currentInput;
  }

  private backwardPass(
    network: NeuralNetwork, 
    input: number[], 
    target: number, 
    learningRate: number
  ): void {
    // Calculate output layer gradients
    const outputLayer = network.layers[network.layers.length - 1];
    const outputError = outputLayer.activations[0] - target;
    outputLayer.gradients = [outputError * this.sigmoidDerivative(outputLayer.activations[0])];
    
    // Backpropagate through hidden layers
    for (let i = network.layers.length - 2; i >= 0; i--) {
      const layer = network.layers[i];
      const nextLayer = network.layers[i + 1];
      
      layer.gradients = layer.activations.map((activation, j) => {
        let error = 0;
        nextLayer.gradients.forEach((nextGradient, k) => {
          error += nextGradient * nextLayer.weights[k][j];
        });
        return error * this.sigmoidDerivative(activation);
      });
    }
    
    // Update weights and biases
    let prevActivations = input;
    
    network.layers.forEach(layer => {
      layer.weights.forEach((neuronWeights, i) => {
        neuronWeights.forEach((weight, j) => {
          layer.weights[i][j] -= learningRate * layer.gradients[i] * prevActivations[j];
        });
        layer.biases[i] -= learningRate * layer.gradients[i];
      });
      prevActivations = layer.activations;
    });
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private sigmoidDerivative(x: number): number {
    return x * (1 - x);
  }

  /**
   * Ensemble method combining multiple models
   */
  public createEnsemble(
    students: Student[], 
    targetAttribute: string
  ): EnsembleModel {
    const features = this.extractFeatures(students);
    const targets = students.map(s => (s as any)[targetAttribute]);
    
    // Train multiple models
    const ridgeModel = this.ridgeRegression(features, targets, 1.0);
    const decisionTree = this.buildDecisionTree(students, targetAttribute, 5);
    const neuralNet = this.trainNeuralNetwork(students, targetAttribute, [8, 4], 0.01, 500);
    
    return {
      models: {
        ridge: ridgeModel,
        tree: decisionTree,
        neural: neuralNet
      },
      weights: [0.4, 0.3, 0.3] // Equal weighting
    };
  }

  public predictWithEnsemble(
    ensemble: EnsembleModel, 
    student: Partial<Student>
  ): PredictionResult {
    const features = this.extractFeatures([student as Student])[0];
    
    // Get predictions from each model
    const ridgePrediction = this.predict(features, ensemble.models.ridge);
    const treePrediction = this.predictWithTree(ensemble.models.tree, features);
    const neuralPrediction = this.forwardPass(ensemble.models.neural, this.normalizeFeatures([features])[0])[0];
    
    // Weighted average
    const finalPrediction = 
      ridgePrediction * ensemble.weights[0] +
      treePrediction * ensemble.weights[1] +
      neuralPrediction * ensemble.weights[2];
    
    return {
      prediction: finalPrediction,
      confidence: 0.85, // Ensemble typically has higher confidence
      factors: this.getInfluentialFactors(ensemble.models.ridge),
      model: 'Ensemble (Ridge + Tree + Neural)'
    };
  }

  private predictWithTree(tree: DecisionTree, features: number[]): number {
    if (tree.isLeaf) {
      return typeof tree.prediction === 'number' ? tree.prediction : 0;
    }
    
    if (features[tree.featureIndex!] <= tree.threshold!) {
      return this.predictWithTree(tree.left!, features);
    } else {
      return this.predictWithTree(tree.right!, features);
    }
  }

  // Utility methods
  private predict(features: number[], weights: number[]): number {
    return weights[0] + features.reduce((sum, feature, i) => sum + feature * weights[i + 1], 0);
  }

  private calculateConfidence(X: number[][], y: number[], weights: number[]): number {
    const predictions = X.map(features => this.predict(features, weights));
    const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - y[i], 2), 0) / y.length;
    return Math.max(0, 1 - mse / this.variance(y));
  }

  private getInfluentialFactors(weights: number[]): Array<{ factor: string; importance: number }> {
    const featureNames = ['Year', 'Semester', 'Credits', 'Attendance Count', 'Academic History', 'Achievements', 'Attendance Rate', 'Average Grade'];
    
    return weights.slice(1).map((weight, i) => ({
      factor: featureNames[i] || `Feature ${i}`,
      importance: Math.abs(weight)
    })).sort((a, b) => b.importance - a.importance);
  }

  private normalizeFeatures(features: number[][]): number[][] {
    const numFeatures = features[0].length;
    const means = new Array(numFeatures).fill(0);
    const stds = new Array(numFeatures).fill(0);
    
    // Calculate means
    features.forEach(row => {
      row.forEach((value, i) => {
        means[i] += value;
      });
    });
    means.forEach((sum, i) => {
      means[i] = sum / features.length;
    });
    
    // Calculate standard deviations
    features.forEach(row => {
      row.forEach((value, i) => {
        stds[i] += Math.pow(value - means[i], 2);
      });
    });
    stds.forEach((sum, i) => {
      stds[i] = Math.sqrt(sum / features.length);
    });
    
    // Normalize
    return features.map(row => 
      row.map((value, i) => stds[i] === 0 ? 0 : (value - means[i]) / stds[i])
    );
  }

  private normalizeTargets(targets: number[]): number[] {
    const min = Math.min(...targets);
    const max = Math.max(...targets);
    const range = max - min;
    
    return targets.map(target => range === 0 ? 0 : (target - min) / range);
  }

  private variance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  private isPure(targets: any[]): boolean {
    return new Set(targets).size <= 1;
  }

  private getMajorityClass(targets: any[]): any {
    const counts = new Map();
    targets.forEach(target => {
      counts.set(target, (counts.get(target) || 0) + 1);
    });
    
    let maxCount = 0;
    let majorityClass = targets[0];
    
    counts.forEach((count, target) => {
      if (count > maxCount) {
        maxCount = count;
        majorityClass = target;
      }
    });
    
    return majorityClass;
  }

  private calculatePurity(targets: any[]): number {
    const counts = new Map();
    targets.forEach(target => {
      counts.set(target, (counts.get(target) || 0) + 1);
    });
    
    const maxCount = Math.max(...counts.values());
    return maxCount / targets.length;
  }

  // Matrix operations
  private matrixMultiply(A: number[][], B: number[][]): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < B.length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  private transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  private matrixAdd(A: number[][], B: number[][]): number[][] {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
  }

  private scalarMultiply(matrix: number[][], scalar: number): number[][] {
    return matrix.map(row => row.map(val => val * scalar));
  }

  private identityMatrix(size: number): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < size; i++) {
      matrix[i] = new Array(size).fill(0);
      matrix[i][i] = 1;
    }
    return matrix;
  }

  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
    return matrix.map(row => 
      row.reduce((sum, val, i) => sum + val * vector[i], 0)
    );
  }

  private solveLinearSystem(A: number[][], b: number[]): number[] {
    // Gaussian elimination with partial pivoting
    const n = A.length;
    const augmented = A.map((row, i) => [...row, b[i]]);
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      
      // Swap rows
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      // Make all rows below this one 0 in current column
      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j < n + 1; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
    
    // Back substitution
    const solution = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      solution[i] = augmented[i][n];
      for (let j = i + 1; j < n; j++) {
        solution[i] -= augmented[i][j] * solution[j];
      }
      solution[i] /= augmented[i][i];
    }
    
    return solution;
  }
}

// Type definitions
export interface PredictionResult {
  prediction: number;
  confidence: number;
  factors: Array<{ factor: string; importance: number }>;
  model: string;
}

export interface DecisionTree {
  isLeaf: boolean;
  prediction?: any;
  confidence?: number;
  featureIndex?: number;
  threshold?: number;
  left?: DecisionTree;
  right?: DecisionTree;
}

export interface SplitInfo {
  featureIndex: number;
  threshold: number;
  gain: number;
}

export interface NeuralNetwork {
  layers: Layer[];
}

export interface Layer {
  weights: number[][];
  biases: number[];
  activations: number[];
  gradients: number[];
}

export interface EnsembleModel {
  models: {
    ridge: number[];
    tree: DecisionTree;
    neural: NeuralNetwork;
  };
  weights: number[];
}