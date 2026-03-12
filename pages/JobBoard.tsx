import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialJobs = [
  { id: 'JOB-12345', customer: 'John Doe', vehicle: 'Toyota Camry', plate: 'ABC-123', status: 'new', tags: ['Brake Service', 'Inspection'], date: '24/10/24', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'JOB-12346', customer: 'Jane Smith', vehicle: 'Honda Civic', plate: 'XYZ-789', status: 'new', tags: ['Oil Change'], date: '25/10/24', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 'JOB-12340', customer: 'Mike Johnson', vehicle: 'Ford F-150', plate: 'TRK-456', status: 'progress', tags: ['Engine Diagnostic', 'Tire Rotation'], date: '23/10/24', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'JOB-12335', customer: 'Emily Davis', vehicle: 'Nissan Rogue', plate: 'ROG-001', status: 'ready', tags: ['AC Repair'], date: '22/10/24', price: '$450.00', avatar: 'https://i.pravatar.cc/150?u=4' },
];

interface JobCardProps {
  job: any;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDragStart }) => (
  <Link 
    to={`/jobs/${job.id}`} 
    draggable
    onDragStart={(e) => onDragStart(e, job.id)}
    className="block bg-white dark:bg-[#1e293b] p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing mb-3"
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">{job.id}</span>
      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onClick={(e) => e.preventDefault()}><span className="material-symbols-outlined text-lg">more_vert</span></button>
    </div>
    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{job.customer}</h4>
    <p className="text-xs text-slate-500 mb-3">{job.vehicle} • {job.plate}</p>
    
    <div className="flex flex-wrap gap-1.5 mb-3">
      {job.tags.map((tag: string) => (
        <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded border border-slate-200 dark:border-slate-700">{tag}</span>
      ))}
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
       <div className="flex items-center gap-1 text-xs text-slate-500">
         <span className="material-symbols-outlined text-sm">calendar_today</span>
         {job.date}
       </div>
       <div className="flex items-center gap-2">
          {job.price && <span className="text-xs font-bold text-green-600">{job.price}</span>}
          <img src={job.avatar} alt="User" className="w-6 h-6 rounded-full border border-white dark:border-slate-600" />
       </div>
    </div>
  </Link>
);

export default function JobBoard() {
  const [jobs, setJobs] = useState(initialJobs);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const columns = [
    { id: 'new', title: 'New Requests', color: 'border-blue-500' },
    { id: 'progress', title: 'In Progress', color: 'border-orange-500' },
    { id: 'waiting', title: 'Waiting for Parts', color: 'border-purple-500' },
    { id: 'qc', title: 'Quality Check', color: 'border-yellow-500' },
    { id: 'ready', title: 'Ready for Delivery', color: 'border-green-500' },
    { id: 'completed', title: 'Completed', color: 'border-slate-500' },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('jobId', id);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
        setDragOverColumn(colId);
    }
  };

  const handleDragLeave = () => {
      setDragOverColumn(null);
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const id = e.dataTransfer.getData('jobId');
    
    if (id) {
        setJobs(prevJobs => prevJobs.map(job => 
            job.id === id ? { ...job, status } : job
        ));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold">Job Board</h1>
           <p className="text-slate-500 text-sm">Track and manage all vehicle service jobs. Drag cards to update status.</p>
        </div>
        <Link to="/jobs/new" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Job
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input type="text" placeholder="Search by Customer or Reg No." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        {/* Add filters if needed */}
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {columns.map((col) => {
            const columnJobs = jobs.filter(j => j.status === col.id);
            return (
                <div 
                    key={col.id} 
                    className={`w-80 flex flex-col h-full rounded-xl transition-colors ${dragOverColumn === col.id ? 'bg-primary-50 dark:bg-primary-900/10' : 'bg-slate-100 dark:bg-[#0d141c]/50'}`}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                   <div className={`p-3 border-t-4 ${col.color} bg-white dark:bg-[#1e293b] rounded-t-xl shadow-sm mb-2 flex justify-between items-center`}>
                     <h3 className="font-bold text-sm">{col.title}</h3>
                     <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs font-medium">{columnJobs.length}</span>
                   </div>
                   <div className="flex-1 p-2 overflow-y-auto">
                     {columnJobs.map(job => (
                       <JobCard key={job.id} job={job} onDragStart={handleDragStart} />
                     ))}
                     {columnJobs.length === 0 && (
                       <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg m-1">
                          <p className="text-xs">No jobs</p>
                          <p className="text-[10px] mt-1">Drop here</p>
                       </div>
                     )}
                   </div>
                </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}