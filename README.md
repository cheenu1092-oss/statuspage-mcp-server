# Statuspage MCP Server

**MCP (Model Context Protocol) server for Atlassian Statuspage — incident and status page management via AI agents.**

> Manage incidents, components, and subscribers on your Statuspage through natural language.

## What is this?

This server lets AI agents interact with your [Statuspage](https://www.atlassian.com/software/statuspage) to:
- List and manage status pages
- Create and update components
- Manage incidents (create, update, resolve)
- Handle subscriber management

## Two Variants

### 1. Traditional Mode (Recommended)
Pre-built tools for common operations:
- `list_pages`, `get_page`
- `list_components`, `create_component`, `update_component`, `delete_component`
- `list_incidents`, `create_incident`, `update_incident`, `delete_incident`
- `list_subscribers`, `create_subscriber`, `delete_subscriber`

### 2. Code Mode (Power Users)
Agent gets the full API schema and can compose arbitrary API calls using `execute_api_call` tool.

## Installation

```bash
npm install
npm run build
```

## Configuration

Set these environment variables:

```bash
export STATUSPAGE_API_KEY="your-api-key-here"
export STATUSPAGE_PAGE_ID="your-page-id-here"
export STATUSPAGE_BASE_URL="https://api.statuspage.io/v1"  # optional
export STATUSPAGE_ENABLE_WRITE="true"  # enables write operations
```

### Getting Your API Key

1. Log in to your Statuspage account
2. Go to **Account Settings** → **API Info**
3. Generate or copy your API key
4. Find your Page ID in the page URL or API Info section

## Usage

### Traditional Mode

```bash
npm run start:traditional
```

Or add to your MCP client config:

```json
{
  "mcpServers": {
    "statuspage": {
      "command": "node",
      "args": ["/path/to/statuspage-mcp-server/dist/traditional/index.js"],
      "env": {
        "STATUSPAGE_API_KEY": "your-api-key",
        "STATUSPAGE_PAGE_ID": "your-page-id",
        "STATUSPAGE_ENABLE_WRITE": "true"
      }
    }
  }
}
```

### Code Mode

```bash
npm run start:code-mode
```

### Docker

```bash
docker build -t statuspage-mcp-server .
```

MCP client config (stdio):

```json
{
  "mcpServers": {
    "statuspage": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "STATUSPAGE_API_KEY",
        "-e", "STATUSPAGE_PAGE_ID",
        "-e", "STATUSPAGE_ENABLE_WRITE",
        "statuspage-mcp-server"
      ],
      "env": {
        "STATUSPAGE_API_KEY": "your-api-key",
        "STATUSPAGE_PAGE_ID": "your-page-id",
        "STATUSPAGE_ENABLE_WRITE": "true"
      }
    }
  }
}
```

For code mode, append `node dist/code-mode/index.js` after the image name.

## Example Prompts

**Read-only operations (always available):**
- "Show me all incidents from the last week"
- "What's the current status of our API component?"
- "List all subscribers"

**Write operations (requires `STATUSPAGE_ENABLE_WRITE=true`):**
- "Create an incident for database outage, status investigating"
- "Update the incident to resolved and post a message"
- "Add a new component called 'Payment Gateway'"
- "Subscribe user@example.com to status updates"

## API Coverage

### Phase 1: Read-Only ✅
- ✅ list_pages
- ✅ get_page
- ✅ list_components
- ✅ get_component
- ✅ list_incidents
- ✅ get_incident
- ✅ list_subscribers

### Phase 2: Write Operations ✅
- ✅ create_component
- ✅ update_component
- ✅ delete_component
- ✅ update_component_status
- ✅ create_incident
- ✅ update_incident
- ✅ delete_incident
- ✅ create_subscriber
- ✅ delete_subscriber

## Safety

- **Read operations are always safe** — they never modify data
- **Write operations are gated** behind the `STATUSPAGE_ENABLE_WRITE` flag
- All API calls include proper error handling
- Rate limits are respected (Statuspage: 60 req/min)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Run in dev mode
npm run start:traditional
```

## Links

- [Statuspage API Documentation](https://developer.statuspage.io/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Net Infra MCP Registry](https://github.com/cheenu1092-oss/net-infra-mcp)

## License

MIT
