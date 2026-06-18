/**
 * Min-Heap Priority Queue
 * 
 * Data Structure: Binary Heap (Array-based)
 * 
 * Time Complexity:
 *   enqueue(item, priority): O(log n) - bubble up
 *   dequeue():              O(log n) - bubble down
 *   peek():                 O(1)
 *   size():                 O(1)
 *   isEmpty():              O(1)
 * 
 * Space Complexity: O(n) where n = number of items
 * 
 * Use Cases:
 * - Order priority processing (high-value orders first)
 * - Notification ordering (urgent notifications first)
 * - Task scheduling (shortest job first)
 * 
 * Heap Invariant: Parent <= both children (min-heap)
 * Array index math: 
 *   parent(i) = Math.floor((i - 1) / 2)
 *   leftChild(i) = 2*i + 1
 *   rightChild(i) = 2*i + 2
 */

interface QueueItem<T> {
  value: T;
  priority: number;
}

export class PriorityQueue<T> {
  private heap: QueueItem<T>[] = [];

  /**
   * Add item with priority - O(log n)
   * Lower priority number = higher urgency (1 is highest)
   */
  enqueue(value: T, priority: number): void {
    const item: QueueItem<T> = { value, priority };
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Remove and return highest priority item - O(log n)
   * Highest priority = lowest priority number
   */
  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop()!.value;

    const root = this.heap[0].value;
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return root;
  }

  /**
   * View highest priority item without removing - O(1)
   */
  peek(): T | undefined {
    return this.heap[0]?.value;
  }

  /**
   * Number of items - O(1)
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Check if empty - O(1)
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Convert to sorted array (drains the queue) - O(n log n)
   */
  toSortedArray(): T[] {
    const result: T[] = [];
    const temp = [...this.heap];
    
    while (!this.isEmpty()) {
      result.push(this.dequeue()!);
    }
    
    this.heap = temp; // Restore
    return result;
  }

  /**
   * Clear all items - O(1)
   */
  clear(): void {
    this.heap = [];
  }

  /**
   * Get all items without removing - O(n)
   */
  get items(): ReadonlyArray<{ value: T; priority: number }> {
    return [...this.heap].sort((a, b) => a.priority - b.priority);
  }

  // ============================================
  // PRIVATE: Heap Operations
  // ============================================

  /**
   * Bubble up to maintain min-heap invariant
   * O(log n) - max log n levels
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      if (this.heap[parentIndex].priority <= this.heap[index].priority) {
        break; // Invariant satisfied
      }
      
      // Swap with parent
      [this.heap[parentIndex], this.heap[index]] = 
        [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  /**
   * Bubble down to maintain min-heap invariant
   * O(log n) - max log n levels
   */
  private bubbleDown(index: number): void {
    const length = this.heap.length;

    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < length &&
        this.heap[leftChild].priority < this.heap[smallest].priority
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < length &&
        this.heap[rightChild].priority < this.heap[smallest].priority
      ) {
        smallest = rightChild;
      }

      if (smallest === index) break; // Invariant satisfied

      // Swap with smallest child
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}