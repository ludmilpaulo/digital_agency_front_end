// CardList.tsx
import React from "react";
import { Card, User } from "./types";
import CardAssignment from "./CardAssignment";
import CardStatus from "./CardStatus";

interface CardListProps {
    cards: Card[];
    users: User[];
    onCardUpdated: (card: Card) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, users, onCardUpdated }) => (
    <div>
        {cards.map(card => (
            <div key={card.id} className="p-4 bg-white rounded shadow mb-3">
                <h4 className="font-bold">{card.title}</h4>
                <div>{card.description}</div>
                <div>Status: <CardStatus card={card} onStatusUpdated={onCardUpdated} /></div>
                <CardAssignment card={card} users={users} onAssigned={onCardUpdated} />
                <div>
                    Assigned:{" "}
                    {card.assignees.map(u => (
                        <span key={u.id} className="inline-block bg-blue-200 px-2 mx-1 rounded">{u.username}</span>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export default CardList;
