import {createAsyncThunk} from "@reduxjs/toolkit";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

export interface CreatePaymentResponse {
    paymentId: number;
    orderId: string;
    invoiceId: string;
    invoiceUrl: string;
}

export const createPayment = createAsyncThunk<
    CreatePaymentResponse,
    void
>(
    'payments/createPayment',
    async (_, thunkAPI) => {
        try {
            const response = await apiFetch(
                '/payments/create',
                {
                    method: 'POST',
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to create payment'
                );
            }

            return await response.json();

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'Failed to create payment'
            );
        }
    }
);