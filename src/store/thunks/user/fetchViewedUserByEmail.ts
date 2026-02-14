import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import API_BASE_URL from "../../../config/api-config";

export const fetchViewedUserByEmail = createAsyncThunk<User, string>(
    'user/fetchViewedUserByEmail',
    async (email, { rejectWithValue }) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `${API_BASE_URL}/users/findOne?email=${email}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const userData = await response.json();

            // 🔥 ИМИТАЦИЯ ДОЛГОЙ ЗАГРУЗКИ СЕРВЕРА (2 секунды)
            // УДАЛИТЕ ЭТО В ПРОДАКШЕНЕ!
            await new Promise(resolve => setTimeout(resolve, 2000));

            return userData;
        } catch (error) {
            // Поддержка rejectWithValue для обработки ошибок в slice
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);