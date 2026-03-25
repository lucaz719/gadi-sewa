import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { useToast } from '../App';

interface JobCardProps {
  job: any;
  onDragStart: (e: React.DragEvent, id: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDragStart }) => (
  <Link 
    to={`/jobs/${job.id}`} 
    draggable
    onDragStart={(e) => onDragStart(e, job.id)}
    className="block bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing mb-4 group"
  >
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-black text-primary-600 bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full uppercase tracking-widest border border-primary-200 dark:border-primary-800">JOB-{job.id}</span>
      <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-600 transition-all" onClick={(e) => e.preventDefault()}>
        <span className="material-symbols-outlined text-lg">more_horiz</span>
      </button>
    </div>
    
    <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black shadow-inner">
            {job.customer_name?.[0] || 'C'}
        </div>
        <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tighter">{job.customer_name || `Customer #${job.customer_id}`}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job.vehicle_name} • {job.reg_no}</p>
        </div>
    </div>
    
    <div className="flex flex-wrap gap-1.5 mb-4">
      {(job.service_items || '').split(',').slice(0, 2).map((tag: string) => (
        <span key={tag} className="px-2 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100 dark:border-slate-800">{tag.trim() || 'General'}</span>
      ))}
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
       <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
         <span className="material-symbols-outlined text-xs">history_toggle_off</span>
         {new Date(job.created_at).toLocaleDateString()}
       </div>
       <div className="flex items-center gap-2">
           <span className="text-xs font-black text-green-600 tracking-tighter">Rs. {(job.total_amount || 0).toLocaleString()}</span>
       </div>
    </div>
  </Link>
);

export default function JobBoard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const { showToast } = useToast();

  const columns = [
    { id: 'new', title: 'New Requests', color: 'border-blue-500', icon: 'inbox' },
    { id: 'progress', title: 'On Lift', color: 'border-orange-500', icon: 'engineering' },
    { id: 'waiting', title: 'Await Parts', color: 'border-purple-500', icon: 'hourglass_empty' },
    { id: 'qc', title: 'Quality Check', color: 'border-yellow-500', icon: 'fact_check' },
    { id: 'ready', title: 'Ready', color: 'border-green-500', icon: 'verified' },
    { id: 'completed', title: 'Delivered', color: 'border-slate-500', icon: 'task' },
  ];

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await db.getJobs();
      setJobs(data);
    } catch (err) {
      showToast('error', 'Failed to synchronize job board.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('jobId', id.toString());
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

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const id = e.dataTransfer.getData('jobId');
    
    if (id) {
        const jobId = parseInt(id);
        // Optimistic update
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
        
        try {
            await db.updateJob(jobId, { status });
            showToast('success', `Job status updated to ${status}`);
        } catch (err) {
            showToast('error', 'Update synchronization failed.');
            loadJobs(); // Revert
        }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
           <h1 className="text-3xl font-black tracking-tighter">Workflow Pipeline</h1>
           <p className="text-slate-500 text-sm font-medium">Real-time status tracking for active garage units.</p>
        </div>
        <Link to="/jobs/new" className="bg-slate-900 dark:bg-primary-600 hover:bg-black dark:hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-sm">add</span> New Case
        </Link>
      </div>

      {/* Search & Statistics */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input type="text" placeholder="Lookup job, plate or client..." className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all" />
        </div>
        
        <div className="flex gap-2">
            <div className="bg-white dark:bg-[#1e293b] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] font-black uppercase text-slate-400">Live Services</span>
                <span className="font-black text-slate-900 dark:text-white">{jobs.filter(j => j.status === 'progress').length}</span>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <div className="flex gap-4 min-w-max h-full">
          {columns.map((col) => {
            const columnJobs = jobs.filter(j => j.status === col.id);
            return (
                <div 
                    key={col.id} 
                    className={`w-80 flex flex-col h-full rounded-2xl transition-all duration-300 ${dragOverColumn === col.id ? 'bg-primary-500/5 ring-2 ring-primary-500/20' : 'bg-slate-100/50 dark:bg-[#0d141c]/50'}`}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                   <div className={`p-4 border-t-4 ${col.color} bg-white dark:bg-[#1e293b] rounded-t-2xl shadow-sm mb-4 flex justify-between items-center group`}>
                     <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-primary-500 transition-colors">{col.icon}</span>
                        <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300">{col.title}</h3>
                     </div>
                     <span className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">{columnJobs.length}</span>
                   </div>
                   
                   <div className="flex-1 p-3 overflow-y-auto space-y-1">
                     {loading && (
                        <div className="p-8 text-center text-slate-400 font-medium italic animate-pulse text-[10px] uppercase tracking-widest">Querying database...</div>
                     )}
                     {!loading && columnJobs.map(job => (
                       <JobCard key={job.id} job={job} onDragStart={handleDragStart} />
                     ))}
                     {!loading && columnJobs.length === 0 && (
                       <div className="h-40 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl m-1 transition-all group-hover:border-primary-200">
                          <span className="material-symbols-outlined text-3xl mb-2 opacity-20">cloud_queue</span>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Drop items here</p>
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