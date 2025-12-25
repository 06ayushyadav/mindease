export type chatMessge={
    role:"system" | "user" | "assistant",
    content:string
}

export type chatOptions={
    model:string|undefined;
    maxTokens:number|string;
    temperature:number;
    timeoutMs?:number|string;
}

export interface LLMProvider{
    chat(message:chatMessge[],opts:chatOptions):Promise<string>
}