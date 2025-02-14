# GitHub Organization Security Report Generator

This application generates comprehensive security reports for GitHub organizations by aggregating Code Scanning, Secret Scanning, and Dependabot alerts at the organization level.

## Prerequisites

1. Docker installed on your machine
2. GitHub Personal Access Token (PAT) with the following permissions:
   - Organization owner access
   - `security_events` scope for:
     - Code Scanning API access
     - Secret Scanning API access
     - Dependabot API access

## Running the Application

### Using Docker (Recommended)

1. Build the Docker image:
```bash
docker build -t github-security-report .
```

2. Run the container:
```bash
docker run -p 3000:80 github-security-report
```

3. Access the application at http://localhost:3000

### Using the Application

1. Enter your GitHub organization name
2. Paste your Personal Access Token
3. Click "Generate Report"
4. Choose whether to include detailed alerts in the PDF
5. Download your security report

## Development

### Local Development
```bash
npm install
npm start
```

### Development with Docker
```bash
# Build development image
docker build -f Dockerfile.dev -t github-security-report-dev .

# Run with hot-reloading
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules github-security-report-dev
```

## Available Scripts

### `docker build -t github-security-report .`
Builds the production Docker image

### `docker run -p 3000:80 github-security-report`
Runs the production container

### `npm start`
Runs the app in development mode locally

### `npm test`
Launches the test runner

### `npm run build`
Builds the app for production