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
        staleTime: 30000,
    })
    const {data:attendanceLog,error:attendanceLogError} = useQuery({
        queryKey:["attendanceLog"],
        queryFn:()=>fetchData("attendance/class-present",tenantId),
        staleTime:30000,
    })
    //Error handling
    if(classesError){
        console.error("Error fetching classrooms",classesError);
    } else if(attendanceLogError){
        console.error("Error fetching attendance",attendanceLogError)
    }
    return {
        classes:classes?classes:[],
        attendanceLog:attendanceLog?attendanceLog?.presence:null,
        loading
    };
};

export default useClassData;