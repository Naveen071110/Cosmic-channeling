import { useEffect, useState } from 'react';
import { 
  PayPalScriptProvider, 
  PayPalButtons,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PayPalButtonWrapperProps {
  showSpinner?: boolean;
  amount: string;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError: (err: any) => void;
  onCancel: () => void;
}

// This component renders the PayPal button wrapped in necessary context
const ButtonWrapper = ({ 
  showSpinner, 
  amount, 
  onApprove, 
  onError, 
  onCancel 
}: PayPalButtonWrapperProps) => {
  
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <>
      {(showSpinner && isPending) && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        </div>
      )}
      
      <PayPalButtons
        style={{ 
          color: "blue",
          shape: "pill",
          label: "subscribe",
          height: 46
        }}
        disabled={false}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency_code: 'USD'
                },
                description: "Cosmic Channeling Premium Monthly Subscription"
              }
            ],
            application_context: {
              brand_name: 'Cosmic Channeling',
              user_action: 'PAY_NOW'
            }
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            await actions.order.capture();
            await onApprove(data);
          }
        }}
        onCancel={onCancel}
        onError={onError}
      />
    </>
  );
};

interface PayPalButtonProps {
  amount: string;
  onSuccess: (orderId: string) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export default function PayPalButton({ 
  amount, 
  onSuccess,
  onError,
  onCancel
}: PayPalButtonProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { toast } = useToast();

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
  
  useEffect(() => {
    if (!clientId) {
      console.error('PayPal client ID is missing!');
    } else {
      setScriptLoaded(true);
    }
  }, [clientId]);

  if (!scriptLoaded) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": clientId,
        currency: "USD",
        intent: "capture"
      }}
    >
      <ButtonWrapper
        showSpinner={true}
        amount={amount}
        onApprove={async (data) => {
          try {
            await onSuccess(data.orderID);
          } catch (error) {
            console.error("Error in onApprove:", error);
            if (onError) onError(error);
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          toast({
            title: "Payment Error",
            description: "There was a problem with your payment. Please try again.",
            variant: "destructive"
          });
          if (onError) onError(err);
        }}
        onCancel={() => {
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled.",
            variant: "default"
          });
          if (onCancel) onCancel();
        }}
      />
    </PayPalScriptProvider>
  );
}