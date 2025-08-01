// Empowered Habit Tracker - React + Tailwind + Chart.js
// Pages: Home, Profile, Tracker, Summary

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const habits = [
  'Wake up early',
  'Exercise',
  'Meditate',
  'Healthy eating',
  'Read',
  'Gratitude journaling',
  'Work on goal',
  'Sleep 8 hours',
];

export default function App() {
  const [page, setPage] = useState('home');
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('profile')) || { name: '', email: '' });
  const [tracker, setTracker] = useState(() => JSON.parse(localStorage.getItem('tracker')) || {});
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('tracker', JSON.stringify(tracker));
  }, [tracker]);

  const handleHabitChange = (habit, value) => {
    const newEntry = { ...tracker[date], [habit]: value };
    setTracker({ ...tracker, [date]: newEntry });
  };

  const renderHome = () => (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Empowered Habit Tracker</h1>
      <p className="mb-4">Track 8 powerful habits daily and see your progress at the end of the month.</p>
      <button onClick={() => setPage('profile')} className="bg-blue-500 text-white px-4 py-2 rounded">Get Started</button>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Your Profile</h2>
      <input className="w-full border p-2" placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
      <input className="w-full border p-2" placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
      <button onClick={() => setPage('tracker')} className="bg-green-500 text-white px-4 py-2 rounded">Save and Track Habits</button>
    </div>
  );

  const renderTracker = () => (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Track Habits for {date}</h2>
      <input className="border p-2" type="date" value={date} onChange={e => setDate(e.target.value)} />
      {habits.map(habit => (
        <div key={habit} className="flex justify-between items-center border p-2">
          <span>{habit}</span>
          <input
            type="range"
            min="0"
            max="5"
            value={tracker[date]?.[habit] || 0}
            onChange={e => handleHabitChange(habit, +e.target.value)}
          />
          <span>{tracker[date]?.[habit] || 0}</span>
        </div>
      ))}
      <div className="space-x-2">
        <button onClick={() => setPage('summary')} className="bg-blue-600 text-white px-4 py-2 rounded">View Summary</button>
        <button onClick={() => setPage('profile')} className="text-gray-600 underline">Edit Profile</button>
      </div>
    </div>
  );

  const renderSummary = () => {
    const labels = Object.keys(tracker).sort();
    const datasets = habits.map((habit, index) => ({
      label: habit,
      data: labels.map(date => tracker[date]?.[habit] || 0),
      borderColor: `hsl(${index * 45}, 70%, 50%)`,
      fill: false,
    }));

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Monthly Habit Summary</h2>
        <Line data={{ labels, datasets }} />
        <button onClick={() => setPage('tracker')} className="mt-4 bg-gray-700 text-white px-4 py-2 rounded">Back to Tracker</button>
      </div>
    );
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {page === 'home' && renderHome()}
      {page === 'profile' && renderProfile()}
      {page === 'tracker' && renderTracker()}
      {page === 'summary' && renderSummary()}
    </div>
  );
}
