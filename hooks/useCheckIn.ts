import { checkInService } from "@/services/checkin/CheckInService";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

interface UseCheckInState {
  isLoading: boolean;
  errorMessage: string | null;
}

export function useCheckIn(qariId: string = "qari-001") {
  const router = useRouter();
  const [state, setState] = useState<UseCheckInState>({
    isLoading: false,
    errorMessage: null,
  });

  const handleCheckIn = useCallback(async () => {
    setState({ isLoading: true, errorMessage: null });

    try {
      const result = await checkInService.checkIn(qariId);

      // Early return — check-in fail ho jaye
      if (!result.success) {
        setState({
          isLoading: false,
          errorMessage: result.errorMessage ?? "دوبارہ کوشش کریں",
        });
        return;
      }

      router.replace("/(tabs)");
    } catch {
      setState({
        isLoading: false,
        errorMessage: "رابطے میں مسئلہ ہے، دوبارہ کوشش کریں",
      });
    }
  }, [qariId, router]);

  return { ...state, handleCheckIn };
}
