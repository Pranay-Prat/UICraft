    export type Fragment = {
    id: string;
    messageId: string;
    sandboxUrl: string;
    title: string;
    files?: unknown;
    createdAt: string;
    updatedAt: string;
    };

    export type Message = {
    id: string;
    content: string;
    role: "USER" | "ASSISTANT" | "SYSTEM";
    type: "TEXT" | "ERROR" | "CODE";
    createdAt: string;
    updatedAt: string;
    projectId: string;
    fragments?: Fragment | null;
    };
