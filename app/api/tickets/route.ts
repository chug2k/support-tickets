import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const ticketData = await request.json();

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({
      ...ticketData,
      status: 'open',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ticket });
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('id');
  const updates = await request.json();

  if (!ticketId) {
    return NextResponse.json({ error: 'Missing ticket ID' }, { status: 400 });
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ticket });
}
