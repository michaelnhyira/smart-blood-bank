import { useState } from 'react';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bell, CheckCircle, Settings, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SmartAlerts = () => {
  const { alerts, dismissAlert, alertThreshold, setAlertThreshold, getStockByType } = useBloodBank();
  const { users } = useAuth();
  const [newThreshold, setNewThreshold] = useState(String(alertThreshold));
  const { toast } = useToast();

  const donors = users.filter(u => u.role === 'donor');

  const handleThresholdUpdate = () => {
    setAlertThreshold(Number(newThreshold));
    toast({ title: 'Threshold Updated', description: `Alert threshold set to ${newThreshold} units.` });
  };

  const lowStockTypes = alerts.filter(a => a.type === 'low_stock' && !a.read).map(a => a.bloodType);

  const notifiedDonors = donors.filter(d => d.bloodType && lowStockTypes.includes(d.bloodType));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Smart Alerts</h1>
        <p className="text-muted-foreground text-sm">Automated alerts and donor notifications</p>
      </div>

      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" /> Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="space-y-2 flex-1 max-w-xs">
              <Label>Minimum Stock Threshold (units)</Label>
              <Input type="number" min="1" value={newThreshold} onChange={e => setNewThreshold(e.target.value)} />
            </div>
            <Button onClick={handleThresholdUpdate}>Update</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Alerts trigger when any blood type falls below this threshold.</p>
        </CardContent>
      </Card>

      {notifiedDonors.length > 0 && (
        <Card className="medical-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" /> Donor Notifications Sent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifiedDonors.map(d => (
              <div key={d.id} className="p-3 rounded-lg bg-accent/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">{d.name} ({d.bloodType})</span>
                  <Badge variant="outline" className="text-xs">Notified</Badge>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" /> Email sent
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="w-3 h-3" /> SMS sent
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  "Urgent need for {d.bloodType} blood. Please consider donating."
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-stock-low" /> Alert History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {alerts.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No alerts yet.</p>}
          {alerts.map(a => (
            <div key={a.id} className={`flex items-start justify-between gap-3 p-3 rounded-lg ${a.read ? 'bg-muted/30' : 'bg-accent/50'}`}>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${a.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{a.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
              </div>
              {!a.read && (
                <Button variant="ghost" size="sm" onClick={() => dismissAlert(a.id)}>
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartAlerts;
