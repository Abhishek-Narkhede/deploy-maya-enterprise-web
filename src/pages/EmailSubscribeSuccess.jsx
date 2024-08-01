import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiDELETE, apiPUT } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import { BiCheckCircle } from "react-icons/bi";

const EmailSubscribeSuccess = () => {
    const param = useParams()
    const [loading, setLoading] = useState(false)
    const deleteEmailSubscriber = async () => {
        try {
            const response = await apiDELETE(`${API_URL}/v1/email-subscribe/delete-by-userId/${param?.id}`)
            if (response.status) {
                console.log(response);
            }
        } catch (error) {
            toast.error('Error Unsubscribing User')
        }
    }

    useEffect(() => {
        deleteEmailSubscriber()
    }, [])
    return (
        <>
            {
                loading ? (<div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-green-600" ></div>
                ) : (<div class="flex items-center justify-center my-4">
                    <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                        <div className="flex justify-center items-center"><BiCheckCircle className="text-green-500 text-4xl" /></div>
                        <h1 class="text-3xl font-bold mb-4">Email Un-Subscribed Successfully</h1>
                        <p class="text-gray-600 mb-4">You have successfully unsubscribed from our email list.</p>
                        <p class="text-gray-600">Thank you for being with us.</p>
                    </div>
                </div>)
            }
        </>
    )
}

export default EmailSubscribeSuccess;