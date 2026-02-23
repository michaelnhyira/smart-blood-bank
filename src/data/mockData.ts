export const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const;
export type BloodType = typeof BLOOD_TYPES[number];

export interface BloodStock {
  id: string;
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  bloodType: BloodType;
  unitsCollected: number;
  unitsRemaining: number;
  collectionDate: string;
  expiryDate: string;
}

export interface UsageRecord {
  id: string;
  bloodType: BloodType;
  unitsUsed: number;
  reason: 'Emergency' | 'Surgery' | 'Other';
  date: string;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'expiry_warning' | 'critical_expiry';
  bloodType?: BloodType;
  message: string;
  date: string;
  read: boolean;
}

export interface DonationBooking {
  id: string;
  donorId: string;
  donorName: string;
  bloodType: BloodType;
  preferredDate: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'personnel' | 'donor';
  staffId?: string;
  department?: string;
  bloodType?: BloodType;
  phone?: string;
  lastDonationDate?: string;
  donations?: { date: string; units: number }[];
}

export const genId = () => Math.random().toString(36).substr(2, 9);

const d = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const initialStock: BloodStock[] = [
  { id: genId(), donorName: 'Kwame Asante', donorPhone: '0241234567', bloodType: 'O+', unitsCollected: 3, unitsRemaining: 2, collectionDate: d(-30), expiryDate: d(12) },
  { id: genId(), donorName: 'Ama Serwaa', donorPhone: '0551234567', bloodType: 'O+', unitsCollected: 2, unitsRemaining: 1, collectionDate: d(-25), expiryDate: d(5) },
  { id: genId(), donorName: 'Yaw Mensah', donorPhone: '0271234567', bloodType: 'O+', unitsCollected: 4, unitsRemaining: 4, collectionDate: d(-10), expiryDate: d(30) },
  { id: genId(), donorName: 'Kofi Boateng', donorPhone: '0201234567', bloodType: 'O-', unitsCollected: 2, unitsRemaining: 2, collectionDate: d(-15), expiryDate: d(25) },
  { id: genId(), donorName: 'Efua Nyarko', donorPhone: '0541234567', bloodType: 'O-', unitsCollected: 3, unitsRemaining: 1, collectionDate: d(-35), expiryDate: d(2) },
  { id: genId(), donorName: 'Akua Dufie', donorPhone: '0261234567', bloodType: 'A+', unitsCollected: 5, unitsRemaining: 5, collectionDate: d(-5), expiryDate: d(35) },
  { id: genId(), donorName: 'Nana Agyei', donorPhone: '0501234567', bloodType: 'A+', unitsCollected: 2, unitsRemaining: 2, collectionDate: d(-8), expiryDate: d(32) },
  { id: genId(), donorName: 'Adjoa Mensah', donorPhone: '0231234567', bloodType: 'A+', unitsCollected: 3, unitsRemaining: 3, collectionDate: d(-3), expiryDate: d(37) },
  { id: genId(), donorName: 'Kwesi Appiah', donorPhone: '0571234567', bloodType: 'A-', unitsCollected: 1, unitsRemaining: 1, collectionDate: d(-20), expiryDate: d(20) },
  { id: genId(), donorName: 'Abena Osei', donorPhone: '0211234567', bloodType: 'A-', unitsCollected: 2, unitsRemaining: 1, collectionDate: d(-28), expiryDate: d(6) },
  { id: genId(), donorName: 'Kojo Antwi', donorPhone: '0561234567', bloodType: 'B+', unitsCollected: 4, unitsRemaining: 3, collectionDate: d(-12), expiryDate: d(28) },
  { id: genId(), donorName: 'Esi Asantewaa', donorPhone: '0241234568', bloodType: 'B+', unitsCollected: 2, unitsRemaining: 2, collectionDate: d(-7), expiryDate: d(33) },
  { id: genId(), donorName: 'Papa Kwame', donorPhone: '0551234568', bloodType: 'B-', unitsCollected: 1, unitsRemaining: 1, collectionDate: d(-22), expiryDate: d(15) },
  { id: genId(), donorName: 'Maame Yaa', donorPhone: '0271234568', bloodType: 'B-', unitsCollected: 2, unitsRemaining: 0, collectionDate: d(-40), expiryDate: d(1) },
  { id: genId(), donorName: 'Fiifi Baiden', donorPhone: '0201234568', bloodType: 'AB+', unitsCollected: 3, unitsRemaining: 3, collectionDate: d(-6), expiryDate: d(34) },
  { id: genId(), donorName: 'Akosua Mensah', donorPhone: '0541234568', bloodType: 'AB+', unitsCollected: 2, unitsRemaining: 2, collectionDate: d(-9), expiryDate: d(31) },
  { id: genId(), donorName: 'Yaa Asantewaa', donorPhone: '0261234568', bloodType: 'AB-', unitsCollected: 1, unitsRemaining: 1, collectionDate: d(-18), expiryDate: d(22) },
  { id: genId(), donorName: 'Osei Kwadwo', donorPhone: '0501234568', bloodType: 'AB-', unitsCollected: 2, unitsRemaining: 2, collectionDate: d(-4), expiryDate: d(36) },
  { id: genId(), donorName: 'Adwoa Fremah', donorPhone: '0231234568', bloodType: 'O+', unitsCollected: 3, unitsRemaining: 3, collectionDate: d(-2), expiryDate: d(38) },
  { id: genId(), donorName: 'Kwabena Ofosu', donorPhone: '0571234568', bloodType: 'O+', unitsCollected: 2, unitsRemaining: 2, collectionDate: d(-14), expiryDate: d(26) },
];

export const initialUsageRecords: UsageRecord[] = [
  { id: genId(), bloodType: 'O+', unitsUsed: 2, reason: 'Emergency', date: d(0) },
  { id: genId(), bloodType: 'A+', unitsUsed: 1, reason: 'Surgery', date: d(0) },
  { id: genId(), bloodType: 'O-', unitsUsed: 1, reason: 'Emergency', date: d(-1) },
  { id: genId(), bloodType: 'B+', unitsUsed: 2, reason: 'Surgery', date: d(-1) },
  { id: genId(), bloodType: 'O+', unitsUsed: 3, reason: 'Emergency', date: d(-2) },
  { id: genId(), bloodType: 'AB+', unitsUsed: 1, reason: 'Other', date: d(-2) },
  { id: genId(), bloodType: 'A-', unitsUsed: 1, reason: 'Surgery', date: d(-3) },
  { id: genId(), bloodType: 'O+', unitsUsed: 2, reason: 'Emergency', date: d(-4) },
  { id: genId(), bloodType: 'B-', unitsUsed: 1, reason: 'Emergency', date: d(-5) },
  { id: genId(), bloodType: 'O+', unitsUsed: 1, reason: 'Surgery', date: d(-6) },
  { id: genId(), bloodType: 'A+', unitsUsed: 2, reason: 'Emergency', date: d(-7) },
  { id: genId(), bloodType: 'O-', unitsUsed: 1, reason: 'Other', date: d(-8) },
];

export const initialAlerts: Alert[] = [
  { id: genId(), type: 'low_stock', bloodType: 'B-', message: '⚠ B− stock critically low.', date: d(0), read: false },
  { id: genId(), type: 'expiry_warning', bloodType: 'O-', message: 'O− unit expiring in 2 days.', date: d(0), read: false },
  { id: genId(), type: 'low_stock', bloodType: 'AB-', message: '⚠ AB− stock is running low.', date: d(-1), read: true },
];

export const STORAGE_CAPACITY = 500;

export const weeklyUsageData = [
  { day: 'Mon', units: 8 }, { day: 'Tue', units: 12 }, { day: 'Wed', units: 6 },
  { day: 'Thu', units: 15 }, { day: 'Fri', units: 10 }, { day: 'Sat', units: 4 }, { day: 'Sun', units: 3 },
];

export const monthlyDemandData = [
  { month: 'Sep', demand: 120 }, { month: 'Oct', demand: 145 }, { month: 'Nov', demand: 160 },
  { month: 'Dec', demand: 180 }, { month: 'Jan', demand: 155 }, { month: 'Feb', demand: 170 },
];

export const bloodTypeDemandData = BLOOD_TYPES.map((bt, i) => ({
  type: bt,
  demand: [45, 18, 35, 8, 22, 5, 15, 4][i],
}));

export const aiPredictions = [
  { day: 'Day 1', predicted: 12 }, { day: 'Day 2', predicted: 15 }, { day: 'Day 3', predicted: 9 },
  { day: 'Day 4', predicted: 18 }, { day: 'Day 5', predicted: 14 }, { day: 'Day 6', predicted: 8 },
  { day: 'Day 7', predicted: 11 },
];
