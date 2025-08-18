import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
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

export default SignUpPage;
