import React, { useState, useEffect } from 'react';

export const KeypadModal = ({ isOpen, onClose, onEnter, title = "Enter Quantity", initialValue = "" }: { isOpen: boolean, onClose: () => void, onEnter: (val: string) => void, title?: string, initialValue?: string }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) setValue(initialValue);
    }, [isOpen, initialValue]);

    const handlePress = (key: string | number) => {
        if (key === 'clear') setValue("");
        else if (key === 'backspace') setValue(prev => prev.slice(0, -1));
        else if (key === '.') {
            if (!value.includes('.')) setValue(prev => prev + key);
        }
        else setValue(prev => prev + key.toString());
    };

    const handleSubmit = () => {
        onEnter(value);
        setValue("");
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-xs rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-900 text-right text-3xl font-mono font-bold tracking-widest h-20 flex items-center justify-end border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    {value || <span className="text-slate-400">0</span>}
                </div>
                <div className="grid grid-cols-3 gap-1 p-2 bg-slate-50 dark:bg-slate-800">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace'].map((key) => (
                        <button
                            key={key}
                            onClick={() => handlePress(key)}
                            className={`h-16 text-2xl font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center ${key === 'backspace' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-white dark:bg-[#16222d] text-slate-900 dark:text-white shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            {key === 'backspace' ? <span className="material-symbols-outlined">backspace</span> : key}
                        </button>
                    ))}
                </div>
                <div className="p-2 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => handlePress('clear')} className="py-3 font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Clear</button>
                    <button onClick={handleSubmit} className="py-3 font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-md transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">check</span> Enter
                    </button>
                </div>
            </div>
        </div>
    );
};
