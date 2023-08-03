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

  const handleTogglePaid = () => {
    if (updating) return; // Prevent multiple clicks while updating

    const newIsPaid = !isPaid;
    setUpdating(true);

    // Make the API call to update the database
    fetch(`/api/${params.storeId}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPaid: newIsPaid }),
    })
      .then((response) => {
        if (response.ok) {
          setIsPaid(newIsPaid);
          setUpdating(false);
          toast.success(`Order status updated: ${newIsPaid ? "Paid" : "Unpaid"}`);
        } else {
          toast.error("Failed to update order status");
          setUpdating(false);
        }
      })
      .catch((error) => {
        toast.error("Failed to update order status");
        console.error("Error updating order status:", error);
        setUpdating(false);
      });
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
