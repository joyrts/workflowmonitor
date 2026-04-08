import { Workflow, Execution, ChatMessage } from "../types";

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "wf-001",
    name: "Slack Notification on New Lead",
    description: "Send a Slack message when a new lead is added to HubSpot",
    status: "ENABLED",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    lastRunStatus: "SUCCEEDED",
    steps: [
      { id: "s1", type: "TRIGGER", name: "HubSpot: New Contact", valid: true },
      { id: "s2", type: "ACTION", name: "Slack: Send Message", valid: true },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "wf-002",
    name: "Daily Report Email",
    description: "Send a daily summary report via email every morning",
    status: "ENABLED",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    lastRunStatus: "SUCCEEDED",
    steps: [
      { id: "s1", type: "TRIGGER", name: "Schedule: Daily 9AM", valid: true },
      { id: "s2", type: "ACTION", name: "Google Sheets: Read Data", valid: true },
      { id: "s3", type: "ACTION", name: "Gmail: Send Email", valid: true },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "wf-003",
    name: "Sync Airtable to Notion",
    description: "Mirror Airtable records into a Notion database",
    status: "ENABLED",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    lastRunStatus: "FAILED",
    steps: [
      { id: "s1", type: "TRIGGER", name: "Airtable: New Record", valid: true },
      { id: "s2", type: "ACTION", name: "Notion: Create Page", valid: false },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "wf-004",
    name: "Auto-reply to Support Emails",
    description: "Send acknowledgement replies to incoming support emails",
    status: "DISABLED",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    lastRunStatus: "SUCCEEDED",
    steps: [
      { id: "s1", type: "TRIGGER", name: "Gmail: New Email", valid: true },
      { id: "s2", type: "ACTION", name: "Gmail: Send Reply", valid: true },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "wf-005",
    name: "GitHub PR Alert",
    description: "Notify team on Slack when a PR needs review",
    status: "ENABLED",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastRunStatus: "RUNNING",
    steps: [
      { id: "s1", type: "TRIGGER", name: "GitHub: Pull Request", valid: true },
      { id: "s2", type: "CONDITION", name: "Filter: Review Requested", valid: true },
      { id: "s3", type: "ACTION", name: "Slack: Send Message", valid: true },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const MOCK_EXECUTIONS: Execution[] = [
  {
    id: "exec-001",
    flowId: "wf-001",
    flowName: "Slack Notification on New Lead",
    status: "SUCCEEDED",
    startTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    finishTime: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    durationMs: 1230,
    message: "Workflow completed successfully",
  },
  {
    id: "exec-002",
    flowId: "wf-003",
    flowName: "Sync Airtable to Notion",
    status: "FAILED",
    startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    finishTime: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
    durationMs: 890,
    message: "Error: Notion API rate limit exceeded",
  },
  {
    id: "exec-003",
    flowId: "wf-002",
    flowName: "Daily Report Email",
    status: "SUCCEEDED",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    finishTime: new Date(Date.now() - 1000 * 60 * 60 * 8 + 2500).toISOString(),
    durationMs: 2500,
    message: "Report sent to 3 recipients",
  },
  {
    id: "exec-004",
    flowId: "wf-005",
    flowName: "GitHub PR Alert",
    status: "RUNNING",
    startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    message: "Processing step 2 of 3",
  },
  {
    id: "exec-005",
    flowId: "wf-001",
    flowName: "Slack Notification on New Lead",
    status: "SUCCEEDED",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    finishTime: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1100).toISOString(),
    durationMs: 1100,
    message: "Workflow completed successfully",
  },
  {
    id: "exec-006",
    flowId: "wf-003",
    flowName: "Sync Airtable to Notion",
    status: "SUCCEEDED",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    finishTime: new Date(Date.now() - 1000 * 60 * 60 * 4 + 950).toISOString(),
    durationMs: 950,
    message: "3 records synced",
  },
];

export const MOCK_AI_RESPONSE = (prompt: string): string => {
  const lower = prompt.toLowerCase();
  if (lower.includes("slack") || lower.includes("notify")) {
    return `I'll create a workflow that sends a Slack notification. Here's what I've designed:\n\n**Trigger:** When a new event occurs\n**Action:** Send a formatted message to your Slack channel\n\nThis workflow will automatically notify your team in real-time.`;
  }
  if (lower.includes("email") || lower.includes("gmail")) {
    return `Great idea! I'll set up an email automation workflow:\n\n**Trigger:** Scheduled or event-based\n**Action 1:** Fetch data from your source\n**Action 2:** Send a formatted email via Gmail\n\nThe workflow is ready to create.`;
  }
  if (lower.includes("sheet") || lower.includes("airtable") || lower.includes("notion")) {
    return `I've designed a data sync workflow:\n\n**Trigger:** New row / record created\n**Action 1:** Read and transform data\n**Action 2:** Write to destination\n\nThis will keep your databases in perfect sync.`;
  }
  return `I've analysed your request and designed a workflow:\n\n**Trigger:** Based on your input\n**Action:** Automated task execution\n\nI can refine this further — just describe any specific tools or conditions you want to include.`;
};
