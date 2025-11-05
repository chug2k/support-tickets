import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const commentData = await request.json();

  const { data: comment, error } = await supabase
    .from('ticket_comments')
    .insert(commentData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update ticket updated_at timestamp
  await supabase
    .from('tickets')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', commentData.ticket_id);

  return NextResponse.json({ comment });
}
