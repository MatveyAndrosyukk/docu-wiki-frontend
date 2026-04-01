import API_BASE_URL from "../../assets/config/api-config";

export const performGetEmailByUsername = async (username: string) => {
    const response = await fetch(`${API_BASE_URL}/users/email-by-username?username=${username}`);

    if (!response.ok) {
        throw new Error('User not found');
    }

    return response.json();
};