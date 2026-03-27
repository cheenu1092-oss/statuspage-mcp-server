# Task: Scaffold Statuspage MCP Server

## Context
Build an MCP (Model Context Protocol) server for Atlassian Statuspage API following the pattern of existing net-infra-mcp servers.

## Reference Implementations
- Infoblox: ~/clawd/projects/infoblox-mcp-server
- Fortinet: ~/clawd/projects/fortinet-mcp-server
- Check Point: ~/clawd/projects/checkpoint-mcp-server

## API Reference
- **Statuspage API Docs**: https://developer.statuspage.io/
- **Category**: Incident / Status Communication
- **Auth**: API Key (X-Authorization-Token header)
- **Base URL**: https://api.statuspage.io/v1/

## Core API Operations to Implement

### Phase 1: Read-Only (Traditional Mode)
1. **Pages**: list_pages, get_page
2. **Components**: list_components, get_component
3. **Incidents**: list_incidents, get_incident
4. **Subscribers**: list_subscribers

### Phase 2: Write Operations (--enable-write flag)
1. **Incidents**: create_incident, update_incident, delete_incident
2. **Components**: create_component, update_component, delete_component, update_component_status
3. **Subscribers**: create_subscriber, delete_subscriber

## Requirements

1. **Directory Structure**:
```
statuspage-mcp-server/
├── src/
│   ├── traditional/
│   │   ├── tools/
│   │   │   ├── pages.ts
│   │   │   ├── components.ts
│   │   │   ├── incidents.ts
│   │   │   └── subscribers.ts
│   │   └── index.ts
│   ├── code-mode/
│   │   ├── executor.ts
│   │   └── index.ts
│   ├── client.ts
│   └── config.ts
├── tests/
│   ├── client.test.ts
│   ├── pages-tools.test.ts
│   ├── components-tools.test.ts
│   └── incidents-tools.test.ts
├── docs/
│   ├── api-coverage.md
│   └── examples.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
├── README.md
└── SPEC.md
```

2. **Files to Create**:

### package.json
```json
{
  "name": "statuspage-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for Atlassian Statuspage — incident and status page management via AI agents",
  "type": "module",
  "scripts": {
    "build": "tsup src/traditional/index.ts src/code-mode/index.ts --format esm --dts --clean",
    "test": "vitest run",
    "start:traditional": "node dist/traditional/index.js",
    "start:code-mode": "node dist/code-mode/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.27.1",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@types/node": "^25.5.0",
    "tsup": "^8.5.1",
    "typescript": "^5.9.3",
    "vitest": "^4.1.0"
  }
}
```

### src/config.ts
```typescript
export interface Config {
  apiKey: string;
  pageId: string;
  baseUrl?: string;
  enableWrite?: boolean;
}
```

### src/client.ts
```typescript
export class StatuspageClient {
  constructor(private config: Config) {}
  
  async get(endpoint: string, params?: Record<string, string>): Promise<any> {
    // Implement GET request
  }
  
  async post(endpoint: string, body: any): Promise<any> {
    // Implement POST request (write-mode only)
  }
  
  async patch(endpoint: string, body: any): Promise<any> {
    // Implement PATCH request (write-mode only)
  }
  
  async delete(endpoint: string): Promise<any> {
    // Implement DELETE request (write-mode only)
  }
}
```

3. **README.md** - Follow the pattern from infoblox-mcp-server:
- Overview of what the server does
- Installation instructions
- Configuration (API key, page ID)
- Usage examples for both traditional and code-mode
- Links to Statuspage API docs

4. **SPEC.md** - Document:
- API coverage (which endpoints are implemented)
- Tool definitions for each operation
- Example inputs/outputs
- Rate limits and auth

5. **Tests** - Simple registration tests like infoblox-mcp-server:
```typescript
describe("Tool Registration", () => {
  it("should register without errors in read-only mode", () => {
    expect(() => {
      registerToolSet(server, client, { ...config, enableWrite: false });
    }).not.toThrow();
  });
  
  it("should register without errors in write mode", () => {
    expect(() => {
      registerToolSet(server, client, { ...config, enableWrite: true });
    }).not.toThrow();
  });
});
```

6. **.gitignore**:
```
node_modules/
dist/
*.log
.env
.DS_Store
```

7. **vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

8. **tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Steps
1. Create all directory structure
2. Implement client.ts with fetch-based HTTP client
3. Implement traditional tools (pages, components, incidents, subscribers)
4. Add write operations gated behind enableWrite flag
5. Write simple registration tests
6. Create README.md and SPEC.md
7. Run `npm install` and `npm test` to verify
8. Run `npm run build` to verify compilation
9. Create GitHub repo and push

## Success Criteria
- All tests pass (`npm test`)
- Build succeeds (`npm run build`)
- README and SPEC are complete
- Code follows TypeScript + MCP SDK patterns from reference implementations
- GitHub repo created and pushed

## Notes
- Use fetch() for HTTP requests (no axios dependency)
- Keep tests simple like infoblox-mcp-server (registration tests only)
- All write operations MUST be gated behind config.enableWrite check
- Follow zod schema validation pattern for tool inputs
