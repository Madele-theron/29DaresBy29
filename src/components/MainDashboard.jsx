import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../data/dares';
import { useDares } from '../DareContext';
import { DareCard } from './DareCard';
import './MainDashboard.css';

export const MainDashboard = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const { dares } = useDares();

    const filteredDares = dares.filter(dare =>
        activeCategory === 'All' ? true : dare.category === activeCategory
    ).sort((a, b) => {
        const statusOrder = { 'In Progress': 0, 'Not Started': 1, 'Completed': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className="dashboard container animate-fade-in">
            <header className="dashboard-header">
                <h1 className="text-gradient">The Grid of 43</h1>
                <p className="dashboard-subtitle">43 Dares to complete before turning 29.</p>
            </header>

            <div className="filter-container glass-panel">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <motion.div layout className="dares-grid">
                <AnimatePresence>
                    {filteredDares.map(dare => (
                        <DareCard key={dare.id} dare={dare} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
