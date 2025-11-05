import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TicketActions from './TicketActions';

async function getTicket(id: string) {
  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !ticket) {
    return null;
  }

  return ticket;
}

async function getComments(ticketId: string) {
  const { data: comments, error } = await supabase
    .from('ticket_comments')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return comments || [];
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

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { success?: string };
}) {
  const ticket = await getTicket(params.id);

  if (!ticket) {
    notFound();
  }

  const comments = await getComments(params.id);
  const showSuccess = searchParams.success === 'true';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back to All Tickets
      </a>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 mt-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-800 font-medium">
              Ticket submitted successfully!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Ticket Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                #{ticket.id} - {ticket.title}
              </h1>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    priorityColors[ticket.priority as keyof typeof priorityColors]
                  }`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[ticket.status as keyof typeof statusColors]
                  }`}
                >
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">From:</span>
                  <p className="text-gray-600">
                    {ticket.customer_name} ({ticket.customer_email})
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-gray-600">
                    {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
                {ticket.assigned_to && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Assigned to:
                    </span>
                    <p className="text-gray-600">{ticket.assigned_to}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">
                    Last updated:
                  </span>
                  <p className="text-gray-600">
                    {new Date(ticket.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Activity</h2>

            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}

            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className={`border rounded-lg p-4 ${
                    comment.is_staff
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900">
                        {comment.author_name}
                      </span>
                      {comment.is_staff && (
                        <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          Staff
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <TicketActions ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
