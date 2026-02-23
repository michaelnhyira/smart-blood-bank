import { useState } from 'react';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { BLOOD_TYPES, BloodStock } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';

const Inventory = () => {
  const { stock } = useBloodBank();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterExpiry, setFilterExpiry] = useState<string>('all');
  const [selected, setSelected] = useState<BloodStock | null>(null);

  const filtered = stock.filter(s => {
    if (search && !s.donorName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'all' && s.bloodType !== filterType) return false;
    if (filterExpiry !== 'all') {
      const daysLeft = Math.ceil((new Date(s.expiryDate).getTime() - Date.now()) / 86400000);
      if (filterExpiry === 'critical' && daysLeft > 3) return false;
      if (filterExpiry === 'warning' && (daysLeft > 7 || daysLeft <= 3)) return false;
      if (filterExpiry === 'safe' && daysLeft <= 7) return false;
    }
    return true;
  });

  const getDaysLeft = (expiry: string) => Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
        <p className="text-muted-foreground text-sm">Manage all blood stock records</p>
      </div>

      <Card className="medical-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by donor name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Blood Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterExpiry} onValueChange={setFilterExpiry}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Expiry Risk" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical (&lt;3 days)</SelectItem>
                <SelectItem value="warning">Warning (&lt;7 days)</SelectItem>
                <SelectItem value="safe">Safe (&gt;7 days)</SelectItem>
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
                <TableHead className="text-center">Units</TableHead>
                <TableHead className="hidden sm:table-cell">Collected</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => {
                const daysLeft = getDaysLeft(s.expiryDate);
                const status = daysLeft <= 0 ? 'expired' : daysLeft <= 3 ? 'critical' : daysLeft <= 7 ? 'warning' : 'safe';
                return (
                  <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelected(s)}>
                    <TableCell className="font-medium">{s.donorName}</TableCell>
                    <TableCell><Badge variant="outline" className="font-mono">{s.bloodType}</Badge></TableCell>
                    <TableCell className="text-center">{s.unitsRemaining}/{s.unitsCollected}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{s.collectionDate}</TableCell>
                    <TableCell>{s.expiryDate}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${status === 'safe' ? 'status-healthy' : status === 'warning' ? 'status-low' : 'status-critical'}`} variant="outline">
                        {status === 'safe' ? `${daysLeft}d` : status === 'expired' ? 'Expired' : `${daysLeft}d ⚠`}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No records found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Blood Record Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Donor Name</span><p className="font-medium">{selected.donorName}</p></div>
                <div><span className="text-muted-foreground">Contact</span><p className="font-medium">{selected.donorPhone}</p></div>
                <div><span className="text-muted-foreground">Blood Type</span><p className="font-medium">{selected.bloodType}</p></div>
                <div><span className="text-muted-foreground">Units Remaining</span><p className="font-medium">{selected.unitsRemaining}/{selected.unitsCollected}</p></div>
                <div><span className="text-muted-foreground">Collection Date</span><p className="font-medium">{selected.collectionDate}</p></div>
                <div><span className="text-muted-foreground">Expiry Date</span><p className="font-medium">{selected.expiryDate}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
