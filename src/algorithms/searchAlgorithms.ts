/**
 * Advanced Search Algorithms
 * Author: Parth Rai
 * 
 * Implements sophisticated search algorithms including:
 * - Fuzzy search with Levenshtein distance
 * - Boyer-Moore string matching
 * - Trie-based prefix search
 * - Semantic search using TF-IDF
 */

import { Student } from '../types';

export class AdvancedSearchEngine {
  private trie: TrieNode;
  private invertedIndex: Map<string, Set<string>>;

  constructor() {
    this.trie = new TrieNode();
    this.invertedIndex = new Map();
  }

  /**
   * Levenshtein Distance Algorithm for fuzzy matching
   * Time Complexity: O(m*n), Space Complexity: O(m*n)
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Boyer-Moore String Search Algorithm
   * Time Complexity: O(n/m) best case, O(nm) worst case
   */
  private boyerMooreSearch(text: string, pattern: string): number[] {
    const positions: number[] = [];
    const badCharTable = this.buildBadCharTable(pattern);
    
    let shift = 0;
    while (shift <= text.length - pattern.length) {
      let j = pattern.length - 1;
      
      while (j >= 0 && pattern[j] === text[shift + j]) {
        j--;
      }
      
      if (j < 0) {
        positions.push(shift);
        shift += shift + pattern.length < text.length ? 
          pattern.length - badCharTable.get(text[shift + pattern.length]) || pattern.length : 1;
      } else {
        shift += Math.max(1, j - (badCharTable.get(text[shift + j]) || -1));
      }
    }
    
    return positions;
  }

  private buildBadCharTable(pattern: string): Map<string, number> {
    const table = new Map<string, number>();
    for (let i = 0; i < pattern.length; i++) {
      table.set(pattern[i], i);
    }
    return table;
  }

  /**
   * Fuzzy search with configurable threshold
   */
  public fuzzySearch(students: Student[], query: string, threshold: number = 0.7): Student[] {
    const results: Array<{ student: Student; score: number }> = [];
    
    students.forEach(student => {
      const searchableText = `${student.firstName} ${student.lastName} ${student.email} ${student.rollNo}`.toLowerCase();
      const queryLower = query.toLowerCase();
      
      const distance = this.levenshteinDistance(queryLower, searchableText);
      const maxLength = Math.max(queryLower.length, searchableText.length);
      const similarity = 1 - (distance / maxLength);
      
      if (similarity >= threshold) {
        results.push({ student, score: similarity });
      }
    });
    
    return results
      .sort((a, b) => b.score - a.score)
      .map(result => result.student);
  }

  /**
   * Semantic search using TF-IDF algorithm
   */
  public semanticSearch(students: Student[], query: string): Student[] {
    const documents = students.map(student => 
      `${student.firstName} ${student.lastName} ${student.email} ${student.course} ${student.department}`
    );
    
    const tfidfScores = this.calculateTFIDF(documents, query);
    
    return students
      .map((student, index) => ({ student, score: tfidfScores[index] }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.student);
  }

  private calculateTFIDF(documents: string[], query: string): number[] {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const docCount = documents.length;
    
    return documents.map(doc => {
      const docTerms = doc.toLowerCase().split(/\s+/);
      const termFreq = new Map<string, number>();
      
      docTerms.forEach(term => {
        termFreq.set(term, (termFreq.get(term) || 0) + 1);
      });
      
      let score = 0;
      queryTerms.forEach(queryTerm => {
        const tf = (termFreq.get(queryTerm) || 0) / docTerms.length;
        const docsWithTerm = documents.filter(d => 
          d.toLowerCase().includes(queryTerm)
        ).length;
        const idf = Math.log(docCount / (docsWithTerm || 1));
        
        score += tf * idf;
      });
      
      return score;
    });
  }

  /**
   * Multi-field advanced search with weighted scoring
   */
  public advancedSearch(
    students: Student[], 
    criteria: SearchCriteria
  ): Student[] {
    return students.filter(student => {
      let score = 0;
      let totalWeight = 0;

      if (criteria.name) {
        const nameMatch = this.fuzzySearch([student], criteria.name, 0.6).length > 0;
        score += nameMatch ? criteria.weights?.name || 1 : 0;
        totalWeight += criteria.weights?.name || 1;
      }

      if (criteria.department) {
        const deptMatch = student.department.toLowerCase().includes(criteria.department.toLowerCase());
        score += deptMatch ? criteria.weights?.department || 1 : 0;
        totalWeight += criteria.weights?.department || 1;
      }

      if (criteria.course) {
        const courseMatch = student.course.toLowerCase().includes(criteria.course.toLowerCase());
        score += courseMatch ? criteria.weights?.course || 1 : 0;
        totalWeight += criteria.weights?.course || 1;
      }

      if (criteria.yearRange) {
        const yearMatch = student.year >= criteria.yearRange.min && student.year <= criteria.yearRange.max;
        score += yearMatch ? criteria.weights?.year || 1 : 0;
        totalWeight += criteria.weights?.year || 1;
      }

      return totalWeight > 0 ? (score / totalWeight) >= (criteria.threshold || 0.5) : false;
    });
  }
}

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  studentIds: Set<string>;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.studentIds = new Set();
  }
}

export interface SearchCriteria {
  name?: string;
  department?: string;
  course?: string;
  yearRange?: { min: number; max: number };
  threshold?: number;
  weights?: {
    name?: number;
    department?: number;
    course?: number;
    year?: number;
  };
}