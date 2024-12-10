import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/ApiUtils";

export const useRfidData = () => {
    const {currentUser,loading} = useAuth();

    const tenantId = currentUser?.id;

    //Queries
    const {data:rfidCards,error:rfidError} = useQuery({
        queryKey:["rfidCards"],
        queryFn:()=>fetchData("rfid/list",tenantId),
        staleTime: 30000,
    });
    
    const {data:activeCards,error:activeCardsError} = useQuery({
        queryKey:["activeCards"],
        queryFn:()=>fetchData("rfid/count-active",tenantId),
        staleTime: 30000,
    });

    const {data:unassignedCards,error:unassignedCardsError} = useQuery({
        queryKey:["unassignedCards"],
        queryFn:()=>fetchData("rfid/count-inactive",tenantId),
        staleTime: 30000,
    });

    //Error handling
    if(rfidError || activeCardsError || unassignedCardsError){
        console.error("Error fetching rfid data",{
            rfidError,
            activeCardsError,
            unassignedCardsError
        })
    }

    return {
        rfidCards:rfidCards,
        activeCards:activeCards?.data||0,
        unassignedCards:unassignedCards?.data||0,
        loading
    }
}
export default useRfidData;
