import React from 'react';
import { Task } from '@/types/Task';
import TimeAttackIcon from '@/assets/icons/TimeAttack';
import DoneRoundIcon from '@/assets/icons/DoneRound';
import CloseRingIcon from '@/assets/icons/CloseRing';
import styles from './taskcard.module.css';

interface TaskCardProps extends Task{
  onSelectTask(): void;
}

export default function TaskCard(
  { _id, board, description, icon, name, status, onSelectTask }: TaskCardProps,
) {
  function taskContainerColor(status: string) {
    switch (status) {
      case 'IN_PROGRESS':
        return '#F5D565';
      case 'COMPLETED':
        return '#A0ECB1';
      case 'WONT_DO':
        return '#F7D4D3';
      case 'NONE':
        return '#E3E8EF';
    }
  }

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

  return (
    <button
      className={styles.task_container}
      style={{ backgroundColor: taskContainerColor(status) }}
      onClick={onSelectTask}
    >
      <div className={styles.title_icon_container}>
        <div className={styles.task_icon_container}>
          <img src={`/images/${icon}`} alt="" />
        </div>
        <div className={styles.name_description_container}>
          <strong>{name}</strong>
          {description.length > 0 && <p>{description}</p>}
        </div>
      </div>
      {status !== 'NONE' && (
        <div
          className={styles.task_status_container}
          style={{ backgroundColor: taskStatusColor(status) }}
        >
          {status === 'IN_PROGRESS' && <TimeAttackIcon />}
          {status === 'COMPLETED' && <DoneRoundIcon />}
          {status === 'WONT_DO' && <CloseRingIcon />}
        </div>
      )}
    </button>
  );
}
