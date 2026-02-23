import { useAuth } from '@/contexts/AuthContext';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DonorHistory = () => {
  const { user } = useAuth();
  const { stock } = useBloodBank();

  // Combine user's own donation records with stock entries linked by email
  const stockDonations = user?.email
    ? stock
        .filter(s => s.donorEmail && s.donorEmail.toLowerCase() === user.email.toLowerCase())
        .map(s => ({ date: s.collectionDate, units: s.unitsCollected }))
    : [];

  const userDonations = user?.donations || [];

  // Merge and deduplicate by date+units
  const seen = new Set<string>();
  const allDonations = [...stockDonations, ...userDonations].filter(d => {
    const key = `${d.date}_${d.units}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Donation History</h1>
        <p className="text-muted-foreground text-sm">Your past blood donations</p>
      </div>
      <Card className="medical-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Units Donated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDonations.length === 0 ? (
                <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">No donation records yet.</TableCell></TableRow>
              ) : allDonations.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{d.date}</TableCell>
                  <TableCell>{d.units}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorHistory;
