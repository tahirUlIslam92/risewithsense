/**
 * Supabase Mock - For Unit Testing
 * 
 * Provides a fully typed, in-memory mock of Supabase client.
 * Enables testing repositories and actions without a real database.
 * 
 * Design Pattern: Test Double (Mock)
 * 
 * Usage in tests:
 *   vi.mock("@/infrastructure/supabase/client.server", () => ({
 *     createServerClient: () => createMockSupabaseClient(),
 *   }));
 * 
 * Data Structure: HashMap-based storage
 * - products: Map<id, ProductRow> - O(1) lookup
 * - orders: Map<id, OrderRow> - O(1) lookup
 * - Supports filtering, pagination, ordering
 */

interface MockQueryBuilder {
  data: any[] | null;
  error: Error | null;
  count: number | null;
  
  select: (columns?: string) => MockQueryBuilder;
  insert: (data: any) => MockQueryBuilder;
  update: (data: any) => MockQueryBuilder;
  delete: () => MockQueryBuilder;
  upsert: (data: any, options?: any) => MockQueryBuilder;
  
  eq: (column: string, value: any) => MockQueryBuilder;
  neq: (column: string, value: any) => MockQueryBuilder;
  gt: (column: string, value: any) => MockQueryBuilder;
  gte: (column: string, value: any) => MockQueryBuilder;
  lt: (column: string, value: any) => MockQueryBuilder;
  lte: (column: string, value: any) => MockQueryBuilder;
  ilike: (column: string, value: string) => MockQueryBuilder;
  or: (query: string) => MockQueryBuilder;
  in: (column: string, values: any[]) => MockQueryBuilder;
  
  order: (column: string, options?: { ascending?: boolean }) => MockQueryBuilder;
  range: (from: number, to: number) => MockQueryBuilder;
  limit: (count: number) => MockQueryBuilder;
  single: () => MockQueryBuilder;
}

interface MockSupabaseClient {
  from: (table: string) => MockQueryBuilder;
  auth: {
    getUser: () => Promise<{ data: { user: any } | null; error: Error | null }>;
    getSession: () => Promise<{ data: { session: any } | null; error: Error | null }>;
  };
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File) => Promise<{ data: any; error: Error | null }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
      remove: (paths: string[]) => Promise<{ data: any; error: Error | null }>;
    };
  };
}

// In-memory database
interface MockDatabase {
  products: Map<string, any>;
  orders: Map<string, any>;
  order_items: Map<string, any>;
  categories: Map<string, any>;
  admins: Map<string, any>;
}

/**
 * Create a fresh mock Supabase client with empty database
 * O(1) creation
 */
export function createMockSupabaseClient(
  initialData?: Partial<MockDatabase>
): MockSupabaseClient {
  const db: MockDatabase = {
    products: initialData?.products || new Map(),
    orders: initialData?.orders || new Map(),
    order_items: initialData?.order_items || new Map(),
    categories: initialData?.categories || new Map(),
    admins: initialData?.admins || new Map(),
  };

  /**
   * Mock Query Builder
   * 
   * Implements the Supabase query chain pattern.
   * Methods are chainable - each returns `this`.
   * 
   * Supports common Supabase operations:
   * - select, insert, update, upsert, delete
   * - eq, neq, gt, gte, lt, lte, ilike, or
   * - order, range, limit
   */
  function createQueryBuilder(table: string): MockQueryBuilder {
    const filters: Array<{
      type: string;
      column: string;
      value: any;
    }> = [];
    
    let sortColumn: string | null = null;
    let sortAscending = false;
    let rangeStart: number | null = null;
    let rangeEnd: number | null = null;
    let limitCount: number | null = null;
    let isSingle = false;

    const builder: MockQueryBuilder = {
      data: null,
      error: null,
      count: null,

      select(_columns?: string) {
        try {
          let rows = Array.from(db[table as keyof MockDatabase]?.values() || []);

          // Apply filters
          for (const filter of filters) {
            rows = rows.filter(row => {
              const val = row[filter.column];
              switch (filter.type) {
                case "eq": return val === filter.value;
                case "neq": return val !== filter.value;
                case "gt": return val > filter.value;
                case "gte": return val >= filter.value;
                case "lt": return val < filter.value;
                case "lte": return val <= filter.value;
                case "ilike": {
                  const searchStr = String(filter.value).replace(/%/g, "");
                  return String(val).toLowerCase().includes(searchStr.toLowerCase());
                }
                default: return true;
              }
            });
          }

          this.count = rows.length;

          // Apply sorting
          if (sortColumn) {
            rows.sort((a, b) => {
              if (a[sortColumn!] < b[sortColumn!]) return sortAscending ? -1 : 1;
              if (a[sortColumn!] > b[sortColumn!]) return sortAscending ? 1 : -1;
              return 0;
            });
          }

          // Apply limit
          if (limitCount !== null) {
            rows = rows.slice(0, limitCount);
          }

          // Apply range
          if (rangeStart !== null && rangeEnd !== null) {
            rows = rows.slice(rangeStart, rangeEnd + 1);
          }

          this.data = isSingle ? (rows[0] || null) : rows;
          this.error = null;

          if (isSingle && !this.data) {
            this.error = { code: "PGRST116", message: "No rows returned" } as any;
          }
        } catch (err) {
          this.error = err as Error;
          this.data = null;
        }
        return this;
      },

      insert(newData: any) {
        try {
          const tableData = db[table as keyof MockDatabase];
          if (!tableData) throw new Error(`Table ${table} not found`);

          if (Array.isArray(newData)) {
            newData.forEach(item => {
              const id = item.id || crypto.randomUUID();
              tableData.set(id, { ...item, id });
            });
          } else {
            const id = newData.id || crypto.randomUUID();
            tableData.set(id, { ...newData, id });
          }

          this.data = Array.isArray(newData) ? newData : { ...newData, id: newData.id || crypto.randomUUID() };
          this.error = null;
        } catch (err) {
          this.error = err as Error;
          this.data = null;
        }
        return this;
      },

      update(updateData: any) {
        try {
          const tableData = db[table as keyof MockDatabase];
          if (!tableData) throw new Error(`Table ${table} not found`);

          const rows = Array.from(tableData.values());
          for (const filter of filters) {
            for (const row of rows) {
              if (row[filter.column] === filter.value) {
                Object.assign(row, updateData);
              }
            }
          }

          this.data = rows[0] || null;
          this.error = null;
        } catch (err) {
          this.error = err as Error;
          this.data = null;
        }
        return this;
      },

      upsert(newData: any, _options?: any) {
        try {
          const tableData = db[table as keyof MockDatabase];
          if (!tableData) throw new Error(`Table ${table} not found`);

          const id = newData.id;
          if (tableData.has(id)) {
            Object.assign(tableData.get(id)!, newData);
          } else {
            tableData.set(id, newData);
          }

          this.data = newData;
          this.error = null;
        } catch (err) {
          this.error = err as Error;
          this.data = null;
        }
        return this;
      },

      delete() {
        try {
          const tableData = db[table as keyof MockDatabase];
          if (!tableData) throw new Error(`Table ${table} not found`);

          for (const filter of filters) {
            for (const [key, row] of tableData) {
              if (row[filter.column] === filter.value) {
                tableData.delete(key);
              }
            }
          }

          this.data = null;
          this.error = null;
        } catch (err) {
          this.error = err as Error;
        }
        return this;
      },

      eq(column: string, value: any) {
        filters.push({ type: "eq", column, value });
        return this;
      },

      neq(column: string, value: any) {
        filters.push({ type: "neq", column, value });
        return this;
      },

      gt(column: string, value: any) {
        filters.push({ type: "gt", column, value });
        return this;
      },

      gte(column: string, value: any) {
        filters.push({ type: "gte", column, value });
        return this;
      },

      lt(column: string, value: any) {
        filters.push({ type: "lt", column, value });
        return this;
      },

      lte(column: string, value: any) {
        filters.push({ type: "lte", column, value });
        return this;
      },

      ilike(column: string, value: string) {
        filters.push({ type: "ilike", column, value });
        return this;
      },

      or(query: string) {
        // Simplified OR support
        const parts = query.split(",");
        for (const part of parts) {
          const match = part.match(/(\w+)\.ilike\.(.+)/);
          if (match) {
            filters.push({
              type: "ilike",
              column: match[1],
              value: match[2],
            });
          }
        }
        return this;
      },

      in(column: string, values: any[]) {
        filters.push({ type: "in", column, value: values });
        return this;
      },

      order(column: string, options?: { ascending?: boolean }) {
        sortColumn = column;
        sortAscending = options?.ascending ?? false;
        return this;
      },

      range(from: number, to: number) {
        rangeStart = from;
        rangeEnd = to;
        return this;
      },

      limit(count: number) {
        limitCount = count;
        return this;
      },

      single() {
        isSingle = true;
        return this;
      },
    };

    return builder;
  }

  return {
    from: (table: string) => createQueryBuilder(table),

    auth: {
      async getUser() {
        return {
          data: { user: { id: "mock-user-id", email: "admin@watchstore.pk" } },
          error: null,
        };
      },
      async getSession() {
        return {
          data: { session: { user: { id: "mock-user-id" } } },
          error: null,
        };
      },
    },

    storage: {
      from: (_bucket: string) => ({
        async upload(_path: string, _file: File) {
          return { data: { path: "mock-path" }, error: null };
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: `https://mock-storage.supabase.co/${path}` } };
        },
        async remove(_paths: string[]) {
          return { data: null, error: null };
        },
      }),
    },
  };
}

/**
 * Seed the mock database with test data
 * O(n) where n = number of products
 */
export function seedMockDatabase() {
  const products = new Map();
  const categories = new Map();

  // Add test categories
  categories.set("cat-1", {
    id: "cat-1",
    name: "Analog Watches",
    slug: "analog-watches",
  });

  categories.set("cat-2", {
    id: "cat-2",
    name: "Digital Watches",
    slug: "digital-watches",
  });

  // Add test products
  const testProducts = [
    {
      id: "prod-1",
      name: "Rolex Submariner",
      slug: "rolex-submariner",
      brand: "Rolex",
      type: "analog",
      price: 50000,
      cost_price: 35000,
      stock_qty: 10,
      description: "Luxury dive watch with automatic movement",
      images: ["https://example.com/rolex-1.jpg"],
      is_active: true,
      featured: true,
      gender: "men",
      case_size: "42mm",
      water_resist: "300m",
      category_id: "cat-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod-2",
      name: "Casio G-Shock",
      slug: "casio-g-shock",
      brand: "Casio",
      type: "digital",
      price: 15000,
      cost_price: 10000,
      stock_qty: 25,
      description: "Shock resistant digital watch",
      images: ["https://example.com/casio-1.jpg"],
      is_active: true,
      featured: false,
      gender: "unisex",
      case_size: "45mm",
      water_resist: "200m",
      category_id: "cat-2",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod-3",
      name: "Apple Watch Ultra",
      slug: "apple-watch-ultra",
      brand: "Apple",
      type: "smart",
      price: 120000,
      cost_price: 90000,
      stock_qty: 5,
      description: "Premium smartwatch with GPS + Cellular",
      images: ["https://example.com/apple-1.jpg"],
      is_active: true,
      featured: true,
      gender: "unisex",
      case_size: "49mm",
      water_resist: "100m",
      category_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  testProducts.forEach(p => products.set(p.id, p));

  return { products, categories, orders: new Map(), order_items: new Map(), admins: new Map() };
}