import {apiFetch} from "./apiFetch";


export async function deleteExtraImagesAsync(extraImages: string[]) {
    if (extraImages.length === 0) {
        return {deleted: 0};
    }

    const response = await apiFetch(`/images/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({delete_urls: extraImages}),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete images');
    }

    return await response.json();
}