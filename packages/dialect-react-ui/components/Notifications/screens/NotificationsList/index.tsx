import { ThreadId, useThreadMessages } from '@dialectlabs/react-sdk';
import React from 'react';
import { Divider } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import NoNotifications from './NoNotifications';
import { Notification } from './Notification';

const NotificationsList = () => {
  const { notificationsDivider } = useTheme();

  const {
    params: { threadId },
  } = useRoute<{ threadId: ThreadId }>();

  const { messages } = useThreadMessages({ id: threadId });

  if (!messages.length) {
    return <NoNotifications />;
  }

  return (
    <div className="dt-px-4 dt-py-4">
      {messages.map((message, idx) => (
        <React.Fragment key={idx}>
          <Notification
            message={message.text}
            timestamp={message.timestamp.getTime()}
          />
          <Divider className={notificationsDivider} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default NotificationsList;
