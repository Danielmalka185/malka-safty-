import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailX, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validateToken = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const response = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: supabaseKey } }
        );
        const data = await response.json();
        if (response.ok && data.valid) {
          setStatus("valid");
        } else if (data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("error");
      }
    };

    validateToken();
  }, [token]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already_unsubscribed");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <MailX className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-xl">ביטול הרשמה</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">טוען...</p>
            </div>
          )}
          {status === "valid" && (
            <>
              <p className="text-muted-foreground">
                האם אתה בטוח שברצונך להפסיק לקבל הודעות מייל?
              </p>
              <Button onClick={handleUnsubscribe} variant="destructive">
                אישור ביטול הרשמה
              </Button>
            </>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-foreground font-medium">בוטלה ההרשמה בהצלחה</p>
              <p className="text-muted-foreground text-sm">לא תקבל יותר הודעות מייל.</p>
            </div>
          )}
          {status === "already_unsubscribed" && (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-10 w-10 text-muted-foreground" />
              <p className="text-foreground font-medium">ההרשמה כבר בוטלה</p>
            </div>
          )}
          {(status === "invalid" || status === "error") && (
            <div className="flex flex-col items-center gap-2">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-foreground font-medium">קישור לא תקין</p>
              <p className="text-muted-foreground text-sm">הקישור אינו תקף או שפג תוקפו.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
