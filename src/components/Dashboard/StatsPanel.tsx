import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import { useHabitStore } from '../../store/useHabitStore';
import {
	calculateMonthlyStats,
	calculateCurrentStreak,
} from '../../lib/habit-utils';

export const StatsPanel = () => {
	const { habits, records, currentDate } = useHabitStore();

	const { totalCompletionRate } = useMemo(
		() => calculateMonthlyStats(habits, records, currentDate),
		[habits, records, currentDate]
	);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4"
			>
				<div className="p-3 bg-yellow-100 rounded-xl">
					<Trophy className="h-6 w-6 text-yellow-600" />
				</div>
				<div>
					<p className="text-sm text-slate-500 font-medium">월간 달성률</p>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-bold">{totalCompletionRate}%</span>
						<div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-yellow-500"
								initial={{ width: 0 }}
								animate={{ width: `${totalCompletionRate}%` }}
								transition={{ duration: 1, ease: 'easeOut' }}
							/>
						</div>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col gap-3"
			>
				<div className="flex items-center gap-2">
					<div className="p-2 bg-orange-100 rounded-lg">
						<Zap className="h-4 w-4 text-orange-600" />
					</div>
					<p className="text-sm text-slate-500 font-medium">
						현재 연속 달성 중
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<AnimatePresence mode="popLayout">
						{habits.map(habit => {
							const streak = calculateCurrentStreak(habit.id, records);
							if (streak === 0) return null;
							return (
								<motion.div
									key={habit.id}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 0.8, opacity: 0 }}
									className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
									style={{
										backgroundColor: `${habit.color}20`,
										color: habit.color,
									}}
								>
									<span
										className="w-1.5 h-1.5 rounded-full"
										style={{ backgroundColor: habit.color }}
									/>
									{habit.name}: {streak}일
								</motion.div>
							);
						})}
					</AnimatePresence>
					{habits.every(h => calculateCurrentStreak(h.id, records) === 0) && (
						<p className="text-xs text-slate-400 italic">
							아직 진행 중인 스트릭이 없습니다. 화이팅!
						</p>
					)}
				</div>
			</motion.div>
		</div>
	);
};
