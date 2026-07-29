import API_BASE_URL from "../../assets/config/api-config";


interface RegisterResponse {
    token: string;
}

export async function performRegisterAsync(
    email: string,
    password: string,
    name: string,): Promise<RegisterResponse> {

    console.log({
        email,
        password,
        name,
    });

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, name}),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        const message =
            errorData?.message || 'Registration failed';

        throw new Error(message);
    }

    return response.json();
}