import { useAuth } from "@/context/AuthContext"
import { fetchData } from "@/utils/ApiUtils";
import { useQuery } from "@tanstack/react-query";

export const useClassData = () => {

    const {currentUser,loading} = useAuth();
    const tenantId = currentUser?.id;

    //Queries
    const {data:classes,error:classesError} = useQuery({
        queryKey:["classes"],
        queryFn:()=>fetchData("student/list-classes", tenantId),
        staleTime: 5000,
    })
    const {data:attendanceLog,error:attendanceLogError} = useQuery({
        queryKey:["attendanceLog"],
        queryFn:()=>fetchData("attendance/class-present",tenantId),
        staleTime:5000,
    })

    return {
        classes:classes?classes:[],
        attendanceLog:attendanceLog?attendanceLog?.presence:null,
        loading
    };
};

export default useClassData;