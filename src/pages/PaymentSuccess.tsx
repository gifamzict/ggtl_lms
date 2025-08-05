import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    if (reference || trxref) {
      toast({
        title: "Payment Successful!",
        description: "Your course enrollment has been completed successfully.",
      });
    }
  }, [reference, trxref]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription>
            Your course enrollment has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(reference || trxref) && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Transaction Reference:</p>
              <p className="font-mono text-sm">{reference || trxref}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/student/courses')} 
              className="w-full"
            >
              View My Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;