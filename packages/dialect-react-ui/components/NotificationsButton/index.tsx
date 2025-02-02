import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SWRConfig } from 'swr';
import useMobile from '../../utils/useMobile';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import type { Channel } from '../common/types';
import IconButton from '../IconButton';
import Notifications, { NotificationType } from '../Notifications';

export type PropTypes = {
  dialectId: string;

  bellClassName?: string;
  bellStyle?: object;
  notifications: NotificationType[];
  channels?: Channel[];
  onBackClick?: () => void;
  pollingInterval?: number;
};

function WrappedNotificationsButton(props: PropTypes): JSX.Element {
  const { ui, open, close } = useDialectUiId(props.dialectId);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const [hasNewMessages, setHasNewMessages] = useState(false);

  useOutsideAlerter(wrapperRef, bellRef, close);

  // TODO rewrite with new provider
  // const { messages, checkUnreadMessages } = useDialect();

  // useEffect(() => {
  //   if (!ui?.open) {
  //     setHasNewMessages(checkUnreadMessages('notifications'));
  //   }
  // }, [checkUnreadMessages, messages, ui?.open]);

  // useEffect(() => {
  //   if (ui?.open) {
  //     saveLastReadMessage('notifications', messages[0]?.timestamp);
  //     setHasNewMessages(checkUnreadMessages('notifications'));
  //   }
  // }, [checkUnreadMessages, messages, saveLastReadMessage, ui?.open]);

  const isMobile = useMobile();

  useEffect(() => {
    // Prevent scrolling of backdrop content on mobile
    document.documentElement.classList[ui?.open && isMobile ? 'add' : 'remove'](
      'dt-overflow-hidden',
      'dt-static',
      'sm:dt-overflow-auto'
    );
  }, [ui?.open, isMobile]);

  const { colors, bellButton, icons, modalWrapper, animations } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-col dt-items-end dt-relative',
        colors.primary
      )}
    >
      {hasNewMessages && (
        <div
          className={clsx(
            'dt-absolute dt-h-3 dt-w-3 dt-z-50 dt-rounded-full',
            colors.notificationBadgeColor
          )}
        ></div>
      )}
      <IconButton
        ref={bellRef}
        className={clsx(
          'dt-flex dt-items-center dt-justify-center dt-rounded-full focus:dt-outline-none dt-shadow-md',
          colors.bg,
          bellButton
        )}
        icon={<icons.bell className={clsx('dt-w-6 dt-h-6 dt-rounded-full')} />}
        onClick={ui?.open ? close : open}
      />
      <Transition
        className={modalWrapper}
        show={ui?.open ?? false}
        {...animations.popup}
      >
        <div
          ref={wrapperRef}
          className="dt-w-full dt-h-full"
          // TODO: investigate blur
          // className="dt-w-full dt-h-full bg-white/10"
          // style={{ backdropFilter: 'blur(132px)' }}
        >
          <Notifications
            channels={props.channels}
            notifications={props?.notifications}
            onModalClose={close}
          />
        </div>
      </Transition>
    </div>
  );
}

export default function NotificationsButton(props: PropTypes): JSX.Element {
  const swrOptions = useMemo(
    () => ({
      refreshInterval: props.pollingInterval,
    }),
    [props.pollingInterval]
  );

  // {/* TODO: consider extract the DialectProvider to avoid doubling providers in case multiple instances are used */}
  return (
    <div className="dialect">
      {/* TODO: switch to some sdk config setting */}
      <SWRConfig value={swrOptions}>
        <WrappedNotificationsButton {...props} />
      </SWRConfig>
    </div>
  );
}
