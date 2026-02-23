import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BloodType } from '@/data/mockData';

const BookDonation = () => {
  const { user } = useAuth();
  const { addBooking, bookings } = useBloodBank();
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const myBookings = bookings.filter(b => b.donorId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addBooking({ donorId: user.id, donorName: user.name, bloodType: (user.bloodType || 'O+') as BloodType, preferredDate: date });
    toast({ title: 'Booking Submitted', description: `Your donation appointment for ${date} has been requested.` });
    setDate('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Book Donation</h1>
        <p className="text-muted-foreground text-sm">Schedule your next blood donation</p>
      </div>

      <Card className="medical-card max-w-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
            </div>
            <Button type="submit" className="w-full">
              <Calendar className="w-4 h-4 mr-2" /> Submit Availability
            </Button>
            {submitted && (
              <div className="flex items-center gap-2 text-sm text-stock-healthy">
                <CheckCircle className="w-4 h-4" /> Booking submitted successfully!
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {myBookings.length > 0 && (
        <Card className="medical-card">
          <CardContent className="pt-6 space-y-2">
            <h3 className="text-sm font-medium text-foreground mb-3">Your Bookings</h3>
            {myBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                <span className="text-foreground">{b.preferredDate}</span>
                <span className="text-xs text-muted-foreground capitalize">{b.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookDonation;
