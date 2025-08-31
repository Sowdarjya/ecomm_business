"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders, markOrderAsDelivered } from "@/actions/order.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Package,
  User,
  MapPin,
  Clock,
  CheckCircle,
  X,
  Phone,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

type OrderItem = {
  id: string;
  quantity: number;
  size: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
};

type Order = {
  id: string;
  status: string;
  totalPrice: number;
  location: string;
  contactNo: string;
  createdAt: Date;
  items: OrderItem[];
  user: {
    fullName: string;
    avatarUrl?: string;
  };
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getAllOrders();
        if (result.success && result.orders) {
          const ordersWithSanitizedContact = result.orders.map((order) => ({
            ...order,
            contactNo: order.contactNo || "Not provided",
          }));
          setOrders(ordersWithSanitizedContact as Order[]);
          setFilteredOrders(ordersWithSanitizedContact as Order[]);
        } else {
          console.log("Failed to fetch orders:", result.message);
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
        setOrders([]);
        setFilteredOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.user.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const handleMarkAsDelivered = async (orderId: string) => {
    setUpdatingOrder(orderId);
    try {
      const result = await markOrderAsDelivered(orderId);
      if (result.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "COMPLETED" } : order
          )
        );
        toast.success(result.message || "Order marked as completed");
      } else {
        toast.error(result.message || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "COMPLETED":
        return "bg-green-500 text-white";
      case "CANCELED":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const canMarkAsDelivered = (status: string) => {
    return status === "PENDING";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
          <p className="text-amber-700 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-amber-900">Admin Orders</h1>
          </div>
          <p className="text-amber-700 text-lg">
            Manage and track all customer orders
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Orders Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-900 mb-1">
                {orders.length}
              </div>
              <div className="text-sm text-amber-700 font-medium">
                Total Orders
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md border-yellow-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {orders.filter((o) => o.status === "PENDING").length}
              </div>
              <div className="text-sm text-yellow-700 font-medium">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md border-green-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {orders.filter((o) => o.status === "COMPLETED").length}
              </div>
              <div className="text-sm text-green-700 font-medium">
                Completed
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md border-red-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {orders.filter((o) => o.status === "CANCELED").length}
              </div>
              <div className="text-sm text-red-700 font-medium">Canceled</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by customer name, order ID, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-amber-200 focus:border-amber-400">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Orders</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Display */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="text-center py-16">
              <Package className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                {searchTerm || statusFilter !== "ALL"
                  ? "No matching orders"
                  : "No orders found"}
              </h3>
              <p className="text-amber-700">
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your search or filter criteria"
                  : "Orders will appear here once customers start placing them"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-amber-900 font-bold">
                        #{order.id.slice(-8)}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} ml-2`}>
                      {order.status}
                    </Badge>
                  </CardTitle>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mt-4 p-3 bg-amber-50 rounded-lg">
                    <div className="relative">
                      {order.user.avatarUrl ? (
                        <img
                          src={order.user.avatarUrl}
                          alt={order.user.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-amber-300 flex items-center justify-center">
                          <User className="w-6 h-6 text-amber-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-amber-900 truncate">
                        {order.user.fullName}
                      </div>
                      <div className="text-sm text-amber-700">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact & Address Details */}
                  <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 mb-1">
                          Delivery Address
                        </div>
                        <div className="text-sm text-gray-900 leading-relaxed">
                          {order.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-700 mb-1">
                          Contact Number
                        </div>
                        <div className="text-sm text-gray-900 font-mono">
                          {order.contactNo || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Items ({order.items.length})
                    </h4>
                    <ScrollArea className="h-40">
                      <div className="space-y-3 pr-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                          >
                            <img
                              src={
                                item.product.images[0] ||
                                "/placeholder.svg?height=48&width=48"
                              }
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-md border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 truncate">
                                {item.product.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Size: {item.size || "N/A"} • Qty:{" "}
                                {item.quantity}
                              </div>
                              <div className="text-xs font-medium text-green-600 mt-1">
                                ₹{item.product.price} × {item.quantity} = ₹
                                {item.product.price * item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Order Total */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium text-amber-900">
                        Order Total:
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ₹{order.totalPrice}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {canMarkAsDelivered(order.status) && (
                      <Button
                        onClick={() => handleMarkAsDelivered(order.id)}
                        disabled={updatingOrder === order.id}
                        className="w-full bg-gradient-to-r cursor-pointer from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium transition-all duration-300"
                      >
                        {updatingOrder === order.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Mark as Delivered
                          </div>
                        )}
                      </Button>
                    )}

                    {order.status === "COMPLETED" && (
                      <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">
                          Order Completed
                        </span>
                      </div>
                    )}

                    {order.status === "CANCELED" && (
                      <div className="flex items-center justify-center gap-2 py-3 bg-red-50 rounded-lg border border-red-200">
                        <X className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 font-medium">
                          Order Canceled
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Info */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-amber-700">
              Showing {filteredOrders.length} of {orders.length} orders
              {statusFilter !== "ALL" && (
                <span className="font-medium"> • Filter: {statusFilter}</span>
              )}
              {searchTerm && (
                <span className="font-medium"> • Search: "{searchTerm}"</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
