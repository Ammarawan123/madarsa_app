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

    setEmailError(null);
    setPasswordError(null);

    // Basic Validations
    if (!cleanEmail) {
      setEmailError('برائے کرم ای میل درج کریں');
      return;
    }

    if (!password) {
      setPasswordError('برائے کرم پاس ورڈ درج کریں');
      return;
    }

    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setIsLoading(true);

    try {
      // 1. Hit Auth Login Endpoint with email & password
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: cleanEmail, 
          password: password 
        }),
      });

      const data = await response.json();

      // 2. Check if password validation failed (401 / error)
      if (!response.ok || !data.success) {
        setPasswordError(data.message || 'غلط ای میل یا پاس ورڈ');
        return; // STOP execution on invalid password
      }

      // 3. Navigate to OTP screen ONLY after successful password verification
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
  }, [email, password, router]);

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