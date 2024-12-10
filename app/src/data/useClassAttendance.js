import { useAuth } from "@/context/AuthContext"
import { fetchData } from "@/utils/ApiUtils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export const useClassAttendanceData = (date) => {
    const {currentUser,loading} = useAuth();
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const tenantId = currentUser?.id;

    //Queries
    const {data:classAttendance,error:classAttendanceError} = useQuery({
        queryKey:["classAttendance",formattedDate],
        queryFn:()=>fetchData(`attendance/class-details?date=${formattedDate}`,tenantId),
        staleTime: 30000,
    })

    const {data:presence,error:presenceError} = useQuery({
        queryKey:["presence"],
        queryFn:()=>fetchData("attendance/count-present",tenantId),
        staleTime: 30000,
    })
    const {data:late,error:lateError} = useQuery({
        queryKey:["late"],
        queryFn:()=>fetchData("attendance/count-late",tenantId),
        staleTime: 30000,
    })
    const {data:absent,error:absentError} = useQuery({
        queryKey:["absent"],
        queryFn:()=>fetchData("attendance/count-absent",tenantId),
        staleTime: 30000,
    })
    //Error handling

    return {
        classAttendance:classAttendance?classAttendance.data:[],
        presence:presence?presence.data:0,
        late:late?late.data:0,
        absent:absent?absent.data:0,
        loading,
    }
}
export default useClassAttendanceData;
