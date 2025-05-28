// app/FetchAboutUsClient.tsx
"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { fetchAboutUs } from "@/redux/slices/aboutUsSlice";

export default function FetchAboutUsClient() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAboutUs());
  }, [dispatch]);
  return null; // This component does not render anything
}
