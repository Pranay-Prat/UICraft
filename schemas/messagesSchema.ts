export type Fragment = {
  id: string;
  messageId:string
  sandboxUrl: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files?: unknown | any;
  createdAt: Date | string;
  updatedAt: Date | string;
};


    export type Message = {
    id: string;
    content: string;
    role: "USER" | "ASSISTANT";
    type: "RESULT" | "ERROR" ;
    createdAt: string;
    updatedAt: string;
    projectId: string;
    fragments?: Fragment | null;
    };
