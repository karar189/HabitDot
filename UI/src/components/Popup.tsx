/* eslint-disable */
// @ts-nocheck
import { FC, ReactNode } from 'react';

interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Popup: FC<PopupProps> = ({ isVisible, onClose, children }) => {
    return (
        <>
            {isVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-xs w-full mx-4 sm:mx-auto custom-margin">
                        {children}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
            <style jsx>{`
                @media (min-width: 640px) {
                    .custom-margin {
                        margin-left: 37%;
                        margin-right: auto;
                    }
                }
            `}</style>
        </>
    );
};

export default Popup;
