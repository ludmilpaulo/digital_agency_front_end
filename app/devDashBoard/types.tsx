export interface Board {
    id: number;
    name: string;
    description: string;
    developmentLink?: string;
    repositoryLink?: string;
    clientLink?: string;
    sampleLink?: string;
    users?: number[]; // Array of user IDs
    managers?: number[];
    lists?: List[];
    budget?: number;
    budgetUsed?: number;
    deadline?: string;
    startDate?: string;
    endDate?: string;
    status?: 'Started' | 'In Progress' | 'Concluded';
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface List {
    id: number;
    name: string;
    board: number;
    cards?: Card[];
}

export interface Card {
    id: number;
    title: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    list: number;
    assignees: User[];
    image?: string;
}