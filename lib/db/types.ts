export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          role: "admin" | "public";
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          role?: "admin" | "public";
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          role?: "admin" | "public";
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      vehicles: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          drivetrain: string | null;
          featured: boolean;
          fuel_type: string | null;
          gallery_urls: string[];
          highlights: string[];
          id: string;
          main_image_url: string | null;
          make: string | null;
          mileage: number | null;
          model: string | null;
          price: number | null;
          published: boolean;
          slug: string;
          specs: Json;
          status: "available" | "pending" | "sold";
          title: string;
          transmission: string | null;
          trim: string | null;
          updated_at: string;
          vin: string | null;
          year: number | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          drivetrain?: string | null;
          featured?: boolean;
          fuel_type?: string | null;
          gallery_urls?: string[];
          highlights?: string[];
          id?: string;
          main_image_url?: string | null;
          make?: string | null;
          mileage?: number | null;
          model?: string | null;
          price?: number | null;
          published?: boolean;
          slug: string;
          specs?: Json;
          status?: "available" | "pending" | "sold";
          title: string;
          transmission?: string | null;
          trim?: string | null;
          updated_at?: string;
          vin?: string | null;
          year?: number | null;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          drivetrain?: string | null;
          featured?: boolean;
          fuel_type?: string | null;
          gallery_urls?: string[];
          highlights?: string[];
          id?: string;
          main_image_url?: string | null;
          make?: string | null;
          mileage?: number | null;
          model?: string | null;
          price?: number | null;
          published?: boolean;
          slug?: string;
          specs?: Json;
          status?: "available" | "pending" | "sold";
          title?: string;
          transmission?: string | null;
          trim?: string | null;
          updated_at?: string;
          vin?: string | null;
          year?: number | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          address: string | null;
          business_name: string | null;
          hero_bg_url: string | null;
          hero_headline: string | null;
          hero_subheadline: string | null;
          hours_text: string | null;
          id: number;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          business_name?: string | null;
          hero_bg_url?: string | null;
          hero_headline?: string | null;
          hero_subheadline?: string | null;
          hours_text?: string | null;
          id?: number;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          business_name?: string | null;
          hero_bg_url?: string | null;
          hero_headline?: string | null;
          hero_subheadline?: string | null;
          hours_text?: string | null;
          id?: number;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string | null;
          name: string;
          phone: string | null;
          source: string | null;
          vehicle_id: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message?: string | null;
          name: string;
          phone?: string | null;
          source?: string | null;
          vehicle_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string | null;
          name?: string;
          phone?: string | null;
          source?: string | null;
          vehicle_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          }
        ];
      };
      testimonials: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          published: boolean;
          quote: string;
          rating: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          published?: boolean;
          quote: string;
          rating?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          published?: boolean;
          quote?: string;
          rating?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: {
          uid: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
export type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
