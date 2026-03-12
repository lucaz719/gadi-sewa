export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon?: string;
}

export enum JobStatus {
  NEW = 'New Requests',
  IN_PROGRESS = 'In Progress',
  WAITING = 'Waiting for Parts',
  QC = 'Quality Check',
  READY = 'Ready for Delivery',
  COMPLETED = 'Completed'
}

export interface Job {
  id: string;
  customer: string;
  vehicle: string;
  plate: string;
  tags: string[];
  date: string;
  avatar: string;
  status: JobStatus;
  price?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  checkIn?: string;
  checkOut?: string;
  workingHours?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: string;
  supplier: string;
  image: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}
