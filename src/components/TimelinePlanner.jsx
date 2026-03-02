import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ListTodo, ShieldCheck, Trophy } from 'lucide-react';
import { useDares } from '../DareContext';
import './TimelinePlanner.css';

export const TimelinePlanner = () => {
    const [activeTab, setActiveTab] = useState('year');
    const { dares } = useDares();

    const getDaresByStatus = (status) => dares.filter(d => d.status === status);
    const getDaresByType = (type) => dares.filter(d => d.type === type);

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
                    <div className="year-glance-grid">
                        {['Q1: March - May', 'Q2: June - Aug', 'Q3: Sept - Nov', 'Q4: Dec - Feb'].map((q, i) => (
                            <div key={q} className="quarter-column glass-panel">
                                <h3>{q}</h3>
                                <div className="quarter-dares">
                                    {/* Mock distributing some tasks to quarters */}
                                    {dares.slice(i * 10, i * 10 + 6).map(d => (
                                        <div key={d.id} className="mini-dare-card">
                                            <span className="mini-status" data-status={d.status}></span>
                                            <span className="mini-title">{d.title.substring(0, 40)}...</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
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
