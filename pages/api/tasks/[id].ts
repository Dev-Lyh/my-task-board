import { db } from '../../../firebaseConfig';
import {
  doc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const tasksCollections = collection(db, 'tasks');

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing ID' });
  }

  if (req.method === 'PUT') {
    try {
      const { task } = req.body;

      const taskRef = doc(db, 'tasks', id);

      await updateDoc(taskRef, {
        board: task.board,
        description: task.description,
        name: task.name,
        icon: task.icon,
        status: task.status,
      });

      res.status(201).json({ task });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else if (req.method === 'DELETE') {
    await deleteDoc(doc(db, 'tasks', id))

    res.status(200).json({ id })
  } 
}
