import {apiFetch} from "./apiFetch";


interface BanUserDto {
    email: string;
    banReason: string;
}

export async function banUserByReasonAsync(dto: BanUserDto) {
    const response = await apiFetch(`/users/ban`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message);
    }
}