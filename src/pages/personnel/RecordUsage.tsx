import { useState } from 'react';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { BLOOD_TYPES, BloodType } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RecordUsage = () => {
  const [bloodType, setBloodType] = useState<BloodType>('O+');
  const [units, setUnits] = useState('');
  const [reason, setReason] = useState<'Emergency' | 'Surgery' | 'Other'>('Emergency');
  const { recordUsage, getStockByType } = useBloodBank();
  const { toast } = useToast();

  const available = getStockByType(bloodType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(units) > available) {
      toast({ title: 'Error', description: `Only ${available} unit(s) of ${bloodType} available.`, variant: 'destructive' });
      return;
    }
    recordUsage({ bloodType, unitsUsed: Number(units), reason, date: new Date().toISOString().split('T')[0] });
    toast({ title: 'Usage Recorded', description: `${units} unit(s) of ${bloodType} used for ${reason}.` });
    setUnits('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Record Blood Usage</h1>
        <p className="text-muted-foreground text-sm">Log blood units used for medical procedures</p>
      </div>
      <Card className="medical-card max-w-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Blood Type</Label>
              <Select value={bloodType} onValueChange={v => setBloodType(v as BloodType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt} ({getStockByType(bt)} available)</SelectItem>)}</SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Available: {available} units</p>
            </div>
            <div className="space-y-2">
              <Label>Units Used</Label>
              <Input type="number" min="1" max={available} value={units} onChange={e => setUnits(e.target.value)} placeholder="1" required />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select value={reason} onValueChange={v => setReason(v as 'Emergency' | 'Surgery' | 'Other')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <Minus className="w-4 h-4 mr-2" /> Record Usage
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordUsage;
