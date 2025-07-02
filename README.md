# Sterling Travel Platform

A comprehensive travel platform built with Next.js, TypeScript, Prisma, and PostgreSQL that allows users to browse predefined travel packages or build custom trips.

## Features

### 🎯 Core Functionality
- **Predefined Packages**: Browse and purchase curated travel packages with bundled services
- **Custom Trip Builder**: Create personalized trips by selecting individual services
- **Multi-Trip Cart**: Manage multiple trips simultaneously with independent checkout
- **Service Management**: Add, edit, and remove flights, hotels, activities, and transport

### 🛠 Technical Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Basic user system (expandable)

## Getting Started

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose (for PostgreSQL)
- Bun (recommended) or npm

### Installation

1. **Clone and install dependencies**
   \`\`\`bash
   git clone <repository-url>
   cd sterling-travel-platform
   bun install
   \`\`\`

2. **Set up the database**
   \`\`\`bash
   # Start PostgreSQL with Docker Compose
   docker-compose up -d
   
   # Copy environment variables
   cp .env.example .env
   
   # Update .env with your database credentials
   # DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_db_name"
   \`\`\`

3. **Initialize the database**
   \`\`\`bash
   # Generate Prisma client
   bun run db:generate
   
   # Push schema to database
   bun run db:push
   
   # Seed with sample data
   bun run db:seed
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   bun run dev
   \`\`\`

Visit `http://localhost:3000` to see the application.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── packages/      # Package management
│   │   ├── services/      # Service catalog
│   │   ├── trips/         # Custom trip management
│   │   └── cart/          # Shopping cart
│   ├── packages/          # Package browsing page
│   ├── trip-builder/      # Custom trip builder
│   └── cart/              # Shopping cart page
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
├── prisma/               # Database schema and migrations
└── scripts/              # Database seeding scripts
\`\`\`

## API Endpoints

### Packages
- `GET /api/packages` - List packages with filtering
- Query params: `destination`, `minPrice`, `maxPrice`, `duration`

### Services
- `GET /api/services` - List services by type
- Query params: `type`, `minPrice`, `maxPrice`

### Trips
- `GET /api/trips` - List user's custom trips
- `POST /api/trips` - Create new trip
- `POST /api/trips/[id]/services` - Add service to trip
- `DELETE /api/trips/[id]/services` - Remove service from trip

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/[id]` - Remove item from cart

## Database Schema

### Core Models
- **User**: Basic user information
- **Package**: Predefined travel packages
- **Service**: Individual travel services (flights, hotels, activities, transport)
- **Trip**: Custom user-created trips
- **CartItem**: Shopping cart management

### Service Types
- `FLIGHT`: Airline tickets with origin/destination
- `LODGING`: Hotel accommodations
- `ACTIVITY`: Tours and experiences
- `TRANSPORT`: Ground transportation

## Usage Examples

### Browse Packages
1. Visit `/packages`
2. Use filters to find packages by destination, price, or duration
3. Add packages directly to cart

### Build Custom Trip
1. Visit `/trip-builder`
2. Create a new trip or select existing one
3. Browse services by category (flights, hotels, activities, transport)
4. Add services to your trip
5. Add completed trip to cart

### Manage Cart
1. Visit `/cart`
2. Review packages and custom trips
3. Remove items if needed
4. Proceed to checkout

## Development

### Database Operations
\`\`\`bash
# Reset database
bun run db:push --force-reset

# View database
bunx prisma studio

# Create migration
bun run db:migrate

# Seed database
bun run db:seed
\`\`\`

### Adding New Features
1. Update Prisma schema in `prisma/schema.prisma`
2. Run `bun run db:generate` to update client
3. Create API routes in `app/api/`
4. Build frontend components
5. Update seeding scripts if needed

## Deployment

The application is ready for deployment on Vercel or similar platforms:

1. Set up PostgreSQL database (Supabase, Neon, etc.)
2. Configure environment variables
3. Deploy with automatic database migrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
# inet-music
# inet-music
# inet-music
