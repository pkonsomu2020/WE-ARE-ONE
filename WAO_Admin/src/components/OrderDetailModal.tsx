import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: number;
  name: string;
  email: string;
  mpesaCode: string;
  status: "paid" | "pending" | "failed" | "processing";
  date: string;
  amount?: number;
  confirmationMessage?: string;
}

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: string, reason?: string) => void;
}

const OrderDetailModal = ({ order, onClose, onStatusUpdate }: OrderDetailModalProps) => {
  const [newStatus, setNewStatus] = useState<Order['status']>(order.status);
  const [reason, setReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      case "processing":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "processing":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleUpdate = async () => {
    if (newStatus !== order.status && (newStatus === "failed") && !reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for marking the order as failed.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, newStatus, reason);
      toast({ title: 'Success', description: `Order #${order.id} status updated to ${newStatus}` });
    } catch (e: any) {
      toast({ title: 'Update failed', description: e?.message || 'Unable to update status', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Order #{order.id}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="font-medium">{order.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">M-Pesa Code</Label>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{order.mpesaCode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p className="font-medium">{order.date}</p>
                </div>
                {order.amount && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                    <p className="font-bold text-lg text-primary">Ksh {order.amount.toFixed(2)}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Current Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Message */}
          {order.confirmationMessage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confirmation Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-mono leading-relaxed">{order.confirmationMessage}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
              <CardDescription>Change the payment verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order['status'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="processing">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Processing
                      </div>
                    </SelectItem>
                    <SelectItem value="paid">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Paid
                      </div>
                    </SelectItem>
                    <SelectItem value="failed">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Failed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason" className="text-sm font-medium">
                  Reason {newStatus === "failed" && <span className="text-destructive">*</span>}
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for status change..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdate}
                  disabled={isUpdating || newStatus === order.status}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;