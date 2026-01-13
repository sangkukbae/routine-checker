import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import './GridCell.css';

interface GridCellProps {
  isCompleted: boolean;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}

export const GridCell = ({ isCompleted, color, onClick, disabled }: GridCellProps) => {
  return (
    <motion.div
      className={`grid-cell ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
    >
      <div 
        className="grid-cell-inner"
        style={{ 
          borderColor: disabled && !isCompleted ? '#e2e8f0' : color,
          backgroundColor: isCompleted ? color : 'transparent',
          opacity: disabled && !isCompleted ? 0.5 : 1
        }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isCompleted ? 1 : 0,
            opacity: isCompleted ? 1 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
            mass: 1,
          }}
        >
          <Check size={14} color="white" strokeWidth={3} />
        </motion.div>
      </div>
    </motion.div>
  );
};
