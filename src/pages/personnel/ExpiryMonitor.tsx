import { useState } from 'react';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { BLOOD_TYPES } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Clock } from 'lucide-react';

const ExpiryMonitor = () => {
  const { stock } = useBloodBank();
  const [filter, setFilter] = useState<string>('all');

  const expiring = stock
    .filter(s => s.unitsRemaining > 0)
    .map(s => {
      const daysLeft = Math.ceil((new Date(s.expiryDate).getTime() - Date.now()) / 86400000);
      return { ...s, daysLeft };
    })
    .filter(s => {
      if (filter === 'critical') return s.daysLeft <= 3 && s.daysLeft > 0;
      if (filter === 'warning') return s.daysLeft <= 7 && s.daysLeft > 0;
      return s.daysLeft <= 14;
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const criticalCount = stock.filter(s => {
    const d = Math.ceil((new Date(s.expiryDate).getTime() - Date.now()) / 86400000);
    return d <= 3 && d > 0 && s.unitsRemaining > 0;
  }).length;

  const warningCount = stock.filter(s => {
    const d = Math.ceil((new Date(s.expiryDate).getTime() - Date.now()) / 86400000);
    return d <= 7 && d > 3 && s.unitsRemaining > 0;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Expiry Monitor</h1>
        <p className="text-muted-foreground text-sm">Track blood unit expiration dates</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="medical-card border-stock-critical/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stock-critical/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-stock-critical" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
              <p className="text-xs text-muted-foreground">Critical (&lt;3 days)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card border-stock-low/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stock-low/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-stock-low" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{warningCount}</p>
              <p className="text-xs text-muted-foreground">Warning (&lt;7 days)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Expiring Units</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All (&lt;14 days)</SelectItem>
                <SelectItem value="warning">&lt;7 days</SelectItem>
                <SelectItem value="critical">&lt;3 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Days Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiring.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.donorName}</TableCell>
                  <TableCell><Badge variant="outline" className="font-mono">{s.bloodType}</Badge></TableCell>
                  <TableCell>{s.unitsRemaining}</TableCell>
                  <TableCell className="text-muted-foreground">{s.expiryDate}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${s.daysLeft <= 3 ? 'status-critical' : 'status-low'}`} variant="outline">
                      {s.daysLeft <= 0 ? 'Expired' : `${s.daysLeft}d`}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {expiring.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No expiring units found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpiryMonitor;
