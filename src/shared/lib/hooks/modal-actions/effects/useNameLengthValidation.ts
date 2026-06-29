import {useEffect} from "react";

interface Params {
    value: string;
    error: string;
    setError: (value: string) => void;
}

export function useNameLengthValidation(
    {
        value,
        error,
        setError,
    }: Params
) {

    useEffect(() => {

        const isTooLong =
            value.length >= 35;

        if (
            isTooLong &&
            error !== "Name is too long"
        ) {
            setError("Name is too long");
        }

        if (
            !isTooLong &&
            error === "Name is too long"
        ) {
            setError("");
        }

    }, [
        value,
        error,
        setError,
    ]);
}