import React, { useEffect, useState } from 'react';
import styles from './board.module.css';
import Logo from '@/assets/Logo';
import EditIcon from '@/assets/icons/Edit';
import { Board } from '@/types/Board';
import { Task } from '@/types/Task';
import AddRouteIcon from '@/assets/icons/AddRound';
import TaskCard from '@/components/TaskCard';
import AddTask from '@/components/AddTask';
import { useRouter } from 'next/router';

export default function BoardPage() {
  const [board, setBoard] = useState<Board>();
  const [tasks, setTasks] = useState<Task[]>();
  const [task, setTask] = useState<null | Task>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState(board?.title);
  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();

  const boardId = typeof router.query.id === 'string' ? router.query.id : '';

  useEffect(() => {
    if (board) {
      setTitle(board.title || '');
    }
  }, [board]);

  useEffect(() => {
    fetch(`/api/tasks?board=${boardId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => setTasks(json))
      .catch((err) => console.error(err));
  }, [boardId]);

  useEffect(() => {
    fetch(`/api/boards/${boardId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => setBoard(json))
      .catch((err) => console.error(err));
  }, [boardId]);

  function handleUpdateBoard(title: string) {
    fetch(`/api/boards/${boardId}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({
        title,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setBoard((prevBoard) => ({
          ...prevBoard,
          ...json,
        }));
      })
      .catch((err) => console.error(err));
  }

  function validateTitle() {
    if (!title || typeof title !== 'string') {
      return null;
    } else {
      handleUpdateBoard(title);
      setIsEdit(false);
    }
  }

  function handleAddTask(task: Task) {
    fetch(`/api/tasks`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        task,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setTasks((prevState) => [...(prevState || []), json]);
        const statusOrder = ['IN_PROGRESS', 'COMPLETED', 'WONT_DO', 'NONE'];
        setTasks((prevState) =>
          prevState?.sort(
            (a, b) =>
              statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
          )
        );
        setIsOpenModal(false);
      })
      .catch((err) => console.error(err));
  }

  function handleUpdateTask(task: Task) {
    fetch(`/api/tasks/${task._id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify({
        task,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setTasks((prevState) =>
          prevState?.map((t) => (t._id === task._id ? task : t))
        );
        const statusOrder = ['IN_PROGRESS', 'COMPLETED', 'WONT_DO', 'NONE'];
        setTasks((prevState) =>
          prevState?.sort(
            (a, b) =>
              statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
          )
        );
        setIsOpenModal(false);
      })
      .catch((err) => console.error(err));
  }

  function handleDeleteTask(_id: string) {
    fetch(`/api/tasks/${_id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        setTasks((prevTasks) => prevTasks?.filter((task) => task._id !== _id));
        setIsOpenModal(false);
      })
      .catch((err) => console.error(err));
  }

  function handleCloseModal() {
    setTask(null);
    setIsOpenModal(false);
  }

  function handleOpenModal() {
    setIsOpenModal(true);
  }

  function handleSelectTask(task: Task) {
    setTask(task);
    setIsOpenModal(true);
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <Logo />
          <input
            className={styles.header_title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsEdit(true)}
          />
          {isEdit ? (
            <button
              className={styles.save_board_title_button}
              onClick={validateTitle}
            >
              Salvar
            </button>
          ) : (
            <EditIcon />
          )}
        </div>
        <p className={styles.header_description}>Tasks to keep organised</p>
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
            onSelectTask={() => handleSelectTask(task)}
          />
        ))}
        <button
          className={`${styles.task_container} ${styles.add_task_container}`}
          style={{ backgroundColor: '#F5E8D5' }}
          onClick={handleOpenModal}
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
      {isOpenModal && (
        <AddTask
          onClose={handleCloseModal}
          _id={task?._id}
          board={boardId}
          name={task === null ? '' : task.name}
          icon={task === null ? '' : task.icon}
          description={task === null ? '' : task.description}
          key={task === null ? '' : task._id}
          statusValue={task === null ? '' : task.status}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </section>
  );
}
