// CardAssignment.tsx
import React, { useState } from "react";
import { Card, User } from "./types";
import useApi from "./api";

interface CardAssignmentProps {
    card: Card;
    users: User[]; // All users eligible to assign
    onAssigned: (card: Card) => void;
}

const CardAssignment: React.FC<CardAssignmentProps> = ({ card, users, onAssigned }) => {
    const API = useApi();
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>(card.assignees.map(u => u.id));
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        setLoading(true);
        try {
            const response = await API.patch<Card>(`/cards/${card.id}/`, { assignee_ids: selectedUserIds });
            onAssigned(response.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <label className="font-semibold">Assign to:</label>
            <select
                multiple
                value={selectedUserIds.map(String)}
                onChange={e => {
                    const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                    setSelectedUserIds(values);
                }}
                className="border rounded px-2 py-1 mt-1"
            >
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                ))}
            </select>
            <button
                onClick={handleAssign}
                className="ml-2 bg-blue-600 text-white px-4 py-1 rounded"
                disabled={loading}
            >
                {loading ? "Saving..." : "Assign"}
            </button>
        </div>
    );
};

export default CardAssignment;
