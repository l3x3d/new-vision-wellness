import React from 'react';
import { HealthBotIcon } from './IconComponents';

interface FloatingBotButtonProps {
    onOpen: () => void;
}

const FloatingBotButton: React.FC<FloatingBotButtonProps> = ({ onOpen }) => {
    return (
        <button
            onClick={onOpen}
            className="fixed bottom-6 right-6 bg-sky-600 text-white rounded-full p-3 shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all transform hover:scale-110 z-40 flex items-center justify-center"
            aria-label="Open insurance verification assistant"
        >
            <HealthBotIcon className="h-6 w-6" />
        </button>
    );
};

export default FloatingBotButton;