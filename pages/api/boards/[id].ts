import { db } from '../../../firebaseConfig';
import {
  doc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  getDoc,
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

  if (req.method === 'DELETE') {
    try {
      const q = query(tasksCollections, where('board', '==', id));
      const snapshot = await getDocs(q);
      const tasks = snapshot.docs.map((doc) => ({ _id: doc.id }));

      for (const task of tasks) {
        await deleteDoc(doc(db, 'tasks', task._id));
      }

      await deleteDoc(doc(db, 'boards', id));

      res.status(200).json({ id });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { title } = req.body;

      console.log(title)

      await updateDoc(doc(db, 'boards', id), {
        title
      });

      res.status(200).json({ _id: id, title });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else if (req.method === 'GET') {
    try {
      const boardRef = await getDoc(doc(db, 'boards', id));

      res.status(200).json({ _id: boardRef.id, ...boardRef.data() });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
