import { useAuth } from '@/contexts/AuthContext';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const DonorNotifications = () => {
  const { user } = useAuth();
  const { alerts, getStockByType } = useBloodBank();

  const myAlerts = alerts.filter(a => a.bloodType === user?.bloodType);
  const myTypeStock = user?.bloodType ? getStockByType(user.bloodType) : 0;
  const isLowStock = myTypeStock < 20;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground text-sm">Important updates about your blood type</p>
      </div>

      {isLowStock && (
        <Card className="medical-card border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Urgent Request</span>
            </div>
            <p className="text-sm text-foreground">
              Your blood type ({user?.bloodType}) is currently in high demand. Only {myTypeStock} units remain in our inventory.
            </p>
            <p className="text-sm text-muted-foreground mt-2 italic">
              "Urgent need for {user?.bloodType} blood. Please consider donating."
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="medical-card">
        <CardHeader><CardTitle className="text-base">All Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {myAlerts.length === 0 && !isLowStock && (
            <p className="text-sm text-muted-foreground py-4 text-center">No notifications at this time.</p>
          )}
          {myAlerts.map(a => (
            <div key={a.id} className={`p-3 rounded-lg text-sm ${a.read ? 'bg-muted/30 text-muted-foreground' : 'bg-accent/50 text-foreground'}`}>
              <p>{a.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorNotifications;
