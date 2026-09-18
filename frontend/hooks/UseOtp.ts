import { useState, useRef, useEffect, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Strings } from '@/constants/strings';

const API_URL = process.env.EXPO_PUBLIC_API_URL?.trim();

// Expo Router Absolute Paths Matching Image Structure
const ROLE_ROUTES: Record<string, string> = {
  QARI: '/check-in',                     // app/check-in.tsx
  PARENT: '/(parent-tabs)',              // app/(parent-tabs)/index.tsx
};

export function useOtp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const rawEmail = (params.email as string) || '';
  const email = decodeURIComponent(rawEmail)
    .replace(/[\s\n\r]+/g, '')
    .toLowerCase()
    .trim();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSubmitting = useRef<boolean>(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    timer > 0 &&
      (interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000));

    return () => {
      interval && clearInterval(interval);
    };
  }, [timer]);

  const handleChangeText = useCallback((text: string, index: number) => {
    const lastChar = text.length > 0 ? text[text.length - 1] : '';
    setOtp((prevOtp) => {
      const updated = [...prevOtp];
      updated[index] = lastChar;
      return updated;
    });
    setError(null);

    lastChar !== '' && index < 5 && inputRefs.current[index + 1]?.focus();
  }, []);

  const handleKeyPress = useCallback((e: any, index: number) => {
    const isBackspace = e.nativeEvent.key === 'Backspace' && index > 0;

    isBackspace &&
      setOtp((prevOtp) => {
        prevOtp[index] === '' && inputRefs.current[index - 1]?.focus();
        return prevOtp;
      });
  }, []);

  const handleVerify = useCallback(async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length < 6) {
      setError('براہ کرم مکمل 6 ہندسوں کا OTP درج کریں');
      return;
    }

    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email, 
          code: otpCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const parsedMessage = Array.isArray(data) 
          ? data[0]?.message 
          : (data.message || 'غلط OTP کوڈ');

        setError(parsedMessage);
        return;
      }

      // Safe Extraction of User Role
      const responseUser = data?.data?.user || data?.user || data?.data;
      const rawRole = responseUser?.role || data?.role || '';
      const userRole = String(rawRole).trim().toUpperCase();

      console.log('✅ OTP Verified. Role Detected:', userRole);

      // Route Selection
      let targetRoute = ROLE_ROUTES[userRole];

      if (!targetRoute) {
        console.warn('⚠️ Unknown or Unmapped Role! Defaulting to /check-in');
        targetRoute = '/check-in';
      }

      console.log('🚀 Redirecting to:', targetRoute);

      // Execute replace navigation
      router.replace(targetRoute as any);
    } catch (err) {
      console.error('Verify Request Exception:', err);
      setError(Strings.errors.networkError);
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  }, [otp, email, router]);

  const handleResend = useCallback(async () => {
    if (timer !== 0) return;

    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    try {
      await fetch(`${API_URL}/api/otp/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });
    } catch (err) {
      console.log('Resend OTP Error:', err);
    }
  }, [timer, email]);

  return {
    email,
    otp,
    timer,
    error,
    isLoading,
    inputRefs,
    handleChangeText,
    handleKeyPress,
    handleVerify,
    handleResend,
  };
}