import LoadingScreen from "@/components/LoadingScreen";
import axios from "axios";
import { toast } from 'react-toastify';

const BASE_URL = `http://localhost:3000/api/v1`;


export const fetchData = async (endpoint, tenantId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      headers: {
        "x-tenant-id": tenantId,
      },
    });
    if(endpoint.includes("list")|| endpoint === "/attendance/class-details"){
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    // console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

export const handleFileUpload = async(endpoint,tenantId,file) => {
    if(file) {

        const formData = new FormData();
        formData.append('csv',file);

        try {
            const response = await axios.post(`${BASE_URL}/${endpoint}`,formData,{
                headers: {
                'Content-Type': 'multipart/form-data',
                'x-tenant-id': tenantId
                },
            });
            toast("File Uploaded",{type:"success"});
            return response.data;
        } catch (error) {
            toast(error.response.data.error,{type:"error"});
        }
    } else {
        console.error("No file uploaded")
    }
}

export const handleAssignCards = async (tenantId) => {
    try {
        const response = await axios.post(`${BASE_URL}/rfid/assign`,{},{
             headers:{
            'x-tenant-id':tenantId
             },
          });
          // console.log(response.status);
          if(response.status===201){
            toast(response.data.msg,{type:"success"});
          }
          else if(response.status===202){
            toast(response.data.msg,{type:"info"});
          }
          else {
            toast(response.data.msg,{type:"warning"});
          }
          
    } catch (error) {
        toast(error.response.data.message,{type:"error"});
    }
}
export const updateAttendance = async (data, tenantID) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/attendance/manual`,
      { data },
      {
        headers: {
          "x-tenant-id": tenantID,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept 4xx status codes
      }
    );

    if (response.status === 201) {
      toast(response.data.msg, { type: "success" });
    } else if (response.status === 400) {
      toast(response.data.msg, { type: "warning" });
    } else {
      toast(response.data.msg, { type: "info" });
    }
  } catch (error) {
    toast(error.response?.data?.message || "An error occurred", { type: "error" });
  }
};