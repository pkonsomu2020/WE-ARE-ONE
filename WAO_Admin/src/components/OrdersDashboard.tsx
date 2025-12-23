import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Eye, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import OrderDetailModal from "./OrderDetailModal";
import { api } from "@/lib/api";

// Helper function to safely format dates
const formatDate = (dateString: any): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

interface Order {
  id: number;
  name: string;
  email: string;
  mpesaCode: string;
  status: "paid" | "pending" | "failed" | "processing";
  date: string;
  amount?: number;
  confirmationMessage?: string;
  eventId?: string;
  ticketType?: string;
}

interface OrdersDashboardProps {
  onLogout: () => void;
}

const OrdersDashboard = ({ onLogout }: OrdersDashboardProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");

  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    try {
      const res = await api.listPayments();
      
      const mapped: Order[] = (res?.payments || []).map((p: any) => ({
        id: p.id,
        name: p.full_name,
        email: p.email,
        mpesaCode: p.mpesa_code,
        status: p.status === 'pending_verification' ? 'pending' : (p.status as Order['status']),
        date: formatDate(p.created_at),
        amount: p.amount,
        confirmationMessage: p.confirmation_message || undefined,
        eventId: p.event_id,
        ticketType: p.ticket_type,
      }));
      
      setOrders(mapped);
    } catch (error) {
      console.error('❌ Failed to load orders:', error);
      // Show user-friendly error
      setOrders([]);
    }
  };

  useEffect(() => { loadOrders().catch(console.error); }, []);

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

  // Get unique events for filter dropdown
  const uniqueEvents = Array.from(new Set(orders.map(order => order.eventId).filter(Boolean)));

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.mpesaCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesEvent = eventFilter === "all" || order.eventId === eventFilter;
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const handleStatusUpdate = async (orderId: number, newStatus: string, reason?: string) => {
    const apiStatus = newStatus === 'pending' ? 'pending_verification' : (newStatus as 'paid' | 'failed' | 'pending_verification');
    await api.updatePayment(orderId, { status: apiStatus, reason });
    await loadOrders();
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Orders</h1>
          <Button 
            onClick={onLogout}
            variant="destructive"
            className="bg-destructive hover:bg-destructive/90"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Event Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Orders</p>
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'paid').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                  <p className="text-2xl font-bold text-orange-600">{uniqueEvents.length}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">🎫</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Event Orders</CardTitle>
            <CardDescription>Manage and track orders by event</CardDescription>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or M-Pesa code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="all">All Events</option>
                  {uniqueEvents.map(eventId => (
                    <option key={eventId} value={eventId}>
                      {eventId}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>M-pesa Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{order.eventId || 'N/A'}</span>
                          {order.ticketType && (
                            <span className="text-xs text-muted-foreground">{order.ticketType}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{order.name}</TableCell>
                      <TableCell className="text-muted-foreground">{order.email}</TableCell>
                      <TableCell className="font-mono text-sm">{order.mpesaCode}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No orders found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default OrdersDashboard;