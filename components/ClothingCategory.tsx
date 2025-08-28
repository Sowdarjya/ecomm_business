"use client";

import { addToCart, getProductsByCategory } from "@/actions/product.action";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  size: string[] | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

type Category = "CLOTHING" | "ACCESSORIES";

const ClothingCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProductsByCategory("CLOTHING");
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (
    id: string,
    quantity?: number,
    size?: string
  ) => {
    try {
      await addToCart(id, quantity, size);
      setDialogOpen(false);
      setSaving(false);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };
  const openAddToCartDialog = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize((product.size as string[])?.[0] || "");
    setQuantity(1);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            New Arrivals in Clothing
          </h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Explore our latest collection of stylish and trendy clothing items,
            perfect for any occasion.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-amber-200 bg-white/80 backdrop-blur-sm hover:scale-105"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={
                    product.images[0] || "/placeholder.svg?height=300&width=300"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <Heart className="h-4 w-4 text-red-500" />
                  </Button>
                  <Link href={`/products/${product.id}`}>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <ArrowRight className="h-4 w-4 text-amber-600" />
                    </Button>
                  </Link>
                </div>

                {product.stock < 5 && (
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                    {product.stock === 0
                      ? "Out of Stock"
                      : `Only ${product.stock} left`}
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <h3 className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-1 hover:underline cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-amber-800">
                      <span className="line-through text-gray-500 text-base mr-2">
                        ₹{product.price + 100}
                      </span>
                      {` ₹${product.price}`}
                    </span>
                    {product.size && (
                      <span className="text-xs text-gray-500">
                        Sizes: {product.size.map((s) => s).join(", ")}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-300 text-green-700"
                  >
                    In Stock
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => openAddToCartDialog(product)}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-medium transition-all duration-300 group-hover:shadow-lg cursor-pointer"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Link href={`/product/${product.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 cursor-pointer border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              No products found in Clothing category
            </h3>
            <p className="text-amber-700">Try searching for something else</p>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add to cart</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  placeholder="e.g. S, M, L or 38"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qty">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-9 p-0 bg-transparent"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={saving}
                  >
                    -
                  </Button>
                  <Input
                    id="qty"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value || 1)))
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-9 p-0 bg-transparent"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={saving}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleAddToCart(selectedProduct?.id!, quantity, selectedSize)
                }
                disabled={saving || (selectedProduct?.stock ?? 0) === 0}
                className="bg-gradient-to-r cursor-pointer from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white"
              >
                {saving ? "Adding..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClothingCategory;
