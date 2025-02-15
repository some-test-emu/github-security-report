# GitHub Organization Security Report Generator

This application generates comprehensive security reports for GitHub organizations by aggregating Code Scanning, Secret Scanning, and Dependabot alerts at the organization level. The report includes visual charts and detailed tables of security alerts.

## Prerequisites

1. Docker installed on your machine (recommended method)
   OR
   Node.js (v18 or later) and npm installed

2. GitHub Personal Access Token (PAT) with the following permissions:
   - Organization owner access
     - Code Scanning Alerts: Read access
     - Secret Scanning Alerts: Read access
     - Dependabot Alerts: Read access

To create a Personal Access Token:
1. Go to GitHub.com → Settings → Developer settings → Fine-grained tokens
2. Click "Generate new token"
3. Resource Owner should be the Organization you want to report on
4. Select repositories you want to report on or choose "All repositories"
5. Select the required permissions mentioned above
6. Copy the generated token (you'll need it when using the application)

## Installation & Running

### Method 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/chetbackiewicz/github-advanced-security-org-pdf.git
cd github-advanced-security-org-pdf
```

2. Build the Docker image:
```bash
docker build -t github-security-report .
```

3. Run the container:
```bash
docker run -p 3000:80 github-security-report
```

4. Access the application at http://localhost:3000

### Method 2: Using Node.js Locally

1. Clone the repository:
```bash
git clone https://github.com/chetbackiewicz/github-advanced-security-org-pdf.git
cd github-advanced-security-org-pdf
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Access the application at http://localhost:3000

## Using the Application

1. Once the application is running, you'll see a login form
2. Enter your GitHub organization name (e.g., "your-org-name")
3. Paste your GitHub Personal Access Token
4. Click "Generate Report"
5. The application will:
   - Fetch all security alerts for your organization
   - Generate visual charts for severity distributions
   - Create tables summarizing the alerts
6. Choose whether to include detailed alerts in the PDF using the checkbox
7. Click "Download PDF Report" to get your security report

## Features

- Executive summary of all security alerts
- Visual pie charts showing severity distributions
- Detailed breakdowns for:
  - Code Scanning alerts
  - Secret Scanning alerts
  - Dependabot alerts
- Optional detailed alert information in the PDF
- Responsive web interface
- Secure token handling (tokens are never stored)

## Development

### Local Development with Hot Reloading
```bash
npm install
npm start
```

## Troubleshooting

1. If you see permission errors:
   - Verify your Personal Access Token has the required permissions
   - Ensure you have organization owner access
   - Check if your token hasn't expired

2. If charts don't appear in the PDF:
   - Wait a few seconds after the data loads before downloading
   - Try refreshing the page if the issue persists

3. If the application fails to start:
   - For Docker: ensure ports 3000/80 aren't in use
   - For local development: ensure Node.js v18+ is installed