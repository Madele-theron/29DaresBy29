import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableDareCard } from './DraggableDareCard';
import './TimelinePlanner.css';

export const QuarterColumn = ({ id, title, dares }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`quarter-column glass-panel ${isOver ? 'drop-target' : ''}`}
        >
            <h3>{title}</h3>
            <div className="quarter-dares">
                <SortableContext
                    id={id}
                    items={dares.map(d => d.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {dares.map((dare) => (
                        <DraggableDareCard key={dare.id} dare={dare} />
                    ))}
                </SortableContext>
                {dares.length === 0 && (
                    <div className="empty-quarter-dropzone">Drop dares here</div>
                )}
            </div>
        </div>
    );
};
