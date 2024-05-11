"use client";
import { useEffect, useState } from 'react';
import API from './api';
import { Board } from './types';
import useApi from './api';

const BoardsPage = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [newBoard, setNewBoard] = useState('');
    const [error, setError] = useState('');



    const API = useApi();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await API.get('boards/');
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [API]);
  

    const addBoard = async () => {
        try {
            const { data } = await API.post('/boards/', { name: newBoard, description: '' });
            setBoards([...boards, data]);
            setNewBoard('');
        } catch (error) {
            setError('Failed to add board');
        }
    };

    const deleteBoard = async (id: number) => {
        try {
            await API.delete(`/boards/${id}/`);
            setBoards(boards.filter(board => board.id !== id));
        } catch (error) {
            setError('Failed to delete board');
        }
    };

    return (
        <div>
            <input
                value={newBoard}
                onChange={(e) => setNewBoard(e.target.value)}
                placeholder="Add new board"
            />
            <button onClick={addBoard}>Add Board</button>
            {boards.map(board => (
                <div key={board.id}>
                    <h3>{board.name}</h3>
                    <button onClick={() => deleteBoard(board.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default BoardsPage;
