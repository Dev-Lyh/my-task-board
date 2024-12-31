import React, { useState } from 'react';
import styles from './board/board.module.css';
import Logo from '@/assets/Logo';
import EditIcon from '@/assets/icons/Edit';
import { Board } from '@/types/Board';
import { Task } from '@/types/Task';
import AddRouteIcon from '@/assets/icons/AddRound';
import TaskCard from '@/components/TaskCard';

export default function BoardPage() {
  const [board, setBoard] = useState<Board>();
  const [tasks, setTasks] = useState<Task[]>([
    {
      _id: 'a',
      board: '',
      icon: 'clock.png',
      name: 'Task in Progress',
      description: '',
      status: 'IN_PROGRESS',
    },
    {
      _id: 'b',
      board: '',
      icon: 'person-lifting-weights.png',
      name: 'Task Completed',
      description: '',
      status: 'COMPLETED',
    },
    {
      _id: 'c',
      board: '',
      icon: 'hot-coffee.png',
      name: "Task Won't Do",
      description: '',
      status: 'WONT_DO',
    },
    {
      _id: 'd',
      board: '',
      icon: 'books.png',
      name: 'Task To Do',
      description:
        'Work on a challenge on devChallenges.io and learn TypeScript.',
      status: 'NONE',
    },
  ]);

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <Logo />
          <h1>My Task Board</h1>
          <EditIcon />
        </div>
        <p>Tasks to keep organised</p>
      </header>
      <section className={styles.tasks_container}>
        {tasks?.map((task) => (
          <TaskCard
            _id={task._id}
            board={task.board}
            description={task.description}
            icon={task.icon}
            name={task.name}
            status={task.status}
            key={task._id}
          />
        ))}
        <button
          className={`${styles.task_container} ${styles.add_task_container}`}
          style={{ backgroundColor: '#F5E8D5' }}
        >
          <div className={styles.title_icon_container}>
            <div
              className={styles.task_status_container}
              style={{ backgroundColor: '#E9A23B' }}
            >
              <AddRouteIcon />
            </div>
            <div className={styles.name_description_container}>
              <strong>Add new task</strong>
            </div>
          </div>
        </button>
      </section>
    </section>
  );
}