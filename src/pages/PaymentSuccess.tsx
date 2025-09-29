import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type VerificationStatus = 'verifying' | 'success' | 'failed' | 'already-enrolled';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('verifying');
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const courseId = reference ? reference.split('_')[1] : null;

  useEffect(() => {
    if (!reference || !courseId || !user) {
      // Essential data is missing, wait for it to be available.
      return;
    }

    const POLLING_INTERVAL = 2000; // 2 seconds
    const POLLING_TIMEOUT = 30000; // 30 seconds

    let intervalId: number;
    let timeoutId: number;

    const cleanup = () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };

    const poll = async () => {
      try {
        const { data: enrollment, error } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = 'No rows found'
          throw new Error(error.message);
        }

        if (enrollment) {
          setVerificationStatus('success');
          toast.success("Enrollment Confirmed!", {
            description: "Your enrollment was successfully verified.",
          });
          cleanup();
        }
      } catch (err) {
        console.error("Error checking enrollment:", err);
        setVerificationStatus('failed');
        cleanup();
      }
    };

    // Start polling
    poll(); // Initial immediate check
    intervalId = setInterval(poll, POLLING_INTERVAL);

    // Set a timeout for the entire polling process
    timeoutId = setTimeout(() => {
      setVerificationStatus(prevStatus => {
        if (prevStatus === 'verifying') {
          console.error("Polling timed out.");
          toast.error("Verification Timed Out", {
            description: "We couldn't confirm your enrollment automatically. Please contact support.",
          });
          return 'failed';
        }
        return prevStatus;
      });
      cleanup();
    }, POLLING_TIMEOUT);

    // Return the cleanup function to be called on component unmount
    return cleanup;

  }, [reference, courseId, user, navigate]);

  const renderVerifying = () => (
    <>
      <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <CardTitle className="text-2xl text-blue-600">Verifying Enrollment...</CardTitle>
      <CardDescription>
        Please wait while we confirm your payment and enroll you in the course. This shouldn't take long.
      </CardDescription>
    </>
  );

  const renderSuccess = () => (
    <>
      <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <CardTitle className="text-2xl text-green-600">Enrollment Successful!</CardTitle>
      <CardDescription>
        You now have access to the course. Happy learning!
      </CardDescription>
    </>
  );

  const renderFailed = () => (
    <>
      <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <CardTitle className="text-2xl text-red-600">Verification Failed</CardTitle>
      <CardDescription>
        We couldn't automatically confirm your enrollment. Please contact support with your transaction reference.
      </CardDescription>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verificationStatus === 'verifying' && renderVerifying()}
          {verificationStatus === 'success' && renderSuccess()}
          {verificationStatus === 'failed' && renderFailed()}
        </CardHeader>
        <CardContent className="space-y-4">
          {reference && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Transaction Reference:</p>
              <p className="font-mono text-sm break-all">{reference}</p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/student/courses')} 
                className="w-full"
              >
                View My Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {verificationStatus === 'failed' && (
             <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Back to Home
              </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;