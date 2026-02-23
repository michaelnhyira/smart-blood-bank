import { useBloodBank } from '@/contexts/BloodBankContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Database } from 'lucide-react';

const StorageManagement = () => {
  const { getTotalUnits, storageCapacity } = useBloodBank();
  const total = getTotalUnits();
  const used = total;
  const available = storageCapacity - used;
  const pct = Math.round((used / storageCapacity) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Storage Management</h1>
        <p className="text-muted-foreground text-sm">Blood storage capacity overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="medical-card">
          <CardContent className="p-6 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Capacity</p>
            <p className="text-3xl font-bold text-foreground">{storageCapacity}</p>
            <p className="text-xs text-muted-foreground">units</p>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Used</p>
            <p className="text-3xl font-bold text-primary">{used}</p>
            <p className="text-xs text-muted-foreground">units</p>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Available</p>
            <p className="text-3xl font-bold text-stock-healthy">{available}</p>
            <p className="text-xs text-muted-foreground">units</p>
          </CardContent>
        </Card>
      </div>

      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" /> Storage Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Capacity Used</span>
              <span className="font-bold text-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="h-4" />
            <p className="text-xs text-muted-foreground">
              {used} of {storageCapacity} storage units occupied. {available} units remaining.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageManagement;
