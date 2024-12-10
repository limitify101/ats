import { useAuth } from "@/context/AuthContext";
import { fetchData } from "@/utils/ApiUtils";
import { useQuery } from "@tanstack/react-query";

export const useReportData = (month, year) => {
    const { currentUser, loading: authLoading } = useAuth();
    const tenantId = currentUser?.id;

    const { data: report, error: reportError, isLoading: queryLoading } = useQuery({
        queryKey: ["report", month, year, tenantId],
        queryFn: () => {
            if (!tenantId) return Promise.reject("Tenant ID is required");

            return fetchData(`attendance/report?month=${month}&year=${year}`, tenantId);
        },
        staleTime: 5000,
        enabled: !!tenantId && !!year && !!month, // Prevent query execution without tenantId, month and year
    });

    if (reportError) {
        console.error("Error fetching report", reportError);
    }

    return {
        report: report ? report.data : null,
        isLoading: authLoading || queryLoading,
        error: reportError,
    };
};
