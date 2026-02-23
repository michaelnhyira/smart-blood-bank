import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, PERSONNEL_CODE } from '@/contexts/AuthContext';
import { BLOOD_TYPES, BloodType } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, UserPlus, Heart, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState<'donor' | 'personnel' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>('O+');
  const [phone, setPhone] = useState('');
  const [lastDonation, setLastDonation] = useState('');
  const [staffId, setStaffId] = useState('');
  const [department, setDepartment] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'personnel' && authCode !== PERSONNEL_CODE) {
      setError('Invalid authorization code. Please contact system administrator.');
      return;
    }

    const result = register({
      name, email, password, role: role!,
      ...(role === 'donor' ? { bloodType, phone, lastDonationDate: lastDonation } : { staffId, department }),
    });

    if (result.success) navigate('/');
    else setError(result.error || 'Registration failed.');
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Droplets className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground text-sm">Select your role to get started</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="medical-card cursor-pointer hover:border-primary transition-colors" onClick={() => setRole('donor')}>
              <CardContent className="flex flex-col items-center p-8">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-lg mb-1">Donor</CardTitle>
                <CardDescription className="text-center text-sm">Register as a blood donor</CardDescription>
              </CardContent>
            </Card>
            <Card className="medical-card cursor-pointer hover:border-primary transition-colors" onClick={() => setRole('personnel')}>
              <CardContent className="flex flex-col items-center p-8">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-lg mb-1">Health Personnel</CardTitle>
                <CardDescription className="text-center text-sm">Register as hospital staff</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <Droplets className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {role === 'donor' ? 'Donor' : 'Health Personnel'} Registration
          </h1>
        </div>
        <Card className="medical-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@hospital.org" required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>

              {role === 'donor' && (
                <>
                  <div className="space-y-2">
                    <Label>Blood Type</Label>
                    <Select value={bloodType} onValueChange={v => setBloodType(v as BloodType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0241234567" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Donation Date</Label>
                    <Input type="date" value={lastDonation} onChange={e => setLastDonation(e.target.value)} required />
                  </div>
                </>
              )}

              {role === 'personnel' && (
                <>
                  <div className="space-y-2">
                    <Label>Staff ID</Label>
                    <Input value={staffId} onChange={e => setStaffId(e.target.value)} placeholder="NBS-001" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Haematology" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Personnel Authorization Code</Label>
                    <Input type="password" value={authCode} onChange={e => setAuthCode(e.target.value)} placeholder="Enter authorization code" required />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full">
                <UserPlus className="w-4 h-4 mr-2" /> Create Account
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setRole(null)}>
                ← Choose Different Role
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
