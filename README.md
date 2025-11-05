# Support Ticket System - PostHog Integration Starter

A fully functional support ticket system built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. This starter app is designed for learning metrics-driven development with PostHog integration.

## Features

- **Ticket Submission**: Create support tickets with title, description, and priority
- **Ticket Listing**: View all tickets with status and priority badges
- **Status Filtering**: Filter tickets by Open, In Progress, or Resolved
- **Ticket Details**: View full ticket information and activity history
- **Comment System**: Add comments to tickets (customers and staff)
- **Status Management**: Update ticket status through workflow
- **Staff Assignment**: Assign tickets to staff members
- **Staff Dashboard**: View statistics and recently updated tickets
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Open-source Firebase alternative for database

## Database Schema

### Tables

- **tickets**: Support tickets with status and priority
- **ticket_comments**: Comments and activity on tickets

### Status Workflow

```
Open → In Progress → Resolved
```

Resolved tickets can be reopened if needed.

### Priority Levels

- **Low**: General inquiries
- **Medium**: Issues affecting work
- **High**: Critical issues

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm installed
- Supabase CLI installed ([Install Guide](https://supabase.com/docs/guides/cli))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Supabase locally**:
   ```bash
   supabase start
   ```

   This will start a local Supabase instance and run the migrations automatically, creating all tables and seeding sample tickets with comments.

3. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   The default local Supabase credentials should work out of the box. If needed, update the values with your local Supabase URL and anon key from the `supabase start` output.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   Note: This app runs on port 3002 by default to avoid conflicts with other apps.

5. **Open your browser**:
   Navigate to [http://localhost:3002](http://localhost:3002)

## PostHog Integration Ideas

This app is ready for PostHog integration. Here are some key events to track:

### Key Events to Track

#### Customer Events
- `ticket_submitted`: When a customer submits a new ticket
- `ticket_viewed`: When anyone views a ticket
- `comment_added`: When a comment is added to a ticket
- `ticket_list_filtered`: When users filter by status

#### Staff Events
- `ticket_assigned`: When a ticket is assigned to staff
- `ticket_status_changed`: When ticket status is updated
- `staff_dashboard_viewed`: When staff views the dashboard
- `staff_comment_added`: When staff adds a comment

### Useful Properties

- Ticket ID, status, priority
- Customer information (hashed for privacy)
- Response time (time between ticket creation and first staff response)
- Resolution time (time from creation to resolved status)
- Number of comments
- Staff member assigned

### Metrics to Track

1. **Average Response Time**: Time until first staff response
2. **Average Resolution Time**: Time to resolve tickets
3. **Ticket Volume by Priority**: Track high-priority ticket trends
4. **Customer Satisfaction**: Add rating system and track scores
5. **Staff Performance**: Tickets resolved per staff member

### Example Implementation

```typescript
// Track ticket submission
posthog.capture('ticket_submitted', {
  ticket_id: ticket.id,
  priority: ticket.priority,
  customer_email_hash: hashEmail(ticket.customer_email)
})

// Track resolution time
posthog.capture('ticket_resolved', {
  ticket_id: ticket.id,
  priority: ticket.priority,
  resolution_time_hours: calculateHoursBetween(ticket.created_at, now),
  num_comments: commentCount
})
```

## Project Structure

```
support-tickets/
├── app/
│   ├── api/
│   │   ├── comments/      # Comment API routes
│   │   └── tickets/       # Ticket API routes
│   ├── staff/             # Staff dashboard
│   ├── submit/            # Ticket submission form
│   ├── tickets/[id]/      # Ticket detail page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (ticket listing)
├── lib/
│   └── supabase.ts        # Supabase client with types
├── supabase/
│   ├── config.toml        # Supabase configuration
│   └── migrations/        # Database migrations
└── package.json
```

## Sample Data

The app comes pre-seeded with:
- 8 sample tickets across all statuses
- Multiple priorities (low, medium, high)
- Sample comments from both customers and staff
- Realistic support scenarios

## Development Tips

1. **Viewing the database**: Run `supabase studio` to open the Supabase Studio UI
2. **Resetting data**: Run `supabase db reset` to reset the database and re-run migrations
3. **Custom ports**: Supabase uses ports 54341-54343 for this app (configured in `supabase/config.toml`)
4. **Staff mode**: The "I am a staff member" checkbox marks comments as coming from staff

## User Personas

### Customer
- Submit tickets
- View their tickets
- Add comments
- Check ticket status

### Staff
- View all tickets
- Filter by status
- Assign tickets
- Update status
- Add staff comments
- View dashboard with statistics

## Next Steps

1. Install and configure PostHog
2. Add event tracking to ticket lifecycle
3. Create dashboards for:
   - Response time metrics
   - Resolution time by priority
   - Ticket volume trends
   - Staff performance
4. Set up alerts for high-priority tickets
5. Track user paths through the ticket system
6. Monitor which ticket types take longest to resolve

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostHog Documentation](https://posthog.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
