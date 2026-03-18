import {apiFetch} from "./apiFetch";

export async function uploadImageAsync(file: File): Promise<{ fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiFetch(`/images`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Upload error`);
    }

    return await response.json();
}