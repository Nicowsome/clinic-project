#!/bin/bash
set -e

# Exit if not in the root directory
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: Please run this script from the root directory of the project"
    exit 1
fi

# Build and start the services in detached mode
echo "Building and starting services..."
docker-compose up --build -d

echo ""
echo "==========================================="
echo "🚀 Application is now running!"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:3000"
echo "MongoDB: mongodb://localhost:27017"
echo ""
echo "To view logs, run: docker-compose logs -f"
echo "To stop the services, run: docker-compose down"
echo "==========================================="
echo ""

# Show logs in the foreground
docker-compose logs -f
