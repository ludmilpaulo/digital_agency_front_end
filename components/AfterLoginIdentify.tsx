"use client";

import { useEffect } from "react";
import { identify } from "@/lib/analytics/mixpanel";

interface Props {
  userId: string;
  email?: string;
  name?: string;
  plan?: string;
  createdAt?: string;
}

export default function AfterLoginIdentify(props: Props) {
  useEffect(() => {
    identify(props.userId, {
      email: props.email,
      name: props.name,
      plan: props.plan,
      createdAt: props.createdAt,
    });
  }, [props.userId, props.email, props.name, props.plan, props.createdAt]);

  return null;
}
