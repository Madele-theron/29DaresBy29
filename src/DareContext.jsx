import React, { createContext, useState, useContext, useEffect } from 'react';
import { DARES as INITIAL_DARES } from './data/dares';

const DareContext = createContext();

export const useDares = () => useContext(DareContext);

export const DareProvider = ({ children }) => {
    const [dares, setDares] = useState(() => {
        const saved = localStorage.getItem('29dares_state');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return INITIAL_DARES;
            }
        }
        return INITIAL_DARES;
    });

    useEffect(() => {
        localStorage.setItem('29dares_state', JSON.stringify(dares));
    }, [dares]);

    const updateDare = (id, updates) => {
        setDares(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    };

    return (
        <DareContext.Provider value={{ dares, updateDare }}>
            {children}
        </DareContext.Provider>
    );
};
