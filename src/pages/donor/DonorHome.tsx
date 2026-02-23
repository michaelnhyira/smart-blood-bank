import { useAuth } from '@/contexts/AuthContext';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Droplets, Calendar, Clock } from 'lucide-react';

const DonorHome = () => {
  const { user } = useAuth();
  const { getStockByType, alerts } = useBloodBank();

  const lastDonation = user?.lastDonationDate ? new Date(user.lastDonationDate) : null;
  const nextEligible = lastDonation ? new Date(lastDonation.getTime() + 90 * 86400000) : null;
  const isEligible = nextEligible ? nextEligible <= new Date() : true;

  const myTypeStock = user?.bloodType ? getStockByType(user.bloodType) : 0;
  const isLowStock = myTypeStock < 20;

  const myNotifications = alerts.filter(a => a.bloodType === user?.bloodType && !a.read);

  return (
    <div className="space-y-6">
      <Card className="medical-card bg-primary/5 border-primary/20">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Welcome, {user?.name}!</h1>
              <p className="text-muted-foreground">Thank you for saving lives.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="medical-card">
          <CardContent className="p-5 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Blood Type</p>
              <p className="text-lg font-bold text-foreground">{user?.bloodType}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-5 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Last Donation</p>
              <p className="text-sm font-medium text-foreground">{user?.lastDonationDate || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Next Eligible</p>
              <p className="text-sm font-medium text-foreground">
                {nextEligible ? nextEligible.toISOString().split('T')[0] : 'N/A'}
              </p>
              {nextEligible && (
                <Badge variant="outline" className={`text-xs mt-1 ${isEligible ? 'status-healthy' : 'status-low'}`}>
                  {isEligible ? 'Eligible Now' : 'Not Yet'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isLowStock && (
        <Card className="medical-card border-stock-critical/30 bg-stock-critical/5">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-foreground">
              ⚠ Your blood type ({user?.bloodType}) is currently in high demand. Only {myTypeStock} units available.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Please consider booking a donation appointment.</p>
          </CardContent>
        </Card>
      )}

      {myNotifications.length > 0 && (
        <Card className="medical-card">
          <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {myNotifications.map(n => (
              <div key={n.id} className="p-3 rounded-lg bg-accent/50 text-sm text-foreground">{n.message}</div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DonorHome;
