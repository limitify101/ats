import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/ApiUtils";
import { useMemo } from "react";

export const useNotifications = () => {
  const { currentUser } = useAuth();

  // Return immediately if `currentUser.id` is missing to prevent unnecessary errors.
  const tenantId = currentUser?.id;
  if (!tenantId) {
    console.warn("Waiting for User ID");
  }

  // Use `useQuery` to fetch notification data.
  const { data, error, isLoading } = useQuery({
    queryKey: ["nextLog", tenantId],
    queryFn: () => fetchData("cron-schedule", tenantId),
    staleTime: 5000, // Customize based on use case.
  });

  // Process `data` to ensure it has meaningful values.
  const nextLog = useMemo(() => {
    if (!data?.initializeAttendance || !data?.setAbsent) return null;
    return data;
  }, [data]);

  // Return structured output with error handling.
  return {
    nextLog, // Processed notification data.
    isLoading, // Indicates whether the query is still fetching.
    isError: !!error, // True if an error occurred.
  };
};
