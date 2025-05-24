import { useCallback } from 'react';
import { toast } from 'react-toastify';

export function useToast() {
    const successToast = useCallback((message: string) => {
        toast.success(message);
    }, [])

    const errorToast = useCallback((message: string) => {
        toast.error(message);
    }, [])

    return { successToast, errorToast };
}