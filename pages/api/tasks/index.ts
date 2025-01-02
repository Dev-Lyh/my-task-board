import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tasksCollections = collection(db, 'tasks');

  if (req.method === 'GET') {
    const { board } = req.query;

    try {
      const q = query(tasksCollections, where('board', '==', board));
      const snapshot = await getDocs(q);

      const tasks = snapshot.docs.map((doc) => ({
        _id: doc.id,
        board: doc.data().board,
        description: doc.data().description,
        icon: doc.data().icon,
        name: doc.data().name,
        status: doc.data().status,
      }));

      const statusOrder = ['IN_PROGRESS', 'COMPLETED', 'WONT_DO', 'NONE'];
      tasks.sort(
        (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
      );

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error });
    }
  } else if (req.method === 'POST') {
    const { task } = req.body;

    switch (task.status) {
      case 'IN_PROGRESS':
        task.order = 1;
        break;
      case 'COMPLETED':
        task.order = 2;
        break;
      case 'WONT_DO':
        task.order = 3;
        break;
      case 'NONE':
        task.order = 4;
        break;
    }

    const docRef = await addDoc(tasksCollections, task);

    res.status(201).json({ id: docRef.id, ...task });

    console.log(task);
  }
}
