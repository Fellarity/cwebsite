"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PricingButton = ({ 
  planId, 
  planTitle, 
  isPopular, 
  buttonText 
}: { 
  planId: string, 
  planTitle: string, 
  isPopular: boolean, 
  buttonText: string 
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Order on Backend
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
           toast.error("Please sign in to purchase a plan.");
           return;
        }
        throw new Error("Failed to create order");
      }

      const order = await res.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "AI Coaching Hub",
        description: `Purchase: ${planTitle}`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment on Backend
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          if (verifyRes.ok) {
            toast.success("Payment Successful! Welcome to the program.");
            router.push("/dashboard");
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#1D4ED8",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={loading}
      className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 group ${
        isPopular 
        ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xl shadow-sky-500/20' 
        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-100'
      } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
        <>
          {buttonText}
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
};
