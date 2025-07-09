// CardStatus.tsx
import React from "react";
import { Card } from "./types";
import useApi from "./api";

interface CardStatusProps {
    card: Card;
    onStatusUpdated: (card: Card) => void;
}

const CardStatus: React.FC<CardStatusProps> = ({ card, onStatusUpdated }) => {
    const API = useApi();

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Card["status"];
        const response = await API.patch<Card>(`/cards/${card.id}/`, { status: newStatus });
        onStatusUpdated(response.data);
    };

    return (
        <select value={card.status} onChange={handleChange} className="border rounded px-2 py-1">
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
        </select>
    );
};

export default CardStatus;
