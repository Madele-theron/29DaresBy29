import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle, Calendar, Target } from 'lucide-react';
import { useDares } from '../DareContext';
import './DareDetails.css';

export const DareDetails = () => {
    const { id } = useParams();
    const { dares, updateDare } = useDares();
    const dare = dares.find(d => d.id === parseInt(id));

    if (!dare) return <div className="container">Dare not found</div>;

    const renderTracker = () => {
        switch (dare.type) {
            case 'event-based':
                return (
                    <div className="tracker-box event-tracker">
                        <h4 className="tracker-title"><Calendar size={18} /> Event Countdown & Prep</h4>
                        <div className="milestone-checklist">
                            <label className="checkbox-item">
                                <input type="checkbox" /> <span>Lock in Date / Registration</span>
                            </label>
                            <label className="checkbox-item">
                                <input type="checkbox" /> <span>Phase 1 Training / Prep</span>
                            </label>
                            <label className="checkbox-item">
                                <input type="checkbox" /> <span>Final Preparation</span>
                            </label>
                        </div>
                    </div>
                );
            case 'skill-based':
                return (
                    <div className="tracker-box skill-tracker">
                        <h4 className="tracker-title"><Target size={18} /> Skill Acquisition Progress</h4>

                        {dare.milestones && dare.milestones.length > 0 ? (
                            <div className="detailed-milestones">
                                <div className="progress-bar-container" style={{ marginBottom: '24px' }}>
                                    <div className="progress-bar" style={{ width: `${(dare.milestones.filter(m => m.completed).length / dare.milestones.length) * 100}%` }}></div>
                                </div>
                                {dare.milestones.map((milestone, idx) => (
                                    <div key={idx} className={`milestone-row ${milestone.completed ? 'completed' : ''}`}>
                                        <label className="checkbox-item milestone-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={milestone.completed || false}
                                                onChange={(e) => {
                                                    const newMilestones = [...dare.milestones];
                                                    newMilestones[idx] = { ...newMilestones[idx], completed: e.target.checked };
                                                    if (e.target.checked && !newMilestones[idx].completedDate) {
                                                        newMilestones[idx].completedDate = new Date().toISOString().split('T')[0];
                                                    }
                                                    updateDare(dare.id, { milestones: newMilestones });
                                                }}
                                            />
                                            <span className={milestone.completed ? 'text-strike' : ''}>{milestone.title}</span>
                                        </label>
                                        <div className="milestone-dates">
                                            <span className="due-date" title="Due Date">Due: {milestone.dueDate}</span>
                                            {milestone.completed && <span className="completed-date" title="Completed Date">✓ {milestone.completedDate}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Default fallback for skill-based dares without defined milestones
                            <>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: dare.status === 'Completed' ? '100%' : dare.status === 'In Progress' ? '40%' : '0%' }}></div>
                                </div>
                                <div className="progress-steps">
                                    <span>Basics</span>
                                    <span>Milestone 1</span>
                                    <span>Mastery</span>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 'qualitative':
            case 'recurring':
            default:
                return (
                    <div className="tracker-box pipeline-tracker">
                        <h4 className="tracker-title">Status Pipeline</h4>
                        <div className="status-pipeline">
                            <div className={`pipeline-step ${dare.status === 'Not Started' || dare.status === 'In Progress' || dare.status === 'Completed' ? 'active' : ''}`}>Not Started</div>
                            <div className="pipeline-line"></div>
                            <div className={`pipeline-step ${dare.status === 'In Progress' || dare.status === 'Completed' ? 'active' : ''}`}>In Progress</div>
                            <div className="pipeline-line"></div>
                            <div className={`pipeline-step ${dare.status === 'Completed' ? 'active' : ''}`}>Nailed It!</div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="container dare-details-page"
        >
            <Link to="/" className="back-link">
                <ChevronLeft size={20} /> Back to Grid
            </Link>

            <header className="details-header glass-panel">
                <div className="status-container" data-status={dare.status}>
                    {dare.status === 'Completed' && <CheckCircle size={16} color="var(--accent-success)" />}
                    <select
                        className="status-dropdown"
                        value={dare.status}
                        onChange={(e) => updateDare(dare.id, { status: e.target.value })}
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <h1 className="text-gradient-accent">{dare.title}</h1>
                <p className="dare-origin">Dared by: <strong>{dare.person}</strong></p>
            </header>

            <div className="details-grid">
                <section className="info-section glass-panel">
                    <h3>The Origin Story</h3>
                    <p className="story-text">This dare was given to push me out of my comfort zone and build memories. To be completed before my 29th birthday.</p>

                    <h3 className="section-divider">The "Done" Criteria</h3>
                    <ul className="criteria-list">
                        <li>Complete the described action thoroughly.</li>
                        <li>Capture photo or video evidence.</li>
                        <li>Write a reflective journal entry.</li>
                    </ul>
                </section>

                <section className="tracker-section glass-panel">
                    <h3>Milestone Tracker</h3>
                    {renderTracker()}

                    <div className="journal-entry">
                        <h3>Captain's Log</h3>
                        <textarea placeholder="Write a conversational update about the struggles, funny failures, and progress..." className="journal-input"></textarea>
                        <div className="media-upload-area">
                            <span>+ Add Video, Link or Photo</span>
                        </div>
                        <button className="btn-primary">Save Update</button>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};
