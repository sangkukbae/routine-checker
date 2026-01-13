import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useHabitStore } from '../../store/useHabitStore';

export const MonthNavigation = () => {
	const { currentDate, setMonth } = useHabitStore();

	return (
		<div className="flex items-center justify-between mb-6">
			<h2 className="text-2xl font-bold">
				{format(currentDate, 'yyyy년 MMMM', { locale: ko })}
			</h2>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setMonth(-1)}
					aria-label="이전 달"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					onClick={() => useHabitStore.setState({ currentDate: new Date() })}
				>
					오늘
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() => setMonth(1)}
					aria-label="다음 달"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};
