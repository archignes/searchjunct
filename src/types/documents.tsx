// documents.tsx


export interface Discussion {
    type: "discussion";
    date: string;
    title: string;
    systems: string[];
    url: string;
    author: string;
    author_label?: string;
    platform?: string;
    excerpts?: [{
        text: string;
        system: string;
    }];
}

export interface MicroPost {
    type: "micro_post";
    date: string;
    title?: string;
    systems: string[];
    text: string;
    url: string;
    author: string;
    author_label?: string;
}

export interface ThesesLink {
    type: "theses_link";
    date: string;
    author: string;
    title: string;
    systems: string[];
    url: string;
}

export interface Document {
    type: "micro_post" | "theses_link" | "discussion";
    date: string;
    title?: string;
    systems: string[];
    text?: string;
    url: string;
    author: string;
    author_label?: string;
    platform?: string;
    excerpts?: [{
        text: string;
        system: string;
    }];
}

