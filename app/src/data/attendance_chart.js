import { useAuth } from "@/context/AuthContext";
import { fetchData } from "@/utils/ApiUtils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export const useChartsData = (month) => {
  const {currentUser,loading} = useAuth();
  const tenantId = currentUser?.id;
  const year = dayjs(new Date()).year();
  
  const {data:report,error:classesError} = useQuery({
    queryKey:["report"],
    queryFn:()=>fetchData(`attendance/report?month=${month}&year=${year}`, tenantId),
    staleTime: 30000,
    enabled: !!tenantId && !!month,
  })
  const {data:week,error:weeklyAttendanceError} = useQuery({
    queryKey:["week"],
    queryFn:()=>fetchData("attendance/weekly-summary",tenantId),
    staleTime:30000,
    enabled: !!tenantId
  })
  if(classesError){
    console.error("Error fetching classrooms",classesError);
  }
  if(weeklyAttendanceError){
    console.error("Error fetching weekly attendance summary",weeklyAttendanceError);
  } 
   const classNames = Array.isArray(report?.data?.metadata) && report?.data?.metadata.slice() // Create a shallow copy of the array to avoid mutating the original
  .sort((a, b) => {
    // Sorting by `data.class`, assuming it's a string
    if (a.class < b.class) return -1; // Sort in ascending order
    if (a.class > b.class) return 1;
    return 0;
  }).map((classItem) => classItem.class) || [];
  const attendances = Array.isArray(report?.data?.metadata) && report?.data?.metadata.slice() // Create a shallow copy of the array to avoid mutating the original
  .sort((a, b) => {
    // Sorting by `data.class`, assuming it's a string
    if (a.class < b.class) return -1; // Sort in ascending order
    if (a.class > b.class) return 1;
    return 0;
  }).map((classItem)=>classItem.attendances) || [];
  
  return {
    classNames,
    attendances,
    week: week? week.weeklyAttendance:{},
    loading
  }
}

export default useChartsData;