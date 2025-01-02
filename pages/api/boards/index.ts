import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { tasks } from '@/mocks/tasks';
import statusOrder from '@/utils/statusOrder';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const boardsCollections = collection(db, 'boards');
  const tasksCollections = collection(db, 'tasks');

  if (req.method === 'POST') {
    try {
      const newBoard = req.body;
      const docRef = await addDoc(boardsCollections, newBoard);

      for (const task of tasks) {
        try {
          await addDoc(tasksCollections, {
            board: docRef.id,
            order: statusOrder(task.status),
            ...task,
          });
        } catch (error) {
          res.status(500).json({ error });
        }
      }

      res
        .status(201)
        .json({ id: docRef.id, message: 'Code criado com sucesso!' });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
