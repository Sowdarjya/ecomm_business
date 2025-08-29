"use client";

import { getWishlist, removeFromWishlist } from "@/actions/wishlist.action";
import { addToCart } from "@/actions/product.action";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type WishlistItem = {
  id: string;
  category: string;
  createdAt: Date;
  description: string;
  images: string[];
  name: string;
  price: number;
  size: string[];
  stock: number;
  updatedAt: Date;
};

type WishlistResponse = {
  success: boolean;
  items?: WishlistItem[];
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<WishlistItem | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  const fetchWishlist = async () => {
    try {
      const res: WishlistResponse = await getWishlist();
      console.log(res);

      if (res.success) {
        setWishlistItems(res.items || []);
      } else {
        toast.error("Failed to fetch wishlist");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    setRemovingItem(itemId);
    try {
      const res = await removeFromWishlist(itemId);
      if (res.success) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
        toast.success("Item removed from wishlist");
      } else {
        toast.error("Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error removing item from wishlist");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddToCart = async (
    id: string,
    quantity?: number,
    size?: string
  ) => {
    setSaving(true);
    try {
      await addToCart(id, quantity, size);
      setDialogOpen(false);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    } finally {
      setSaving(false);
    }
  };

  const openAddToCartDialog = (item: WishlistItem) => {
    setSelectedProduct(item);
    setSelectedSize(item.size?.[0] || "");
    setQuantity(1);
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = wishlistItems.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-amber-600 animate-pulse" />
          <p className="text-amber-700 text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-amber-600 fill-amber-600" />
            <h1 className="text-4xl font-bold text-amber-900">My Wishlist</h1>
          </div>
          <p className="text-amber-700 text-lg">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}{" "}
            saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg max-w-md mx-auto">
            <CardContent className="text-center py-16">
              <Heart className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-amber-700 mb-6">
                Save items you love to view them later
              </p>
              <Link
                href={"/"}
                className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white hover:from-amber-700 hover:to-yellow-600"
              >
                Continue Shopping
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div className="relative">
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.images[1]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>

                    {/* Image Counter */}
                    {item.images.length > 1 && (
                      <Badge className="absolute top-2 left-2 bg-black/70 text-white text-xs">
                        1/{item.images.length}
                      </Badge>
                    )}

                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute cursor-pointer top-2 right-2 w-8 h-8 p-0 bg-white/90 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={removingItem === item.id}
                    >
                      {removingItem === item.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    {/* Category Badge */}
                    <Badge className="mb-2 bg-amber-100 text-amber-800 text-xs">
                      {item.category}
                    </Badge>

                    {/* Product Name */}
                    <h3 className="font-semibold text-amber-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Price */}
                    <p className="text-2xl font-bold text-amber-900 mb-3">
                      ₹{item.price}
                    </p>

                    {/* Sizes */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Available Sizes:
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {item.size.map((size) => (
                          <Badge
                            key={size}
                            variant="outline"
                            className="text-xs border-amber-300 text-amber-700"
                          >
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        {item.stock > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white hover:from-amber-700 hover:to-yellow-600 transition-all duration-300 cursor-pointer"
                        onClick={() => openAddToCartDialog(item)}
                        disabled={item.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </CardContent>

                  {/* Added Date */}
                  <div className="px-4 pb-3">
                    <p className="text-xs text-gray-400">
                      Added on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className={
                          currentPage === page
                            ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-white"
                            : "border-amber-300 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Add to Cart Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add to Cart</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedProduct?.size && selectedProduct.size.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Size
                  </label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct.size.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Quantity
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-amber-300 cursor-pointer"
                    disabled={saving}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedProduct?.stock ?? 1, quantity + 1)
                      )
                    }
                    className="border-amber-300 cursor-pointer"
                    disabled={saving}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleAddToCart(
                      selectedProduct?.id!,
                      quantity,
                      selectedSize
                    )
                  }
                  disabled={
                    saving ||
                    !selectedSize ||
                    (selectedProduct?.stock ?? 0) === 0
                  }
                  className="flex-1 bg-amber-600 hover:bg-amber-700 cursor-pointer"
                >
                  {saving ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Wishlist;
