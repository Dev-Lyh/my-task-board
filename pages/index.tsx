import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BoardPage() {
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'My Task Board',
        description: 'Tasks to keep organised',
      }),
    })
      .then((res) => res.json())
      .then((json) => router.push(`/board/${json.id}`))
      .catch((err) => console.error(err));
  }, [router]);

  return null;
}
