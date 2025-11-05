import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high';

export type Database = {
  public: {
    Tables: {
      tickets: {
        Row: {
          id: number;
          title: string;
          description: string;
          status: TicketStatus;
          priority: TicketPriority;
          customer_email: string;
          customer_name: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      ticket_comments: {
        Row: {
          id: number;
          ticket_id: number;
          author_name: string;
          author_email: string;
          comment: string;
          is_staff: boolean;
          created_at: string;
        };
      };
    };
  };
};
