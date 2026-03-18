import API_BASE_URL from "../../assets/config/api-config";

export async function apiFetch(url: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem('accessToken');

    let response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            localStorage.clear();
            throw new Error('Unauthorized');
        }

        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
            localStorage.clear();
            throw new Error('Session expired');
        }

        const data = await refreshResponse.json();

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${data.accessToken}`,
            },
        });
    }

    return response;
}