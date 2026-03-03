import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TimelinePlanner.css'; // Inheriting styles

export const DraggableDareCard = ({ dare }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: dare.id, data: { ...dare } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
        position: 'relative',
        zIndex: isDragging ? 999 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`mini-dare-card ${isDragging ? 'dragging' : ''}`}
            {...attributes}
            {...listeners}
        >
            <span className="mini-status" data-status={dare.status}></span>
            <span className="mini-title">{dare.title.substring(0, 40)}{dare.title.length > 40 ? '...' : ''}</span>
        </div>
    );
};
