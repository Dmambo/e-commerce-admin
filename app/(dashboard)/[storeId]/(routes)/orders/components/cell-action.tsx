import { OrderColumn } from "./columns";
import { CheckSquare } from 'lucide-react';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { id } = data;
  const [updating, setUpdating] = useState(false);
  const [isPaid, setIsPaid] = useState(data.isPaid);

  const params =  useParams()

  const handleTogglePaid = async () => {
    if (updating) return;

    const newIsPaid = !isPaid;
    setUpdating(true);

    try {
      const response = await fetch(`/api/${params.storeId}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPaid: newIsPaid }),
      });

      if (response.ok) {
        setIsPaid(newIsPaid);
        setUpdating(false);
        toast.success(`Order status updated: ${newIsPaid ? "Paid" : "Unpaid"}`);

        if (newIsPaid) {
          try {
            const emailResponse = await fetch("/api/sendEmail", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: data.email,
                subject: "Order Paid",
                text: "The order has been paid.",
              }),
            });
            
            

            if (!emailResponse.ok) {
              console.error("Error sending email:", emailResponse.statusText);
            }
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
        }
      } else {
        toast.error("Failed to update order status");
        setUpdating(false);
      }
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", error);
      setUpdating(false);
    }
  };

  // Determine the variant based on the isPaid state
  const variant = isPaid ? "secondary" : "destructive";

  return (
    <>
      <Button variant={variant} onClick={handleTogglePaid} disabled={updating}>
        {isPaid ? (
          <>
            <CheckSquare color="#12de34" />
            &nbsp; Confirmed
          </>
        ) : (
          <>
         Unconfirmed
          </>
        )}
      </Button>
    </>
  );
};
