// Group.tsx
import React, { MouseEvent } from 'react';
import './Group.css'; // Assuming you have a CSS file for styling

interface GroupProps {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatarUrl: string;
  actionLabel?: React.ReactNode;
  onAction?: (e:MouseEvent<HTMLButtonElement>) => void;
}

const Group: React.FC<GroupProps> = ({
  id,
  name,
  lastMessage,
  time,
  avatarUrl,
  actionLabel,
  onAction,
}) => {
  // Determine if the action is 'Leave'
  const isLeaveAction = actionLabel === 'Leave';

  return (
    <div className="group" key={id}>
      <div className="group-avatar">
        <img src={avatarUrl} alt={`${name} avatar`} />
      </div>
      <div className="group-info">
        <div className="group-header">
          <span className="group-name">{name}</span>
        </div>
        <div className="group-last-message">{lastMessage}</div>
      </div>
      <div className="group-action-area">
        {/* Include the Join/Leave button with conditional class */}
        {actionLabel && onAction && (
          <button
            className={`group-action-button ${isLeaveAction ? 'leave-button' : ''}`}
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
        {/* Display the date and time under the button */}
        <span className="group-time">{time}</span>
      </div>
    </div>
  );
};

export default Group;