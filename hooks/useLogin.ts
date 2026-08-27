import { Strings } from "@/constants/strings";
import { authService } from "@/services/auth/AuthService";
import { mobileNumberValidator, passwordValidator } from "@/utils/validators";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

interface UseLoginState {
  mobileNumber: string;
  password: string;
  mobileError: string | null;
  passwordError: string | null;
  generalError: string | null;
  isLoading: boolean;
}

export function useLogin() {
  const router = useRouter();
  const [state, setState] = useState<UseLoginState>({
    mobileNumber: "",
    password: "",
    mobileError: null,
    passwordError: null,
    generalError: null,
    isLoading: false,
  });

  const setMobileNumber = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      mobileNumber: value,
      mobileError: null,
      generalError: null,
    }));
  }, []);

  const setPassword = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      password: value,
      passwordError: null,
      generalError: null,
    }));
  }, []);

  const handleLogin = useCallback(async () => {
    const mobileResult = mobileNumberValidator.validate(state.mobileNumber);
    const passwordResult = passwordValidator.validate(state.password);

    // Early return — dono validations fail hote hi UI update karke wapas
    if (!mobileResult.isValid || !passwordResult.isValid) {
      setState((prev) => ({
        ...prev,
        mobileError: mobileResult.errorMessage ?? null,
        passwordError: passwordResult.errorMessage ?? null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, generalError: null }));

    try {
      const result = await authService.login({
        mobileNumber: state.mobileNumber.trim(),
        password: state.password,
      });

      if (!result.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          generalError:
            result.errorMessage ?? Strings.errors.invalidCredentials,
        }));
        return;
      }

      // Success — dashboard par navigate
      router.replace("/check-in" as never);
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        generalError: Strings.errors.networkError,
      }));
    }
  }, [state.mobileNumber, state.password, router]);

  return {
    ...state,
    setMobileNumber,
    setPassword,
    handleLogin,
  };
}
