/**
 * LRU Cache - Least Recently Used Cache
 * 
 * Data Structure: HashMap + Doubly Linked List
 * 
 * Time Complexity:
 *   get(key):    O(1) - HashMap lookup + DLL move to front
 *   set(key, v): O(1) - HashMap insert + DLL add to front
 *   has(key):    O(1) - HashMap lookup
 *   delete(key): O(1) - HashMap delete + DLL remove
 * 
 * Space Complexity: O(n) where n = capacity
 * 
 * Design: Head = MRU (Most Recently Used), Tail = LRU (Least Recently Used)
 * 
 * Why DLL + HashMap?
 * - Array: O(n) deletion/sifting
 * - Map only: No ordering for eviction
 * - DLL + HashMap: O(1) random access AND O(1) ordering
 */

class DLLNode<K, V> {
  key: K;
  value: V;
  prev: DLLNode<K, V> | null = null;
  next: DLLNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly map: Map<K, DLLNode<K, V>>;
  private head: DLLNode<K, V> | null = null;
  private tail: DLLNode<K, V> | null = null;

  /**
   * @param capacity - Maximum number of items before eviction
   */
  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("LRU Cache capacity must be positive");
    this.capacity = capacity;
    this.map = new Map<K, DLLNode<K, V>>();
  }

  /**
   * Get value by key - O(1) amortized
   * Moves accessed item to front (MRU position)
   */
  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    
    // Move to front (most recently used)
    this.moveToHead(node);
    return node.value;
  }

  /**
   * Set key-value pair - O(1) amortized
   * Evicts LRU if at capacity
   */
  set(key: K, value: V): void {
    const existing = this.map.get(key);

    if (existing) {
      // Update existing node
      existing.value = value;
      this.moveToHead(existing);
      return;
    }

    // Create new node
    const node = new DLLNode(key, value);

    // Evict if at capacity
    if (this.map.size >= this.capacity) {
      this.evictLRU();
    }

    // Add to front
    this.addToHead(node);
    this.map.set(key, node);
  }

  /**
   * Check if key exists - O(1)
   */
  has(key: K): boolean {
    return this.map.has(key);
  }

  /**
   * Delete key - O(1)
   */
  delete(key: K): boolean {
    const node = this.map.get(key);
    if (!node) return false;

    this.removeNode(node);
    this.map.delete(key);
    return true;
  }

  /**
   * Get current size - O(1)
   */
  get size(): number {
    return this.map.size;
  }

  /**
   * Clear all entries - O(1) (GC handles cleanup)
   */
  clear(): void {
    this.map.clear();
    this.head = null;
    this.tail = null;
  }

  /**
   * Iterate from MRU to LRU - O(n)
   */
  *[Symbol.iterator](): IterableIterator<[K, V]> {
    let current = this.head;
    while (current) {
      yield [current.key, current.value];
      current = current.next;
    }
  }

  /**
   * Get all keys in MRU to LRU order - O(n)
   */
  keys(): K[] {
    const result: K[] = [];
    let current = this.head;
    while (current) {
      result.push(current.key);
      current = current.next;
    }
    return result;
  }

  // ============================================
  // PRIVATE: DLL Operations (all O(1))
  // ============================================

  private addToHead(node: DLLNode<K, V>): void {
    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  private removeNode(node: DLLNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  private moveToHead(node: DLLNode<K, V>): void {
    if (node === this.head) return; // Already MRU
    this.removeNode(node);
    this.addToHead(node);
  }

  private evictLRU(): void {
    if (!this.tail) return;

    const lru = this.tail;
    this.removeNode(lru);
    this.map.delete(lru.key);
  }
}