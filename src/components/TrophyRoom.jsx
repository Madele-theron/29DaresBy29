import { motion } from 'framer-motion';
import { Award, Image as ImageIcon, PlaySquare } from 'lucide-react';
import { useDares } from '../DareContext';
import './TrophyRoom.css';

export const TrophyRoom = () => {
    const { dares } = useDares();
    const completedDares = dares.filter(d => d.status === 'Completed');

    return (
        <div className="container trophy-room-container animate-fade-in">
            <header className="trophy-header">
                <div className="trophy-icon-wrapper">
                    <Award size={48} color="var(--accent-warning)" />
                </div>
                <h1 className="text-gradient-accent">Hall of Fame</h1>
                <p className="trophy-subtitle">The physical proof of momentum. {completedDares.length} / 43 Conquered.</p>
            </header>

            {completedDares.length === 0 ? (
                <div className="empty-trophy-room glass-panel">
                    <h2>The Journey Begins Now</h2>
                    <p>This space will soon be filled with memories, photos, and stories of your conquered dares.</p>
                </div>
            ) : (
                <div className="trophy-grid">
                    {completedDares.map((dare, index) => (
                        <motion.div
                            key={dare.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="trophy-card glass-panel"
                        >
                            <div className="trophy-media-placeholder">
                                <div className="media-overlay">
                                    {index % 2 === 0 ? <ImageIcon size={32} /> : <PlaySquare size={32} />}
                                    <span>Media Evidence</span>
                                </div>
                            </div>
                            <div className="trophy-content">
                                <span className="trophy-date">{dare.completionDate || 'Recently Completed'}</span>
                                <h3>{dare.title}</h3>
                                <p className="shoutout">Shoutout to <strong>{dare.person}</strong></p>
                                <div className="trophy-divider"></div>
                                <p className="trophy-reflection">
                                    "Nailed it! It was tough getting started, but pushing through the resistance made the accomplishment so much sweeter."
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
