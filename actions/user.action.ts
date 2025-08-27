"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getDefaultAddress = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Authentication required" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, address: user.address || "" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch address" };
  }
};

export const setDefaultAddress = async (address: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Authentication required" };
    }

    if (!address || address.trim() === "") {
      return { success: false, message: "Address is required" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { address: address.trim() },
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to set default address" };
  }
};
