import {apiFetch} from "./apiFetch";


export async function unbanUserByReasonAsync(email: string) {
    const response = await apiFetch('/users/unban', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData.message);
    }
}