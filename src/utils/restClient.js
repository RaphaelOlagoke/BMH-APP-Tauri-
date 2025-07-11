import axios from "axios";

export const BASE_URL = 'https://bmh-backend-api.onrender.com';

function getToken() {
    return localStorage.getItem('token');
}

function handleExpiredToken(navigate) {
    localStorage.removeItem('token');
    navigate('/', { replace: true }); // Or use React Router navigate
}

// async function request(endpoint, method = 'GET', data = null, includeToken = true,navigate) {
//     const headers = {
//         'Content-Type': 'application/json',
//     };
//
//     if (includeToken) {
//         const token = getToken();
//         if (token) {
//             headers['Authorization'] = `Bearer ${token}`;
//         }
//     }
//
//     const config = {
//         method,
//         headers,
//     };
//
//     if (data) {
//         config.body = JSON.stringify(data);
//     }
//
//     try {
//         const res = await fetch(`${BASE_URL}${endpoint}`, config);
//
//         if (res.status === 401 || res.status === 403 ) {
//             handleExpiredToken(navigate);
//             return null;
//         }
//
//         const json = await res.json();
//         return json;
//     } catch (err) {
//         console.error('API error:', err);
//         throw err;
//     }
// }
async function request(endpoint, method = 'GET', data = null, includeToken = true, navigate, expectJson = true) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (includeToken) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, config);

        if (res.status === 401 || res.status === 403) {
            handleExpiredToken(navigate);
            return null;
        }

        if (expectJson) {
            return await res.json(); // For JSON APIs
        } else {
            return await res.text(); // For Base64 and other plain text responses
        }
    } catch (err) {
        console.error('API error:', err);
        throw err;
    }
}


// Exported methods
const restClient = {
    get: (endpoint, navigate) => request(endpoint, 'GET', null, true, navigate),
    post: (endpoint, data, navigate) => request(endpoint, 'POST', data, true, navigate),
    put: (endpoint, data, navigate) => request(endpoint, 'PUT', data, true, navigate),
    delete: (endpoint, navigate) => request(endpoint, 'DELETE', null, true, navigate),
    postWithoutToken: (endpoint, data) => request(endpoint, 'POST', data, false),

    getText: (endpoint, navigate) => request(endpoint, 'GET', null, true, navigate, false),
    download: async (url, navigate) => {
        try {
            const token = getToken();
            const res = await axios.get(url, {
                responseType: "blob",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log(res);
            return res.data;
        } catch (error) {
            console.error("Download error", error);
            navigate("/login"); // or whatever error handler
            return null;
        }
    }
};

export default restClient;
