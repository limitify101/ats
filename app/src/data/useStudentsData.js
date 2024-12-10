import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/ApiUtils";

export const useStudentsData = (studentID) => {
  const { currentUser } = useAuth();

  // Ensure `currentUser` is available before making requests
  if (!currentUser?.id) {
    throw new Error("User ID is missing from the authentication context.");
  }

  const tenantId = currentUser.id;

  // Queries
  const { data: students, error: studentsError } = useQuery({
    queryKey: ["students",studentID],
    queryFn: () => fetchData("student/list", tenantId),
    staleTime: 30000,
    enabled:!!tenantId 
  });

  const {data:student,error:studentError} = useQuery({
    queryKey:['student'],
    queryFn:()=> fetchData(`student/search/${studentID}`,tenantId),
    enabled:!!tenantId && !!studentID,
    staleTime:5000,
  })

  const { data: activeStudents, error: activeStudentsError } = useQuery({
    queryKey: ["activeStudents"],
    queryFn: () => fetchData("student/active-students", tenantId),
    staleTime: 30000,
    enabled:!!tenantId
  });

  const { data: unassignedStudents, error: unassignedStudentsError } = useQuery({
    queryKey: ["unassignedStudents"],
    queryFn: () => fetchData("student/unassigned-students", tenantId),
    staleTime: 30000,
    enabled:!!tenantId
  });

  // Error handling
  if (studentsError || activeStudentsError || unassignedStudentsError || studentError) {
    console.error("Error fetching student data", {
      studentsError,
      activeStudentsError,
      unassignedStudentsError,
    });
  }
  return {
    students:students,
    student:student?student.data:null,
    activeStudents: activeStudents?.activeStudents.length || 0,
    unassignedStudents: unassignedStudents?.unassignedStudents.length || 0,
  };
};

export default useStudentsData;
