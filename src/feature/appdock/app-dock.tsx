'use client';

import { useState } from 'react';
import AppIcon from './app-icons';
import AppModal from './app-modal';

const apps = [
  {
    id: 'walrus',
    name: 'Walrus',
    icon: '/icons/walrus.png',
    modalContent: <div>Walrus content</div>,
  },
  {
    id: 'tusky',
    name: 'Tusky',
    icon: '/icons/tusky.svg',
    modalContent: <div>Tusky content</div>,
  },
  {
    id: '7k',
    name: '7K Trading',
    icon: '/icons/7k.jpg',
    modalContent: <div>7K Trading content</div>,
  }  
];

export default function AppDock() {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  return (
    <>
      <div className="fixed top-1/2 right-4 -translate-y-1/2 bg-blue-400/20 backdrop-blur-md p-3 rounded-3xl flex flex-col gap-4 shadow-lg z-999">
        {apps.map((app) => (
          <AppIcon
            key={app.id}
            icon={app.icon}
            label={app.name}
            onClick={() => setActiveApp(app.id)}
          />
        ))}
      </div>

      {apps.map((app) =>
        app.id === activeApp ? (
          <AppModal key={app.id} title={app.name} onClose={() => setActiveApp(null)}>
            {app.modalContent}
          </AppModal>
        ) : null
      )}
    </>
  );
}
