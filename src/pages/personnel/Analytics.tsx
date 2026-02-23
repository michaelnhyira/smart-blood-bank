import { useBloodBank } from '@/contexts/BloodBankContext';
import { weeklyUsageData, monthlyDemandData, bloodTypeDemandData, aiPredictions, BLOOD_TYPES } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Brain, TrendingUp, AlertTriangle } from 'lucide-react';

const COLORS = ['hsl(0,66%,47%)', 'hsl(220,70%,50%)', 'hsl(142,71%,45%)', 'hsl(38,92%,50%)', 'hsl(280,65%,60%)', 'hsl(180,60%,45%)', 'hsl(330,70%,50%)', 'hsl(60,80%,45%)'];

const Analytics = () => {
  const { usageRecords, getStockByType } = useBloodBank();

  const dailyUsage = (() => {
    const days: Record<string, number> = {};
    usageRecords.forEach(r => { days[r.date] = (days[r.date] || 0) + r.unitsUsed; });
    return Object.entries(days).sort((a, b) => a[0].localeCompare(b[0])).slice(-7).map(([date, units]) => ({ date: date.slice(5), units }));
  })();

  // Simulated AI predictions
  const riskBloodTypes = BLOOD_TYPES.filter(bt => getStockByType(bt) < 5);
  const riskScore = riskBloodTypes.length === 0 ? 'Low' : riskBloodTypes.length <= 2 ? 'Medium' : 'High';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics & AI Prediction</h1>
        <p className="text-muted-foreground text-sm">Usage trends and demand forecasting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="medical-card">
          <CardHeader><CardTitle className="text-base">Daily Usage (Last 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="units" fill="hsl(0,66%,47%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader><CardTitle className="text-base">Weekly Usage Pattern</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="units" stroke="hsl(220,70%,50%)" strokeWidth={2} dot={{ fill: 'hsl(220,70%,50%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader><CardTitle className="text-base">Monthly Demand Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="demand" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader><CardTitle className="text-base">Most Demanded Blood Types</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={bloodTypeDemandData} dataKey="demand" nameKey="type" cx="50%" cy="50%" outerRadius={90} label={({ type }) => type}>
                  {bloodTypeDemandData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Prediction Section */}
      <Card className="medical-card border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">AI Demand Prediction</CardTitle>
              <CardDescription>Simulated 7-day forecast</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={aiPredictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="predicted" stroke="hsl(0,66%,47%)" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: 'hsl(0,66%,47%)' }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Predicted 7-Day Demand</p>
              <p className="text-2xl font-bold text-foreground">{aiPredictions.reduce((a, p) => a + p.predicted, 0)} units</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
              <Badge className={`text-sm ${riskScore === 'Low' ? 'status-healthy' : riskScore === 'Medium' ? 'status-low' : 'status-critical'}`} variant="outline">
                {riskScore}
              </Badge>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Shortage Forecast</p>
              <p className="text-sm font-medium text-foreground">
                {riskBloodTypes.length > 0
                  ? `Based on recent usage patterns, ${riskBloodTypes[0]} may run low in 5 days.`
                  : 'No shortage predicted in the next 7 days.'}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic border-t pt-3">
            This prediction is generated using supervised machine learning trained on historical blood usage data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
