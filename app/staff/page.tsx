import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Disable caching for real-time dashboard updates
export const revalidate = 0;

async function getTicketStats() {
  const { data: tickets } = await supabase
    .from('tickets')
    .select('status');

  const stats = {
    open: tickets?.filter((t) => t.status === 'open').length || 0,
    in_progress: tickets?.filter((t) => t.status === 'in_progress').length || 0,
    resolved: tickets?.filter((t) => t.status === 'resolved').length || 0,
    total: tickets?.length || 0,
  };

  return stats;
}

async function getRecentTickets() {
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(10);

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

export default async function StaffDashboard() {
  const stats = await getTicketStats();
  const recentTickets = await getRecentTickets();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Staff Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Tickets
          </h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-yellow-700 mb-1">Open</h3>
          <p className="text-3xl font-bold text-yellow-900">{stats.open}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-blue-700 mb-1">
            In Progress
          </h3>
          <p className="text-3xl font-bold text-blue-900">
            {stats.in_progress}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-green-700 mb-1">Resolved</h3>
          <p className="text-3xl font-bold text-green-900">{stats.resolved}</p>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Recently Updated Tickets
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTickets.map((ticket: any) => (
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
              <p className="text-gray-600 mb-3 line-clamp-1">
                {ticket.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  <span className="font-medium">From:</span>{' '}
                  {ticket.customer_name}
                </div>
                {ticket.assigned_to && (
                  <div>
                    <span className="font-medium">Assigned to:</span>{' '}
                    {ticket.assigned_to}
                  </div>
                )}
                <div>
                  Updated:{' '}
                  {new Date(ticket.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
