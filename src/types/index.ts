export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Medication {
  id: string;
  name: string;
  description?: string;
  dosage: string;
}

export interface Schedule {
  id: string;
  userId: string;
  medicationId: string;
  time: Date;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  medication: Medication;
  user: User;
}
