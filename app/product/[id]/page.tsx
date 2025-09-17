"use client";

import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { addToCart, getProductDetails } from "@/actions/product.action";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/actions/wishlist.action";
import { useUser } from "@clerk/nextjs";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: "CLOTHING" | "ACCESSORIES";
  size: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [cartQuantity, setCartQuantity] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { success, product } = await getProductDetails(
          params.id as string
        );
        if (success && product) {
          console.log(product);
          setProduct(product);
          setLoading(false);
        } else {
          setProduct(null);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res: { success: boolean; items?: any[] } = await getWishlist();
        if (res.success && res.items) {
          setWishlist(res.items.map((item: any) => item.id));
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchProduct();
    fetchWishlist();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }

    setSaving(true);

    try {
      await addToCart(product?.id as string, cartQuantity, selectedSize);
      toast.success(`${cartQuantity} item(s) added to cart!`);
      setIsDialogOpen(false);
      setSelectedSize("");
      setCartQuantity(1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item to cart");
    } finally {
      setSaving(false);
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    try {
      if (wishlist.includes(product.id)) {
        const res = await removeFromWishlist(product.id);
        if (res.success) {
          setWishlist((prev) => prev.filter((id) => id !== product.id));
          toast.success("Removed from wishlist");
        } else {
          toast.error(res.message || "Failed to remove from wishlist");
        }
      } else {
        const res = await addToWishlist(product.id);
        if (res.success) {
          setWishlist((prev) => [...prev, product.id]);
          toast.success("Added to wishlist");
        } else {
          toast.error(res.message || "Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Wishlist update failed");
    }
  };

  const openCartDialog = () => {
    if (product && product.stock > 0) {
      setIsDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            Product Not Found
          </h2>
          <Link href="/products">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-amber-700 hover:text-amber-900 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go back
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Images */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Image */}
            <div className="flex-1">
              <Card className="overflow-hidden border-amber-200 bg-white/80 backdrop-blur-sm">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={
                      product.images[selectedImage] ||
                      "/placeholder.svg?height=600&width=600"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Thumbnail Images */}
            <div className="lg:w-24">
              <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
                {product.images.map((image, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-amber-500 ring-2 ring-amber-200"
                        : "border-amber-200 hover:border-amber-400"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="bg-amber-100 text-amber-800 mb-3">
                {product.category === "CLOTHING" ? "Clothing" : "Accessories"}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl text-gray-500 line-through">
                  ₹{(product.price + 100).toLocaleString()}
                </span>
                <span className="text-4xl font-bold text-amber-800">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`font-medium ${
                    product.stock > 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {product.size && product.size.length > 0 && (
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  Available Sizes:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.size.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="border-amber-300 text-amber-700 px-4 py-2"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Card className="border-amber-200 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-3">
                  Product Details:
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openCartDialog}
                    disabled={product.stock === 0}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-medium py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add to Cart</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select Size
                      </label>
                      <Select
                        value={selectedSize}
                        onValueChange={setSelectedSize}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a size" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.size.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Quantity
                      </label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCartQuantity(Math.max(1, cartQuantity - 1))
                          }
                          className="border-amber-300"
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {cartQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCartQuantity(
                              Math.min(product.stock, cartQuantity + 1)
                            )
                          }
                          className="border-amber-300"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      {loading ? (
                        <Button disabled variant="outline" className="flex-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleAddToCart}
                          disabled={saving || product.stock === 0}
                          className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-medium py-3 text-lg cursor-pointer"
                        >
                          {product.stock === 0 ? (
                            "Out of Stock"
                          ) : saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Add to Cart"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={toggleWishlist}
                className="border-amber-300 text-amber-700 hover:bg-amber-100 px-4 bg-transparent cursor-pointer"
              >
                {wishlist.includes(product.id) ? (
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
