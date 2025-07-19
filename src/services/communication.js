import axios from "axios";
// import { getCookie } from "cookies-next";
// import { toast } from "react-toastify";

const nodeEnvironment = process.env.REACT_APP_PUBLIC_NODE_ENV;
const serverUrl = process.env.REACT_APP_PUBLIC_NODE_URL;
const tokenName = process.env.REACT_APP_PUBLIC_TOKENNAME;

export function getServerUrl() {
    if (nodeEnvironment === "development") {
        return serverUrl;
    }

    if (nodeEnvironment === "machine_IP") {
        return serverUrl;
    }

    if (nodeEnvironment === "server") {
        return serverUrl;
    }

    return serverUrl;
}

export const communication = {


    //*******************project Tab APIs*****************//
    createProject: async function (dataToSend) {
        try {
            return axios.post(`${getServerUrl()}/project/create-project`, dataToSend, {
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${getCookie(tokenName)}`,
                },
            });
        } catch (error) {
            console.log(error);
        }
    },
    getProjectList: async function (searchString, page) {
        try {
            console.log(getServerUrl())
            return axios.post(`${getServerUrl()}/project/get-projects-list`, { searchString, page },
                {
                    headers: {
                        "Content-Type": "application/json",// Authorization: `Bearer ${getCookie(tokenName)}`,
                    },
                }
            );
        } catch (error) {
            console.log(error);
        }
    },
    getProjectDetailById: async function (id, controller) {
        try {
            console.log(getServerUrl());
            return axios.post(
                `${getServerUrl()}/project/get-project-by-id`,
                { id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${getCookie(tokenName)}`,
                    },
                    signal: controller ? controller.signal : null,
                }
            );
        } catch (error) {
            console.log(error);
        }
    },
    updateProject: async function (dataToSend) {
        try {
            return await axios.post(`${getServerUrl()}/project/update-project`, dataToSend, {
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${getCookie(tokenName)}`,
                },
            });
        } catch (error) {
            console.log("Update Project Error:", error);
        }
    },
    deleteProject: async function (projectId) {
        try {
            return axios.post(`${getServerUrl()}/project/delete-project`, { id: projectId }, {
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${getCookie(tokenName)}`,
                },
            });
        } catch (error) {
            console.log("Failed to delete project:", error);
        }
    },

    createQuotation: async function (dataToSend) {
        try {
            return axios.post(`${getServerUrl()}/quotation/create-quotation`, dataToSend, {
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${getCookie(tokenName)}`,
                },
            });
        } catch (error) {
            console.log(error);
        }
    },
    getQuotationList: async function (searchString, page) {
        try {
            return axios.post(`${getServerUrl()}/quotation/get-quotation-list`, { searchString, page },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${getCookie(tokenName)}`,
                    },
                });
        } catch (error) {
            console.log(error);
        }
    },



    //*******************lead Tab APIs*****************//
    getDashboardValue: async function (searchString, page) {
        try {
            return axios.post(`${getServerUrl()}/lead/get-lead-list`, { searchString, page },
                {
                    headers: {
                        "Content-Type": "application/json",// Authorization: `Bearer ${getCookie(tokenName)}`,
                    },
                }
            );
        } catch (error) {
            console.log(error);
        }
    },
    // createLead: async function (dataToSend) {
    //     try {
    //         return axios.post(`${getServerUrl()}/lead/create-custom-fields`, dataToSend, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 // Authorization: `Bearer ${getCookie(tokenName)}`,
    //             },
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    // getLeadDetailById: async function (id, controller) {
    //     try {
    //         return axios.post(
    //             `${getServerUrl()}/lead/get-lead-by-id`,
    //             { id },
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     // Authorization: `Bearer ${getCookie(tokenName)}`,
    //                 },
    //                 signal: controller ? controller.signal : null,
    //             }
    //         );
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    // updateLead: async function (id, customFields) {
    //     try {
    //         console.log('dataToSend', id, customFields)
    //         return axios.post(`${getServerUrl()}/lead/update-custom-fields`, { id, customFields }, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 // Authorization: `Bearer ${getCookie(tokenName)}`,
    //             },
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    // removeLead: async function (id) {
    //     console.log(id)
    //     try {
    //         return axios.post(`${getServerUrl()}/lead/disable-lead`, { id }, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //             }
    //         })

    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
    //*******************Inventory Tab APIs*****************//
    getProductList: async function (searchString, page) {
        try {
            return axios.post(`${getServerUrl()}/inventory/get-product-list`, { searchString, page },
                {
                    headers: {
                        "Content-Type": "application/json",// Authorization: `Bearer ${getCookie(tokenName)}`,
                    },
                }
            );
        } catch (error) {
            console.log(error);
        }
    },
    createProduct: async function (formData) {
        try {
            console.log(...formData)
            return axios.post(`${getServerUrl()}/inventory/create-product`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            throw error;
        }
    }

}
