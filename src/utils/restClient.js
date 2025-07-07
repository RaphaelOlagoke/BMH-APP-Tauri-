const BASE_URL = 'http://localhost:8080/api/v1';

function getToken() {
    return localStorage.getItem('token');
}

function handleExpiredToken(navigate) {
    localStorage.removeItem('token');
    navigate('/'); // Or use React Router navigate
}

async function request(endpoint, method = 'GET', data = null, includeToken = true,navigate) {
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

        if (res.status === 401 || res.status === 403 ) {
            handleExpiredToken(navigate);
            return null;
        }

        const json = await res.json();
        return json;
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
};

export default restClient;
