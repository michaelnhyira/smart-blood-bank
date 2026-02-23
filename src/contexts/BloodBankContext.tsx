import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  BloodStock, UsageRecord, Alert, DonationBooking, BloodType,
  initialStock, initialUsageRecords, initialAlerts,
  STORAGE_CAPACITY, genId, BLOOD_TYPES
} from '@/data/mockData';

interface BloodBankContextType {
  stock: BloodStock[];
  usageRecords: UsageRecord[];
  alerts: Alert[];
  bookings: DonationBooking[];
  storageCapacity: number;
  alertThreshold: number;
  setAlertThreshold: (v: number) => void;
  addStock: (s: Omit<BloodStock, 'id'>) => void;
  recordUsage: (u: Omit<UsageRecord, 'id'>) => void;
  dismissAlert: (id: string) => void;
  addBooking: (b: Omit<DonationBooking, 'id' | 'createdAt' | 'status'>) => void;
  getStockByType: (type: BloodType) => number;
  getTotalUnits: () => number;
  getExpiringStock: (days: number) => BloodStock[];
  getUsedToday: () => number;
  getHighestDemand: () => BloodType;
}

const BloodBankContext = createContext<BloodBankContextType | null>(null);

export const BloodBankProvider = ({ children }: { children: ReactNode }) => {
  const [stock, setStock] = useState<BloodStock[]>(() => {
    const s = localStorage.getItem('bb_stock');
    return s ? JSON.parse(s) : initialStock;
  });
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>(() => {
    const s = localStorage.getItem('bb_usage');
    return s ? JSON.parse(s) : initialUsageRecords;
  });
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const s = localStorage.getItem('bb_alerts');
    return s ? JSON.parse(s) : initialAlerts;
  });
  const [bookings, setBookings] = useState<DonationBooking[]>(() => {
    const s = localStorage.getItem('bb_bookings');
    return s ? JSON.parse(s) : [];
  });
  const [alertThreshold, setAlertThresholdState] = useState<number>(() => {
    const s = localStorage.getItem('bb_threshold');
    return s ? Number(s) : 20;
  });

  useEffect(() => { localStorage.setItem('bb_stock', JSON.stringify(stock)); }, [stock]);
  useEffect(() => { localStorage.setItem('bb_usage', JSON.stringify(usageRecords)); }, [usageRecords]);
  useEffect(() => { localStorage.setItem('bb_alerts', JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { localStorage.setItem('bb_bookings', JSON.stringify(bookings)); }, [bookings]);

  const setAlertThreshold = (v: number) => {
    setAlertThresholdState(v);
    localStorage.setItem('bb_threshold', String(v));
  };

  const checkAndGenerateAlerts = useCallback((currentStock: BloodStock[]) => {
    const newAlerts: Alert[] = [];
    const today = new Date().toISOString().split('T')[0];
    BLOOD_TYPES.forEach(bt => {
      const total = currentStock.filter(s => s.bloodType === bt).reduce((a, s) => a + s.unitsRemaining, 0);
      if (total < alertThreshold && total > 0) {
        const exists = alerts.find(a => a.bloodType === bt && a.type === 'low_stock' && !a.read);
        if (!exists) {
          newAlerts.push({ id: genId(), type: 'low_stock', bloodType: bt, message: `⚠ ${bt} stock critically low (${total} units).`, date: today, read: false });
        }
      }
    });
    currentStock.forEach(s => {
      const daysLeft = Math.ceil((new Date(s.expiryDate).getTime() - Date.now()) / 86400000);
      if (daysLeft <= 3 && daysLeft > 0 && s.unitsRemaining > 0) {
        const exists = alerts.find(a => a.type === 'critical_expiry' && a.message.includes(s.donorName));
        if (!exists) {
          newAlerts.push({ id: genId(), type: 'critical_expiry', bloodType: s.bloodType, message: `🚨 Critical: ${s.bloodType} from ${s.donorName} expires in ${daysLeft} day(s).`, date: today, read: false });
        }
      } else if (daysLeft <= 7 && daysLeft > 3 && s.unitsRemaining > 0) {
        const exists = alerts.find(a => a.type === 'expiry_warning' && a.message.includes(s.donorName));
        if (!exists) {
          newAlerts.push({ id: genId(), type: 'expiry_warning', bloodType: s.bloodType, message: `⚠ ${s.bloodType} from ${s.donorName} expires in ${daysLeft} days.`, date: today, read: false });
        }
      }
    });
    if (newAlerts.length > 0) setAlerts(prev => [...newAlerts, ...prev]);
  }, [alertThreshold, alerts]);

  useEffect(() => { checkAndGenerateAlerts(stock); }, [stock]);

  const addStock = (s: Omit<BloodStock, 'id'>) => {
    setStock(prev => [{ ...s, id: genId() }, ...prev]);
  };

  const recordUsage = (u: Omit<UsageRecord, 'id'>) => {
    setUsageRecords(prev => [{ ...u, id: genId() }, ...prev]);
    setStock(prev => {
      let remaining = u.unitsUsed;
      return prev.map(s => {
        if (s.bloodType === u.bloodType && s.unitsRemaining > 0 && remaining > 0) {
          const deduct = Math.min(s.unitsRemaining, remaining);
          remaining -= deduct;
          return { ...s, unitsRemaining: s.unitsRemaining - deduct };
        }
        return s;
      });
    });
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const addBooking = (b: Omit<DonationBooking, 'id' | 'createdAt' | 'status'>) => {
    setBookings(prev => [...prev, { ...b, id: genId(), createdAt: new Date().toISOString().split('T')[0], status: 'pending' }]);
  };

  const getStockByType = (type: BloodType) => stock.filter(s => s.bloodType === type).reduce((a, s) => a + s.unitsRemaining, 0);
  const getTotalUnits = () => stock.reduce((a, s) => a + s.unitsRemaining, 0);
  const getExpiringStock = (days: number) => stock.filter(s => {
    const d = Math.ceil((new Date(s.expiryDate).getTime() - Date.now()) / 86400000);
    return d <= days && d > 0 && s.unitsRemaining > 0;
  });
  const getUsedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return usageRecords.filter(r => r.date === today).reduce((a, r) => a + r.unitsUsed, 0);
  };
  const getHighestDemand = () => {
    const counts: Record<string, number> = {};
    usageRecords.forEach(r => { counts[r.bloodType] = (counts[r.bloodType] || 0) + r.unitsUsed; });
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'O+') as BloodType;
  };

  return (
    <BloodBankContext.Provider value={{
      stock, usageRecords, alerts, bookings, storageCapacity: STORAGE_CAPACITY,
      alertThreshold, setAlertThreshold, addStock, recordUsage, dismissAlert,
      addBooking, getStockByType, getTotalUnits, getExpiringStock, getUsedToday, getHighestDemand,
    }}>
      {children}
    </BloodBankContext.Provider>
  );
};

export const useBloodBank = () => {
  const ctx = useContext(BloodBankContext);
  if (!ctx) throw new Error('useBloodBank must be used within BloodBankProvider');
  return ctx;
};
