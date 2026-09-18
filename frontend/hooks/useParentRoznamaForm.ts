import { useCallback, useEffect, useState } from 'react';
import { useParentStore } from '@/store/useParentStore';
import { parentService } from '@/services/parent/ParentService';
import {
  ParentPrayers,
  ParentRoznamaRecord,
  ParentScreenTime,
  ParentStudentInfo,
} from '@/types/parent.types';

export function useParentRoznamaForm(studentId: string) {
  const { dashboardData, currentDraft, updateDraft, submitRoznama } =
    useParentStore();

  const [student, setStudent] = useState<ParentStudentInfo | null>(
    dashboardData?.student || null
  );

  const [homeArrivalTime, setHomeArrivalTime] = useState<string>('۱۲:۰۵ شام');
  const [prayers, setPrayers] = useState<ParentPrayers>({
    fajr: false,
    asr: false,
    maghrib: false,
    isha: false,
  });
  const [screenTime, setScreenTimeState] = useState<ParentScreenTime>({
    hours: 2,
    minutes: 35,
  });
  const [parentRemarks, setParentRemarks] = useState<string>(
    'عبداللہ بہت تنگ کرتا ہے بہت شرارتی ہے'
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initForm() {
      setIsLoading(true);
      setErrorMessage(null);

      // Student info
      if (dashboardData?.student) {
        setStudent(dashboardData.student);
      }

      // Check draft
      if (currentDraft && Object.keys(currentDraft).length > 0) {
        if (currentDraft.homeArrivalTime) {
          setHomeArrivalTime(currentDraft.homeArrivalTime);
        }
        if (currentDraft.prayers) {
          setPrayers(currentDraft.prayers);
        }
        if (currentDraft.screenTime) {
          setScreenTimeState(currentDraft.screenTime);
        }
        if (currentDraft.parentRemarks !== undefined) {
          setParentRemarks(currentDraft.parentRemarks);
        }
        setIsLoading(false);
        return;
      }

      // Fetch from service if not in draft
      try {
        const fetched = await parentService.getParentRoznama(studentId);
        if (!isMounted) return;

        if (fetched) {
          setHomeArrivalTime(fetched.homeArrivalTime || '۱۲:۰۵ شام');
          setPrayers(
            fetched.prayers || {
              fajr: false,
              asr: false,
              maghrib: false,
              isha: false,
            }
          );
          setScreenTimeState(fetched.screenTime || { hours: 2, minutes: 35 });
          setParentRemarks(
            fetched.parentRemarks || 'عبداللہ بہت تنگ کرتا ہے بہت شرارتی ہے'
          );
        }
      } catch {
        // use defaults
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initForm();

    return () => {
      isMounted = false;
    };
  }, [studentId, dashboardData, currentDraft]);

  // Sync draft to store
  const syncDraft = useCallback(
    (patch: Partial<ParentRoznamaRecord>) => {
      updateDraft({
        studentId,
        homeArrivalTime,
        prayers,
        screenTime,
        parentRemarks,
        ...patch,
      });
    },
    [studentId, homeArrivalTime, prayers, screenTime, parentRemarks, updateDraft]
  );

  const handleSetHomeArrivalTime = useCallback(
    (time: string) => {
      setHomeArrivalTime(time);
      syncDraft({ homeArrivalTime: time });
    },
    [syncDraft]
  );

  const handleTogglePrayer = useCallback(
    (prayerKey: keyof ParentPrayers) => {
      setPrayers((prev) => {
        const updated = { ...prev, [prayerKey]: !prev[prayerKey] };
        syncDraft({ prayers: updated });
        return updated;
      });
    },
    [syncDraft]
  );

  const handleSetScreenTime = useCallback(
    (hours: number, minutes: number) => {
      const updated = { hours, minutes };
      setScreenTimeState(updated);
      syncDraft({ screenTime: updated });
    },
    [syncDraft]
  );

  const handleSetParentRemarks = useCallback(
    (remarks: string) => {
      setParentRemarks(remarks);
      syncDraft({ parentRemarks: remarks });
    },
    [syncDraft]
  );

  const getPreviewRecord = useCallback((): ParentRoznamaRecord => {
    return {
      id: `pr-${Date.now()}`,
      studentId,
      submissionDate: dashboardData?.student.gregorianDate || 'بدھ ، ۳ جون ۲۰۲۶',
      homeArrivalTime,
      prayers,
      screenTime,
      parentRemarks,
      isSubmitted: false,
    };
  }, [
    studentId,
    dashboardData,
    homeArrivalTime,
    prayers,
    screenTime,
    parentRemarks,
  ]);

  const submit = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    const record = getPreviewRecord();
    const success = await submitRoznama(record);
    setIsSubmitting(false);
    return success;
  }, [getPreviewRecord, submitRoznama]);

  return {
    student,
    homeArrivalTime,
    prayers,
    screenTime,
    parentRemarks,
    isLoading,
    isSubmitting,
    errorMessage,
    setHomeArrivalTime: handleSetHomeArrivalTime,
    togglePrayer: handleTogglePrayer,
    setScreenTime: handleSetScreenTime,
    setParentRemarks: handleSetParentRemarks,
    getPreviewRecord,
    submit,
  };
}
