import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiPUT } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import { BiCheckCircle } from "react-icons/bi";

const EmailSubscribeSuccess = () => {
    const param = useParams()
    const updateEmailSubscribe = async () => {
        try {
            const payload = {
                "isEmailSubscribed":false
            }
            const response = await apiPUT(`${API_URL}/v1/email-subscribe/update-by-user/${param?.id}`,payload)
           
        } catch (error) {

        }
    }

    useEffect(() => {
        updateEmailSubscribe()
    }, [])
    return (
        <div class="flex items-center justify-center my-4">
        <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="flex justify-center items-center"><BiCheckCircle   className="text-green-500 text-4xl"/></div>
            <h1 class="text-3xl font-bold mb-4">Email Un-Subscribed Successfully</h1>
            <p class="text-gray-600 mb-4">You have successfully unsubscribed from our email list.</p>
            <p class="text-gray-600">Thank you for being with us.</p>
        </div>
    </div>
    )
}

export default EmailSubscribeSuccess;