'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotKey } from './useHotKey';

interface SpotflyItem {
  id: string;
  title: string;
  description?: string;
  action?: () => void;
}

const DEMO_ITEMS: SpotflyItem[] = [
  {
    id: 'connect-wallet',
    title: 'Connect Wallet',
    description: 'Connect your wallet to start using Spotfly',
  },
  {
    id: 'tusky-stograte',
    title: 'Tusky Stograte',
    description: 'Manage your storage with Tusky',
  },
];

export const Spotfly: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSpotfly = () => {
    setIsOpen((prev) => !prev);
  };

  const closeSpotfly = () => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  // Hotkey handlers
  useHotKey({ key: '/', metaKey: true }, toggleSpotfly);
  useHotKey({ key: 'Escape' }, closeSpotfly);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < DEMO_ITEMS.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      const selectedItem = DEMO_ITEMS[selectedIndex];
      if (selectedItem?.action) {
        selectedItem.action();
      }
    }
  };

  const filteredItems = DEMO_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={closeSpotfly}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              <div className="p-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands..."
                  className="w-full px-4 py-2 text-lg bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => item.action?.()}
                  >
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
