import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const boardsCollections = collection(db, 'boards');

  if (req.method === 'GET') {
    try {
      const snapshot = await getDocs(boardsCollections);
      const apps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(apps);
    } catch (error) {
      res.status(500).json({ error });
    }
  } else if (req.method === 'POST') {
    try {
      const newBoard = req.body;
      const docRef = await addDoc(boardsCollections, newBoard);
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
