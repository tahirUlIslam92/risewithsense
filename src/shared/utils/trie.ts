/**
 * Trie (Prefix Tree) - For Search Autocomplete
 * 
 * Data Structure: N-ary Tree with HashMap-based children
 * 
 * Time Complexity:
 *   insert(word):      O(k) where k = word length
 *   search(word):      O(k) - exact match
 *   startsWith(prefix): O(p) where p = prefix length
 *   getAllWords(prefix): O(p + m) where m = total chars in all matching words
 *   getSuggestions(prefix, limit): O(p + m) pruned
 * 
 * Space Complexity: O(n * k) where n = number of words, k = avg word length
 * 
 * Use Case: Product search autocomplete
 *  - User types "cas" → suggests "Casio", "Casio G-Shock", "Casio Edifice"
 */

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  value?: string; // The full word at this leaf
  frequency: number; // For ranking suggestions

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.frequency = 0;
  }
}

export class Trie {
  private root: TrieNode;
  private wordCount: number;

  constructor() {
    this.root = new TrieNode();
    this.wordCount = 0;
  }

  /**
   * Insert word into trie - O(k) where k = word length
   * 
   * Characters inserted as nodes along the path.
   * Last node marked as endOfWord.
   */
  insert(word: string, frequency: number = 1): void {
    if (!word || word.trim().length === 0) return;

    const normalized = word.toLowerCase().trim();
    let current = this.root;

    for (const char of normalized) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }

    if (!current.isEndOfWord) {
      current.isEndOfWord = true;
      current.value = word.trim();
      this.wordCount++;
    }

    current.frequency += frequency;
  }

  /**
   * Bulk insert - O(n * k) where n = words.length
   */
  insertAll(words: string[]): void {
    for (const word of words) {
      this.insert(word);
    }
  }

  /**
   * Search exact word - O(k)
   */
  search(word: string): boolean {
    const node = this.getNode(word);
    return node !== null && node.isEndOfWord;
  }

  /**
   * Check if prefix exists - O(p)
   */
  startsWith(prefix: string): boolean {
    return this.getNode(prefix) !== null;
  }

  /**
   * Get autocomplete suggestions - O(p + m) where m = matching chars
   * 
   * Returns top {limit} suggestions ranked by frequency.
   * Uses DFS to collect all words under the prefix node.
   * 
   * @param prefix - The prefix to match
   * @param limit - Maximum suggestions to return
   */
  getSuggestions(prefix: string, limit: number = 5): string[] {
    const normalized = prefix.toLowerCase().trim();
    const prefixNode = this.getNode(normalized);

    if (!prefixNode) return [];

    // Collect all words under this node
    const results: Array<{ word: string; frequency: number }> = [];
    this.collectWords(prefixNode, results);

    // Sort by frequency (descending) and return top results
    return results
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map((r) => r.word);
  }

  /**
   * Delete word - O(k)
   * 
   * Removes nodes that are no longer needed.
   * Uses recursive approach to clean up empty paths.
   */
  delete(word: string): boolean {
    const normalized = word.toLowerCase().trim();
    const deleted = this.deleteRecursive(this.root, normalized, 0);
    if (deleted) this.wordCount--;
    return deleted;
  }

  /**
   * Number of words in trie - O(1)
   */
  get size(): number {
    return this.wordCount;
  }

  /**
   * Clear all entries - O(1) (GC handles cleanup)
   */
  clear(): void {
    this.root = new TrieNode();
    this.wordCount = 0;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private getNode(prefix: string): TrieNode | null {
    let current = this.root;
    for (const char of prefix) {
      if (!current.children.has(char)) return null;
      current = current.children.get(char)!;
    }
    return current;
  }

  /**
   * DFS collection of words - O(m) where m = total chars in subtree
   */
  private collectWords(
    node: TrieNode,
    results: Array<{ word: string; frequency: number }>
  ): void {
    if (node.isEndOfWord && node.value) {
      results.push({ word: node.value, frequency: node.frequency });
    }

    for (const [, child] of node.children) {
      this.collectWords(child, results);
    }
  }

  /**
   * Recursive delete with cleanup - O(k)
   */
  private deleteRecursive(
    node: TrieNode,
    word: string,
    index: number
  ): boolean {
    if (index === word.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      node.value = undefined;
      return node.children.size === 0; // Can delete if no children
    }

    const char = word[index];
    const child = node.children.get(char);

    if (!child) return false;

    const shouldDeleteChild = this.deleteRecursive(child, word, index + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);
      return node.children.size === 0 && !node.isEndOfWord;
    }

    return false;
  }
}

// Singleton for product search
export const productSearchTrie = new Trie();