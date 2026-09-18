// hooks/useLogin.ts
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL?.trim();

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = useRef(false);

  const handleLogin = useCallback(async () => {
    const cleanEmail = email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();

    if (!cleanEmail) {
      setEmailError('برائے کرم ای میل درج کریں');
      return;
    }

    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setIsLoading(true);
    setEmailError(null);

    try {
      // 1. Force Send OTP to trigger DB creation
      const response = await fetch(`${API_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setEmailError(data.message || 'OTP ارسال کرنے میں ناکامی');
        return;
      }

      // 2. Only navigate AFTER DB write is confirmed
      router.push({
        pathname: '/otp',
        params: { email: encodeURIComponent(cleanEmail) },
      });
    } catch {
      setEmailError('نیٹ ورک کا مسئلہ ہے۔ دوبارہ کوشش کریں۔');
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  }, [email, router]);

  return {
    email,
    password,
    emailError,
    passwordError,
    isLoading,
    setEmail,
    setPassword,
    handleLogin,
  };
}