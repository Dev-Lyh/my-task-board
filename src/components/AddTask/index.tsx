import React, { useEffect, useState } from 'react';
import styles from './addtask.module.css';
import { icons } from '@/mocks/icons';
import CloseRingDuotone from '@/assets/icons/CloseRingDuotone';
import { status } from '@/mocks/status';
import TimeAttackIcon from '@/assets/icons/TimeAttack';
import DoneRoundIcon from '@/assets/icons/DoneRound';
import CloseRingIcon from '@/assets/icons/CloseRing';
import CheckIcon from '@/assets/icons/Check';
import TrashIcon from '@/assets/icons/Trash';
import { Task } from '@/types/Task';

interface AddTaskProps {
  onClose(): void;
  _id?: string;
  board: string;
  name?: string;
  description?: string;
  icon?: string;
  statusValue?: string;
  onAddTask(task: Task): void;
  onUpdateTask(task: Task): void;
  onDeleteTask(_id: string):void;
}

export default function AddTask({
  onClose,
  _id,
  board,
  name,
  description,
  icon,
  statusValue,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: AddTaskProps) {
  const [iconChoosed, setIconChoosed] = useState<string>(
    icon !== undefined ? icon : 'man-technologist.png'
  );
  const [statusChoosed, setStatusChoosed] = useState<string>(
    statusValue !== undefined ? statusValue : 'none'
  );
  const [taskName, setTaskName] = useState<string>(
    name !== undefined ? name : ''
  );
  const [taskDescription, setTaskDescription] = useState<string>(
    description !== undefined ? description : ''
  );

  function taskStatusColor(status: string) {
    switch (status) {
      case 'IN_PROGRESS':
        return '#E9A23B';
      case 'COMPLETED':
        return '#32D657';
      case 'WONT_DO':
        return '#DD524C';
    }
  }

  function taskStatusCreate(status: string) {
    switch (status) {
      case 'IN_PROGRESS':
        return 'IN_PROGRESS';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'WONT_DO':
        return 'WONT_DO';
      default:
        return 'NONE';
    }
  }

  return (
    <div className={styles.overlay}>
      <section className={styles.modal_container}>
        <div>
          <header className={styles.modal_header}>
            <strong>Task details</strong>
            <button type="button" onClick={onClose}>
              <CloseRingDuotone />
            </button>
          </header>
          <div className={styles.task_name_container}>
            <label htmlFor="task_name">Task name</label>
            <input
              type="text"
              id="task_name"
              name="task_name"
              placeholder="Enter a task name"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
              }}
            />
          </div>
          <div className={styles.task_description_container}>
            <label htmlFor="task_description">Description</label>
            <textarea
              name="task_description"
              id="task_description"
              placeholder="Enter a short description"
              value={taskDescription}
              onChange={(e) => {
                setTaskDescription(e.target.value);
              }}
            ></textarea>
          </div>
          <div className={styles.task_icons_container}>
            <label htmlFor="task_icon">Icon</label>
            <div className={styles.flex_icons_container}>
              {icons.map((icon) => (
                <div className={styles.task_icon_radio_container}>
                  <label
                    htmlFor={icon._id}
                    style={{
                      backgroundColor:
                        iconChoosed === icon.image ? '#F5D565' : '',
                    }}
                  >
                    <img src={`/images/${icon.image}`} alt={icon.image} />
                  </label>
                  <input
                    type="radio"
                    name="task_icons"
                    id={icon._id}
                    value={icon.image}
                    onClick={(e) => setIconChoosed(e.currentTarget.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.task_status_container}>
            <label htmlFor="task_status">Status</label>
            <div className={styles.overall_status_container}>
              {status.map((item) => (
                <button
                  type="button"
                  className={styles.status_container}
                  onClick={() => setStatusChoosed(item.value)}
                  style={{
                    borderColor: statusChoosed === item.value ? '#3662E3' : '',
                    borderWidth: statusChoosed === item.value ? '.2rem' : '',
                  }}
                >
                  <div className={styles.status_label_icon_container}>
                    <div
                      className={styles.status_icon_container}
                      style={{ backgroundColor: taskStatusColor(item.value) }}
                    >
                      {item.value === 'IN_PROGRESS' && <TimeAttackIcon />}
                      {item.value === 'COMPLETED' && <DoneRoundIcon />}
                      {item.value === 'WONT_DO' && <CloseRingIcon />}
                    </div>
                    <p>{item.name}</p>
                  </div>
                  {statusChoosed === item.value && (
                    <div className={styles.circle_check_status}>
                      <CheckIcon />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.actions_container}>
          <div>
            <button
              type="button"
              style={{ backgroundColor: '#97A3B6' }}
              disabled={
                taskName.length === 0 ||
                iconChoosed.length === 0 ||
                statusChoosed.length === 0
              }
              onClick={() => _id !== undefined && onDeleteTask(_id)}
            >
              Delete <TrashIcon />
            </button>
            <button
              type="button"
              style={{ backgroundColor: '#3662E3' }}
              disabled={
                taskName.length === 0 ||
                iconChoosed.length === 0 ||
                statusChoosed.length === 0
              }
              onClick={() =>
                _id == undefined
                  ? onAddTask({
                      board: board,
                      description: taskDescription,
                      icon: iconChoosed,
                      name: taskName,
                      status: taskStatusCreate(statusChoosed),
                    })
                  : onUpdateTask({
                      _id: _id,
                      board: board,
                      description: taskDescription,
                      icon: iconChoosed,
                      name: taskName,
                      status: taskStatusCreate(statusChoosed),
                    })
              }
            >
              Save <CheckIcon />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
