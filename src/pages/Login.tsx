import { useState, FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error("שגיאת התחברות: " + error.message);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4" dir="rtl">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-full p-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">מערכת מלכה בטיחות</CardTitle>
          <CardDescription>התחברות ידנית למערכת</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">כתובת אימייל</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={submitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "מתחבר..." : "התחבר"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
