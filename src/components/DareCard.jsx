import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';
import './DareCard.css';

export const DareCard = ({ dare }) => {
    const getStatusIcon = () => {
        switch (dare.status) {
            case 'Completed': return <CheckCircle size={20} color="var(--accent-success)" />;
            case 'In Progress': return <PlayCircle size={20} color="var(--accent-warning)" />;
            default: return <Circle size={20} color="var(--text-muted)" />;
        }
    };

    const statusClass = dare.status.replace(/\s+/g, '-').toLowerCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
        >
            <Link to={`/dare/${dare.id}`} className={`dare-card glass-panel status-${statusClass}`}>
                <div className="dare-card-header">
                    <span className="dare-category">{dare.category}</span>
                    {getStatusIcon()}
                </div>
                <h3 className="dare-title">{dare.title}</h3>
                <div className="dare-footer">
                    <span className="dare-person">From: {dare.person}</span>
                </div>
            </Link>
        </motion.div>
    );
};
