import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ListTodo, ShieldCheck, Trophy, ArrowUpDown } from 'lucide-react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDares } from '../DareContext';
import { QuarterColumn } from './QuarterColumn';
import { DraggableDareCard } from './DraggableDareCard';
import './TimelinePlanner.css';

const QUARTERS = [
    { id: 'Q1', title: 'Q1: March - May' },
    { id: 'Q2', title: 'Q2: June - Aug' },
    { id: 'Q3', title: 'Q3: Sept - Nov' },
    { id: 'Q4', title: 'Q4: Dec - Feb' }
];

export const TimelinePlanner = () => {
    const [activeTab, setActiveTab] = useState('year');
    const [activeDragDare, setActiveDragDare] = useState(null);
    const { dares, updateDare } = useDares();

    const getDaresByStatus = (status) => dares.filter(d => d.status === status);
    const getDaresByType = (type) => dares.filter(d => d.type === type);

    // Sort items by status: In Progress (0) -> Not Started (1) -> Completed (2)
    const sortedDares = [...dares].sort((a, b) => {
        const order = { 'In Progress': 0, 'Not Started': 1, 'Completed': 2 };
        return order[a.status] - order[b.status];
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        const dare = dares.find(d => d.id === active.id);
        setActiveDragDare(dare);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeDare = dares.find(d => d.id === active.id);
        const overId = over.id;

        // Find the quarter we are hovering over (could be a column or an item in a column)
        const overQuarterId = QUARTERS.find(q => q.id === overId) ? overId : dares.find(d => d.id === overId)?.quarter;

        if (!overQuarterId) return;

        if (activeDare.quarter !== overQuarterId) {
            // We update during dragOver so the item snaps into the new column visually 
            // and React re-renders it in the right SortableContext before we drop.
            updateDare(activeDare.id, { quarter: overQuarterId });
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragDare(null);

        if (!over) return;

        const activeDare = dares.find(d => d.id === active.id);
        const overId = over.id;
        const overQuarterId = QUARTERS.find(q => q.id === overId) ? overId : dares.find(d => d.id === overId)?.quarter;

        if (overQuarterId && activeDare.quarter !== overQuarterId) {
            updateDare(activeDare.id, { quarter: overQuarterId });
        }
    };

    const handleSortAllByStatus = () => {
        const confirmSort = window.confirm("This will organize all quarters so 'In Progress' items are at the top. Continue?");
        if (confirmSort) {
            const reordered = [...dares].sort((a, b) => {
                const order = { 'In Progress': 0, 'Not Started': 1, 'Completed': 2 };
                return order[a.status] - order[b.status];
            });

            reordered.forEach((dare) => updateDare(dare.id, { ...dare }));
        }
    };

    return (
        <div className="container timeline-container animate-fade-in">
            <header className="timeline-header">
                <h1 className="text-gradient">Planning & Progress</h1>
                <p className="timeline-subtitle">Pacing out the 43 challenges across the year.</p>
            </header>

            <div className="timeline-tabs p-glass">
                <button className={activeTab === 'year' ? 'active' : ''} onClick={() => setActiveTab('year')}>
                    <CalendarDays size={18} /> Year-at-a-Glance
                </button>
                <button className={activeTab === 'prep' ? 'active' : ''} onClick={() => setActiveTab('prep')}>
                    <ListTodo size={18} /> Prep Phase
                </button>
                <button className={activeTab === 'consistency' ? 'active' : ''} onClick={() => setActiveTab('consistency')}>
                    <ShieldCheck size={18} /> Consistency Grid
                </button>
                <button className={activeTab === 'victory' ? 'active' : ''} onClick={() => setActiveTab('victory')}>
                    <Trophy size={18} /> Victory Roll
                </button>
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="timeline-content"
            >
                {activeTab === 'year' && (
                    <div className="year-glance-wrapper">
                        <div className="timeline-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                            <button className="filter-btn active" onClick={handleSortAllByStatus} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ArrowUpDown size={16} /> Sort by Status
                            </button>
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="year-glance-grid">
                                {QUARTERS.map(q => {
                                    const colDares = sortedDares.filter(d => d.quarter === q.id && d.type !== 'recurring');
                                    return (
                                        <QuarterColumn
                                            key={q.id}
                                            id={q.id}
                                            title={q.title}
                                            dares={colDares}
                                        />
                                    );
                                })}
                            </div>
                            <DragOverlay>
                                {activeDragDare ? <DraggableDareCard dare={activeDragDare} /> : null}
                            </DragOverlay>
                        </DndContext>
                    </div>
                )}

                {activeTab === 'prep' && (
                    <div className="prep-phase-section glass-panel">
                        <h2>On Deck (Preparation Phase)</h2>
                        <div className="prep-list">
                            {getDaresByStatus('In Progress').map(dare => (
                                <div key={dare.id} className="prep-item">
                                    <div className="prep-header">
                                        <h4>{dare.title}</h4>
                                        <span className="prep-tag">{dare.category}</span>
                                    </div>
                                    <ul className="action-steps">
                                        <li><input type="checkbox" /> Research and initial planning</li>
                                        <li><input type="checkbox" /> Commit to a date or schedule</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'consistency' && (
                    <div className="consistency-section glass-panel">
                        <h2>Monthly / Recurring Dares</h2>
                        <div className="consistency-grid-container">
                            {getDaresByType('recurring').map(dare => (
                                <div key={dare.id} className="recurring-row">
                                    <div className="recurring-info">
                                        <h4>{dare.title}</h4>
                                    </div>
                                    <div className="months-grid">
                                        {['M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F'].map((m, idx) => (
                                            <div key={idx} className={`month-box ${idx < 2 ? 'completed' : ''}`}>
                                                {m}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'victory' && (
                    <div className="victory-roll">
                        {getDaresByStatus('Completed').map((dare, index) => (
                            <div key={dare.id} className="victory-item glass-panel">
                                <div className="victory-timeline-node"></div>
                                <div className="victory-content">
                                    <div className="victory-meta">
                                        <span className="victory-date">{dare.completionDate || 'Recently Completed'}</span>
                                        <span className="victory-category">{dare.category}</span>
                                    </div>
                                    <h3>{dare.title}</h3>
                                    <p className="victory-journal">"Nailed it! It was tough getting started, but pushing through the resistance made the accomplishment so much sweeter. Huge thanks to {dare.person} for this one."</p>
                                </div>
                            </div>
                        ))}
                        {getDaresByStatus('Completed').length === 0 && (
                            <div className="empty-state text-center text-muted">No dares completed yet. The journey begins!</div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
