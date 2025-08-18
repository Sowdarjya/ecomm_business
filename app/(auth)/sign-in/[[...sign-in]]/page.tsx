import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "var(--primary)",
            colorPrimaryForeground: "var(--primary-foreground)",
            colorBackground: "var(--background)",
            colorText: "var(--foreground)",
            colorBorder: "var(--border)",
          },
          elements: {
            formButtonPrimary:
              "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
          },
        }}
      />
    </div>
  );
};

export default SignInPage;
