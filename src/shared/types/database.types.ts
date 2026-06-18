export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          brand: string;
          type: string;
          price: number;
          cost_price: number;
          stock_qty: number;
          description: string | null;
          images: string[] | null;
          is_active: boolean;
          featured: boolean;
          gender: string | null;
          case_size: string | null;
          water_resist: string | null;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          brand: string;
          type: string;
          price: number;
          cost_price: number;
          stock_qty: number;
          description?: string | null;
          images?: string[] | null;
          is_active?: boolean;
          featured?: boolean;
          gender?: string | null;
          case_size?: string | null;
          water_resist?: string | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          brand?: string;
          type?: string;
          price?: number;
          cost_price?: number;
          stock_qty?: number;
          description?: string | null;
          images?: string[] | null;
          is_active?: boolean;
          featured?: boolean;
          gender?: string | null;
          case_size?: string | null;
          water_resist?: string | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          customer_city: string;
          customer_addr: string;
          total: number;
          status: string;
          payment_method: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          customer_city: string;
          customer_addr: string;
          total: number;
          status?: string;
          payment_method?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_city?: string;
          customer_addr?: string;
          total?: number;
          status?: string;
          payment_method?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          id: string;
          email: string;
          password: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}