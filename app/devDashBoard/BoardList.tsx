import axios from 'axios';
import { useEffect, useState } from 'react';
import { Board } from './types';

const BoardList = ({ userId }: { userId: number }) => {
    const [boards, setBoards] = useState<Board[]>([]);

    useEffect(() => {
        axios.get(`/api/boards/?user_id=${userId}`)
            .then(response => {
                setBoards(response.data);
            })
            .catch(error => console.log('Error fetching boards:', error));
    }, [userId]);

    return (
        <div>
            {boards.map(board => (
                <div key={board.id}>
                    <h1>{board.name}</h1>
                    {/* Display other board details */}
                </div>
            ))}
        </div>
    );
};