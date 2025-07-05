// panApi.js
import axios from "axios";
import API_BASE_URL from "../config";

// export const verifyPan = async ({ pan_number, customer_id }) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/verify-pan`, {
//       pan_number,
//       customer_id,
//     },
//       {
//         withCredentials: true, // ✅ This is what sets the session
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "PAN verification failed." };
//   }
// };


// export const verifyAadhar = async ({ aadhar_number, customer_id }) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/verify-aadhar-lite`, {
//       aadhar_number,
//       customer_id,
//     },
//       {
//         withCredentials: true, // ✅ This is what sets the session
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Aadhaar verification failed." };
//   }
// };




// export const fetchCustomerProfile = async () => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/customer-profile`, {
//       customer_id: sessionStorage.getItem("customer_id"), 
//        action: "view"
//     }, {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });

//     return response.data; // return the data for the caller to use
//   } catch (error) {
//     console.error("Error fetching customer profile:", error);
//     throw error; // optionally re-throw so caller can handle it
//   }
// };



// // src/apis/locationApi.js

// export const getLocationByPincode = async (pincode) => {
//   try {
//     const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//     const data = await response.json();

//     if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
//       const postOffice = data[0].PostOffice[0];
//       return {
//         city: postOffice.Name || "",
//         mandal: postOffice.Block || "",
//         district: postOffice.District || "",
//         state: postOffice.State || "",
//         country: postOffice.Country || "",
//       };
//     } else {
//       throw new Error("Invalid pincode or no data found.");
//     }
//   } catch (error) {
//     console.error("Failed to fetch location:", error);
//     throw error;
//   }
// };

// export const savePersonalDetails = async (data) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/customer-more-details`,
//       data,
//       {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to save personal details." };
//   }
// };


// export const verifyBank = async ({ account_number, ifsc, customer_id }) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/verify-banck-account`, {
//       account_number,
//       ifsc,
//       customer_id,
//     }, {
//       withCredentials: true,
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Bank verification failed." };
//   }
// };

// export const  uploadDocument = async (formData) => {
//     const response = await axios.post(`${API_BASE_URL}/upload-pdf-document`, formData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true,
//     });
//     return response.data;
// };


// export const submitNomineeDetails = async (formData) => {
//   try {
//     const customer_id = sessionStorage.getItem("customer_id");
//     if (!customer_id) throw { error: "Customer ID missing" };

//     formData.append("customer_id", customer_id); // ✅ append to formData

//     const response = await axios.post(`${API_BASE_URL}/nominee-details`, formData, {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Nominee submission error:", error);
//     throw error?.response?.data || { error: "Something went wrong" };
//   }
// };


export const verifyPanDocument = async (panFile) => {
    const formData = new FormData();
    formData.append("pan_doc", panFile);

    const response = await axios.post(
        `${API_BASE_URL}/verify-pan`,
        formData,
        {
            withCredentials: true, // ✅ Ensures session cookie is sent
           
        }
    );

    return { status: response.status, data: response.data };
}
export const getPanSourceVerificationStatus = async (requestId, customerId) => {
    const url = `${API_BASE_URL}/get-pan-source-verification-status?request_id=${requestId}&customer_id=${customerId}`;

    const response = await fetch(url);
    const data = await response.json();
    return { status: response.status, data };
}



export const verifyAadharDocument = async (file) => {
  const formData = new FormData();
  formData.append("aadhar_doc", file);

  const response = await axios.post(
    `${API_BASE_URL}/verify-aadhar-document`,
    formData,
    {
      withCredentials: true, 
    }
  );

  return { status: response.status, data: response.data };
};


export const getAadharVerificationStatus = async (requestId, customerId) => {
  const response = await axios.get(`${API_BASE_URL}/get-aadhar-verification-status`, {
    params: { request_id: requestId, customer_id: customerId }
  });
  return { status: response.status, data: response.data };
};


export const getLocationByPincode = async (pincode) => {
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
      const postOffice = data[0].PostOffice[0];
      return {
        city: postOffice.Name || "",
        mandal: postOffice.Block || "",
        district: postOffice.District || "",
        state: postOffice.State || "",
        country: postOffice.Country || "",
      };
    } else {
      throw new Error("Invalid pincode or no data found.");
    }
  } catch (error) {
    console.error("Failed to fetch location:", error);
    throw error;
  }
};

export const submitPersonalDetails = (details) => {
  return axios.post(`${API_BASE_URL}/customer-more-details`, details, {
    withCredentials: true,
  });
};