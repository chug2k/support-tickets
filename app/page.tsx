import { supabase } from '@/lib/supabase';
import Link from 'next/link';

async function getTickets(status?: string) {
  let query = supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: tickets, error } = await query;

  if (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }

  return tickets;
}

const statusColors = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
};

export default async function Home({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const tickets = await getTickets(searchParams.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Support Tickets
          </h1>
          <p className="text-gray-600">
            View and track all support tickets
          </p>
        </div>
        <Link
          href="/submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Submit New Ticket
        </Link>
      </div>

      {/* Status Filter */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <Link
          href="/"
          className={`px-4 py-2 rounded-lg ${
            !searchParams.status || searchParams.status === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </Link>
        <Link
          href="?status=open"
          className={`px-4 py-2 rounded-lg ${
            searchParams.status === 'open'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Open
        </Link>
        <Link
          href="?status=in_progress"
          className={`px-4 py-2 rounded-lg ${
            searchParams.status === 'in_progress'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          In Progress
        </Link>
        <Link
          href="?status=resolved"
          className={`px-4 py-2 rounded-lg ${
            searchParams.status === 'resolved'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Resolved
        </Link>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
        {tickets.length === 0 && (
          <p className="text-gray-500 text-center py-12">
            No tickets found.
          </p>
        )}
        {tickets.map((ticket: any) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className="block p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                #{ticket.id} - {ticket.title}
              </h3>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    priorityColors[ticket.priority as keyof typeof priorityColors]
                  }`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[ticket.status as keyof typeof statusColors]
                  }`}
                >
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-3 line-clamp-2">
              {ticket.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                <span className="font-medium">From:</span> {ticket.customer_name}
              </div>
              {ticket.assigned_to && (
                <div>
                  <span className="font-medium">Assigned to:</span>{' '}
                  {ticket.assigned_to}
                </div>
              )}
              <div>
                {new Date(ticket.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
