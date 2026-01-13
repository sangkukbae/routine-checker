import { HabitList } from './components/Habit/HabitList';
import { HabitGrid } from './components/Dashboard/HabitGrid';
import { MonthNavigation } from './components/Dashboard/MonthNavigation';
import { StatsPanel } from './components/Dashboard/StatsPanel';
import './App.css';

function App() {
	return (
		<div className="min-h-screen bg-[#F8FAFC]">
			<header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-2xl">🏃‍♂️</span>
						<h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							Routine Checker
						</h1>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8 space-y-12">
				<section>
					<HabitList />
				</section>

				<section>
					<StatsPanel />
					<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
						<MonthNavigation />
						<HabitGrid />
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;
