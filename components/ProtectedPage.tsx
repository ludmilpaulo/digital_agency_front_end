"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../redux/store";

// You can add your User type if you want stricter typing!
type Props = { [key: string]: unknown };

const withAuth = <P extends Props>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
      if (!user) {
        router.replace("/LoginScreenUser");
      }
    }, [user, router]);

    if (!user) return null; // Or a loading spinner

    return <WrappedComponent {...props} />;
  };

  // Optionally give the wrapper a display name for debugging
  Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return Wrapper;
};

export default withAuth;
