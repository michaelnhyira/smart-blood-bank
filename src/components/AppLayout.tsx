import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBloodBank } from '@/contexts/BloodBankContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Droplets, Menu, X, LogOut, LayoutDashboard, Package, Plus,
  Minus, Database, AlertTriangle, BarChart3, Clock, Heart,
  Bell, Calendar, Home
} from 'lucide-react';

const personnelNav = [
  { label: 'Dashboard', path: '/personnel/dashboard', icon: LayoutDashboard },
  { label: 'Inventory', path: '/personnel/inventory', icon: Package },
  { label: 'Add Stock', path: '/personnel/add-stock', icon: Plus },
  { label: 'Record Usage', path: '/personnel/record-usage', icon: Minus },
  { label: 'Storage', path: '/personnel/storage', icon: Database },
  { label: 'Expiry Monitor', path: '/personnel/expiry', icon: Clock },
  { label: 'Smart Alerts', path: '/personnel/alerts', icon: AlertTriangle },
  { label: 'Analytics & AI', path: '/personnel/analytics', icon: BarChart3 },
];

const donorNav = [
  { label: 'Home', path: '/donor/home', icon: Home },
  { label: 'Donation History', path: '/donor/history', icon: Heart },
  { label: 'Notifications', path: '/donor/notifications', icon: Bell },
  { label: 'Book Donation', path: '/donor/book', icon: Calendar },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const { user, logout } = useAuth();
  const { alerts } = useBloodBank();
  const location = useLocation();
  const navigate = useNavigate();

  const nav = user?.role === 'personnel' ? personnelNav : donorNav;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Droplets className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm text-foreground truncate">Blood Bank IMS</h2>
            <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
                {item.label === 'Smart Alerts' && unreadAlerts > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5">{unreadAlerts}</Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b px-4 h-14 flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{time.toLocaleTimeString()}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
