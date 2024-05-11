export interface Board {
    id: number;
    name: string;
    description: string;
    developmentLink: string;
    repositoryLink: string;
    clientLink: string;
    sampleLink: string;
    users: number[]; // Array of user IDs
    managers: number[];
    budget: number;
    budgetUsed: number;
    deadline: string;
    startDate: string;
    endDate: string;
    status: 'Started' | 'In Progress' | 'Concluded';
}


export interface List {
    id: number;
    name: string;
    board: number;
}

export interface Card {
    id: number;
    title: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    list: number;
    image?: string;
}