import { useBloodBank } from '@/contexts/BloodBankContext';
import { BLOOD_TYPES } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingDown, AlertTriangle, Activity } from 'lucide-react';

const Dashboard = () => {
  const { getTotalUnits, getUsedToday, getExpiringStock, getHighestDemand, getStockByType, alerts } = useBloodBank();
  const totalUnits = getTotalUnits();
  const usedToday = getUsedToday();
  const expiringSoon = getExpiringStock(7).length;
  const highestDemand = getHighestDemand();
  const unreadAlerts = alerts.filter(a => !a.read);

  const summaryCards = [
    { title: 'Total Units', value: totalUnits, icon: Droplets, color: 'text-primary' },
    { title: 'Used Today', value: usedToday, icon: TrendingDown, color: 'text-chart-2' },
    { title: 'Expiring Soon', value: expiringSoon, icon: AlertTriangle, color: 'text-stock-low' },
    { title: 'Highest Demand', value: highestDemand, icon: Activity, color: 'text-stock-critical' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Blood Bank Inventory Overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <Card key={card.title} className="medical-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.title}</span>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {unreadAlerts.length > 0 && (
        <Card className="medical-card border-stock-critical/30 bg-stock-critical/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-stock-critical">
              <AlertTriangle className="w-4 h-4" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unreadAlerts.slice(0, 3).map(a => (
              <p key={a.id} className="text-sm text-foreground">{a.message}</p>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-base">Blood Type Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BLOOD_TYPES.map(bt => {
              const units = getStockByType(bt);
              const status = units === 0 ? 'critical' : units < 20 ? 'low' : 'healthy';
              return (
                <div key={bt} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-lg font-bold text-foreground">{bt}</p>
                    <p className="text-xs text-muted-foreground">{units} units</p>
                  </div>
                  <Badge className={`text-xs ${status === 'healthy' ? 'status-healthy' : status === 'low' ? 'status-low' : 'status-critical'}`} variant="outline">
                    {status === 'healthy' ? 'Good' : status === 'low' ? 'Low' : 'Critical'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
