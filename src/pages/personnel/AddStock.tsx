import { useState } from 'react';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { BLOOD_TYPES, BloodType } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RBC_SHELF_LIFE_DAYS = 42;

const AddStock = () => {
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>('O+');
  const [units, setUnits] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const { addStock } = useBloodBank();
  const { toast } = useToast();

  const expiryDate = collectionDate
    ? (() => {
        const d = new Date(collectionDate);
        d.setDate(d.getDate() + RBC_SHELF_LIFE_DAYS);
        return d.toISOString().split('T')[0];
      })()
    : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStock({
      donorName, donorPhone, donorEmail, bloodType,
      unitsCollected: Number(units), unitsRemaining: Number(units),
      collectionDate, expiryDate,
    });
    toast({ title: 'Stock Added', description: `${units} unit(s) of ${bloodType} added successfully.` });
    setDonorName(''); setDonorPhone(''); setDonorEmail(''); setUnits(''); setCollectionDate('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Blood Stock</h1>
        <p className="text-muted-foreground text-sm">Record a new blood collection</p>
      </div>
      <Card className="medical-card max-w-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Donor Name</Label>
              <Input value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Full name" required />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} placeholder="donor@example.com" required />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={donorPhone} onChange={e => setDonorPhone(e.target.value)} placeholder="0241234567" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Blood Type</Label>
                <Select value={bloodType} onValueChange={v => setBloodType(v as BloodType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Units Collected</Label>
                <Input type="number" min="1" value={units} onChange={e => setUnits(e.target.value)} placeholder="1" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Collection Date</Label>
                <Input type="date" value={collectionDate} onChange={e => setCollectionDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date (auto: 42 days)</Label>
                <Input type="date" value={expiryDate} readOnly className="bg-muted" />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add to Inventory
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStock;
