# Statuspage MCP Server - API Specification

## Overview

This MCP server provides programmatic access to the Atlassian Statuspage API for managing status pages, components, incidents, and subscribers.

## Authentication

**Method:** OAuth 2.0  
**Header:** `Authorization: OAuth {api_key}`

Get your API key from: Account Settings → API Info

## Base URL

```
https://api.statuspage.io/v1
```

## Rate Limits

- **60 requests per minute** per API key
- Exceeding limits returns `429 Too Many Requests`

## Traditional Mode Tools

### Pages

#### list_pages
List all status pages accessible with the API key.

**Input:** None  
**Output:** Array of page objects

```json
{
  "id": "abc123",
  "name": "Status Page",
  "url": "https://status.example.com",
  "subdomain": "example",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### get_page
Get details of a specific status page.

**Input:**
- `page_id` (optional): Page ID (uses configured page if omitted)

**Output:** Page object with full details

---

### Components

#### list_components
List all components for the status page.

**Input:**
- `page_id` (optional): Page ID

**Output:** Array of component objects

```json
{
  "id": "comp123",
  "name": "API",
  "status": "operational",
  "description": "Core API service",
  "group_id": null,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### get_component
Get details of a specific component.

**Input:**
- `component_id`: Component ID
- `page_id` (optional): Page ID

**Output:** Component object

#### create_component ⚠️ Write
Create a new component.

**Input:**
- `name`: Component name
- `description` (optional): Component description
- `status` (optional): operational | under_maintenance | degraded_performance | partial_outage | major_outage
- `group_id` (optional): Component group ID
- `page_id` (optional): Page ID

**Output:** Created component object

#### update_component ⚠️ Write
Update an existing component.

**Input:**
- `component_id`: Component ID
- `name` (optional): New name
- `description` (optional): New description
- `status` (optional): New status
- `page_id` (optional): Page ID

**Output:** Updated component object

#### delete_component ⚠️ Write
Delete a component.

**Input:**
- `component_id`: Component ID
- `page_id` (optional): Page ID

**Output:** Deletion confirmation

#### update_component_status ⚠️ Write
Quick status update for a component.

**Input:**
- `component_id`: Component ID
- `status`: operational | under_maintenance | degraded_performance | partial_outage | major_outage
- `page_id` (optional): Page ID

**Output:** Updated component object

---

### Incidents

#### list_incidents
List incidents for the status page.

**Input:**
- `page_id` (optional): Page ID
- `limit` (optional): Maximum number to return

**Output:** Array of incident objects

```json
{
  "id": "inc123",
  "name": "Database Outage",
  "status": "investigating",
  "impact": "major",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T01:00:00Z",
  "resolved_at": null
}
```

#### get_incident
Get details of a specific incident.

**Input:**
- `incident_id`: Incident ID
- `page_id` (optional): Page ID

**Output:** Incident object with full details and updates

#### create_incident ⚠️ Write
Create a new incident.

**Input:**
- `name`: Incident title
- `status`: investigating | identified | monitoring | resolved
- `impact_override` (optional): none | minor | major | critical
- `body` (optional): Incident message
- `component_ids` (optional): Array of affected component IDs
- `components` (optional): Object of component_id: status mappings
- `page_id` (optional): Page ID

**Output:** Created incident object

**Example:**
```json
{
  "name": "API Degradation",
  "status": "investigating",
  "impact_override": "major",
  "body": "We are investigating slow API response times.",
  "component_ids": ["comp123"],
  "components": {
    "comp123": "degraded_performance"
  }
}
```

#### update_incident ⚠️ Write
Add an update to an existing incident.

**Input:**
- `incident_id`: Incident ID
- `status` (optional): New status
- `body`: Update message
- `impact_override` (optional): New impact level
- `component_ids` (optional): Updated affected components
- `components` (optional): Updated component statuses
- `page_id` (optional): Page ID

**Output:** Updated incident object

**Example:**
```json
{
  "incident_id": "inc123",
  "status": "resolved",
  "body": "Issue has been resolved. All systems operational."
}
```

#### delete_incident ⚠️ Write
Delete an incident.

**Input:**
- `incident_id`: Incident ID
- `page_id` (optional): Page ID

**Output:** Deletion confirmation

---

### Subscribers

#### list_subscribers
List all subscribers to the status page.

**Input:**
- `page_id` (optional): Page ID
- `limit` (optional): Maximum number to return

**Output:** Array of subscriber objects

```json
{
  "id": "sub123",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00Z",
  "component_ids": ["comp123"]
}
```

#### create_subscriber ⚠️ Write
Add a new subscriber.

**Input:**
- `email`: Subscriber email address
- `component_ids` (optional): Specific components to subscribe to (all if omitted)
- `page_id` (optional): Page ID

**Output:** Created subscriber object

#### delete_subscriber ⚠️ Write
Remove a subscriber.

**Input:**
- `subscriber_id`: Subscriber ID
- `page_id` (optional): Page ID

**Output:** Deletion confirmation

---

## Code Mode

### Resource: statuspage-api-schema
Provides the full API schema as JSON for agent reference.

### Tool: execute_api_call
Execute arbitrary Statuspage API calls.

**Input:**
- `method`: GET | POST | PATCH | DELETE
- `endpoint`: API endpoint (e.g., "pages/{page_id}/incidents")
- `body` (optional): Request body for POST/PATCH
- `params` (optional): Query parameters for GET

**Output:** API response

**Example:**
```json
{
  "method": "POST",
  "endpoint": "pages/abc123/incidents",
  "body": {
    "incident": {
      "name": "Scheduled Maintenance",
      "status": "investigating",
      "body": "We will be performing maintenance from 2-4 AM UTC."
    }
  }
}
```

---

## Status Values

### Component Status
- `operational` — All systems normal
- `under_maintenance` — Scheduled maintenance in progress
- `degraded_performance` — Service is slow or unstable
- `partial_outage` — Some functionality unavailable
- `major_outage` — Service completely unavailable

### Incident Status
- `investigating` — Issue identified, investigating cause
- `identified` — Cause identified, working on fix
- `monitoring` — Fix deployed, monitoring for stability
- `resolved` — Issue completely resolved

### Impact Override
- `none` — No impact to services
- `minor` — Minor impact, most users unaffected
- `major` — Significant impact to many users
- `critical` — Complete outage, all users affected

---

## Error Handling

All API errors return standard HTTP status codes:
- `400` — Bad Request (invalid input)
- `401` — Unauthorized (invalid API key)
- `404` — Not Found (resource doesn't exist)
- `429` — Too Many Requests (rate limit exceeded)
- `500` — Internal Server Error

---

## References

- [Statuspage API Documentation](https://developer.statuspage.io/)
- [API Reference](https://developer.statuspage.io/#tag/pages)
- [Rate Limits](https://developer.statuspage.io/#section/Rate-Limiting)
