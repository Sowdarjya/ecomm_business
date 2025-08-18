import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "var(--primary)", // maroon color
            colorPrimaryForeground: "var(--primary-foreground)", // yellowish text
            colorBackground: "var(--background)", // warm yellow background
            colorText: "var(--foreground)", // deep brown text
            colorBorder: "var(--border)", // golden border
          },
          elements: {
            formButtonPrimary:
              "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90", // maroon button with yellowish text
          },
        }}
      />
    </div>
  );
};

export default SignUpPage;
