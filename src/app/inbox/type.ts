export interface Message {
    sender: string;
    content: string;
    timestamp: string;
    role: 'auditor' | 'carrier' | 'client';
  }
  
  export interface AuditIssue {
    id: number;
    invoiceNumber: string;
    carrier: string;
    status: 'open' | 'pending' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    lastUpdate: string;
    messages: Message[];
  }
  export interface Attachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }