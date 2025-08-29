"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignOutButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import toast from "react-hot-toast";
import { getCartQuantity } from "@/actions/product.action";

export function Header() {
  const { isSignedIn, user } = useUser();
  const [cartQuantity, setCartQuantity] = useState(0);

  const fetchCartQuantity = async () => {
    try {
      const quantity = await getCartQuantity();

      if (quantity.success) {
        setCartQuantity(quantity.quantity ?? 0);
      } else {
        toast.error(quantity.message || "Failed to fetch cart quantity");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch cart quantity");
    }
  };

  useEffect(() => {
    fetchCartQuantity();
  }, []);

  const navItems = [
    { name: "Clothing", href: "/#clothing" },
    { name: "About", href: "/#about" },
    { name: "Wishlist", href: "/wishlist" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bengali-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <div className="px-3 py-2">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <SheetClose
                        key={item.name}
                        className="flex flex-col justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                        asChild
                      >
                        <Link href={item.href} className="w-full justify-start">
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Beeচিত্র
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-2">
                <Link href={`/profile/${user.id}`}>
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative cursor-pointer"
                >
                  <Link href="/cart">
                    <ShoppingBag className="h-5 w-5" />
                    {cartQuantity > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-xs text-accent-foreground flex items-center justify-center">
                        {cartQuantity > 0 ? cartQuantity : ""}
                      </span>
                    )}
                    <span className="sr-only">Shopping bag</span>
                  </Link>
                </Button>

                <SignOutButton>
                  <Button
                    variant="outline"
                    className="cursor-pointer text-secondary bg-accent"
                  >
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <SignUpButton>
                <Button
                  variant="outline"
                  className="cursor-pointer text-secondary bg-accent"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
