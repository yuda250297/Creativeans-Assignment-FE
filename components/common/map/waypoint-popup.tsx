// components/PopupContent.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useModalStore } from "@/store/modalstore";

type Transaction = {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: string;
};

const transactions: Transaction[] = [
  { id: "1", merchant: "Blue Bottle Coffee", category: "Food & Drink", date: "Today, 10:24 AM", amount: "-$6.50" },
  { id: "2", merchant: "Whole Foods Market", category: "Groceries", date: "Yesterday", amount: "-$142.30" },
  { id: "3", merchant: "Stripe Payout", category: "Income", date: "Oct 12", amount: "+$4,200.00" },
  { id: "4", merchant: "Uber Technologies", category: "Transport", date: "Oct 11", amount: "-$24.10" },
  { id: "5", merchant: "Netflix Subscription", category: "Entertainment", date: "Oct 10", amount: "-$19.99" },
];

interface PopupContentProps {
  store_id: string;
  title: string;
  type?: string;
  picture?: string;
  feature?: any;
}

export function PopupContent({ store_id, title, type, picture, feature }: PopupContentProps) {

  const open = useModalStore((state) => state.open);
  // const close = useModalStore((state) => state.close);
  
  return (
    <div className="border rounded-md bg-white overflow-hidden shadow-sm w-full max-w-sm">
      {/* Content Area */}
      <div className="flex items-center p-3 gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar className="rounded-sm size-12">
            <AvatarImage src={picture} alt={title} />
            <AvatarFallback>OEP</AvatarFallback>
          </Avatar>
        </div>

        {/* Text/Badge Area */}
        <div className="flex flex-col justify-center gap-1 overflow-hidden min-w-0">
          {/* Badge stays at the top, items-start ensures it doesn't stretch */}
          <div className="flex items-start">
            <Badge variant="secondary" className="rounded-xs shrink-0 bg-yellow-500 text-white text-xs font-medium">
              {type}
            </Badge>
          </div>
          {/* Title sits below the badge */}
          <p className="font-semibold truncate text-xs text-slate-600">{title}</p>
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-2 bg-gray-50 border-t">
        <Button size="sm" className="w-full rounded-sm text-xs cursor-pointer bg-slate-800 text-white" onClick={() => open("locationDetail", feature)}>
          View details
        </Button>
      </div>
    </div>
  );
}
