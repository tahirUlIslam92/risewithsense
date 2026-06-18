"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { searchProducts } from "@/application/actions/product.action";
import { Trie, productSearchTrie } from "@/shared/utils/trie";

/**
 * useSearch Hook
 * 
 * Autocomplete search with debounce and caching.
 * 
 * Data Structures:
 * - Trie: O(k) prefix search for autocomplete
 * - Debounce: Reduces API calls by 300ms
 * - Cache: LRU for previous search results
 * 
 * Usage:
 *   const { query, setQuery, suggestions, isLoading } = useSearch();
 */

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  performSearch: () => Promise<string[]>;
}

export function useSearch(minChars: number = 2): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, string[]>>(new Map());

  /**
   * Debounced search - O(k) Trie + O(1) cache
   * 
   * Debounce Algorithm:
   * 1. Clear previous timeout
   * 2. Set new timeout for 300ms
   * 3. If no new input in 300ms, execute search
   */
  useEffect(() => {
    if (query.length < minChars) {
      setSuggestions([]);
      return;
    }

    // Debounce - O(1) timer operations
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      // Cancel previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      // Check cache - O(1)
      const cached = cacheRef.current.get(query);
      if (cached) {
        setSuggestions(cached);
        return;
      }

      setIsLoading(true);

      try {
        // Try Trie first (client-side, instant) - O(k)
        const trieResults = productSearchTrie.getSuggestions(query, 8);
        
        if (trieResults.length > 0) {
          setSuggestions(trieResults);
          cacheRef.current.set(query, trieResults);
          setIsLoading(false);
          return;
        }

        // Fallback to server search
        const result = await searchProducts(query);
        
        if (result.isSuccess()) {
          const results = result.getValue();
          setSuggestions(results);
          cacheRef.current.set(query, results);
          
          // Add to trie for future searches
          results.forEach(word => productSearchTrie.insert(word));
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, minChars]);

  /**
   * Perform full search (for search page)
   */
  const performSearch = useCallback(async (): Promise<string[]> => {
    setIsLoading(true);
    try {
      const result = await searchProducts(query);
      if (result.isSuccess()) {
        return result.getValue();
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    performSearch,
  };
}

/**
 * Populate the search trie with product names
 * 
 * Call this once when products are loaded on the homepage
 * or product listing page.
 * 
 * Time: O(n * k) where n = products, k = avg name length
 */
export function usePopulateSearchTrie(products: Array<{ name: string }>) {
  useEffect(() => {
    for (const product of products) {
      productSearchTrie.insert(product.name);
    }
  }, [products]);
}