export interface Board {
    id: number;
    name: string;
    description: string;
    development_link?: string;
    repository_link?: string;
    client_link?: string;
    sample_link?: string;
    users?: number[]; // Array of user IDs
    managers?: number[];
    lists?: List[];
    budget?: number;
    budgetUsed?: number;
    budget_used?: number;
    deadline?: string;
    start_date?: string;
    end_date?: string;
    status?: 'Started' | 'In Progress' | 'Concluded';
    created_at?: string;
    updated_at?: string;
    can_edit?: boolean; // Permission to edit this board
    can_view?: boolean; // Permission to view this board
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
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Failed' | 'Reassigned' | 'On Hold' | 'Under Review';
    list: number;
    assignees: User[] | number[];
    image?: string;
    start_date?: string;
    due_date?: string;
    completed_date?: string;
    failed_reason?: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
    order?: number;
    estimated_hours?: number;
    actual_hours?: number;
    tags?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: User;
    progress_percentage?: number;
    is_overdue?: boolean;
    assignee_names?: string;
    can_edit?: boolean; // Permission to edit this task/card
    can_view?: boolean; // Permission to view this task/card
}