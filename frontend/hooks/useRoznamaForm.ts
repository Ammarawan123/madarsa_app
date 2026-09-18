import { useCallback, useEffect, useState } from 'react';
import { useRoznamaStore } from '@/store/useRoznamaStore';
import { roznamaService } from '@/services/roznama/RoznamaService';
import {
  LessonStage,
  ManzilEntry,
  RoznamaRecord,
  Student,
} from '@/types/roznama.types';

export function useRoznamaForm(studentId: string) {
  const {
    students,
    getStudent,
    getRecord,
    getDraft,
    updateDraft,
    addManzilEntry,
    editManzilEntry,
    deleteManzilEntry,
    saveRoznamaRecord,
  } = useRoznamaStore();

  const [student, setStudent] = useState<Student | null>(null);

  // Sabaq fields
  const [hasSabaq, setHasSabaq] = useState<boolean>(false);
  const [lessonStage, setLessonStage] = useState<LessonStage>('qaeda');
  const [boardNumber, setBoardNumber] = useState<string>('5');
  const [sabaqFrom, setSabaqFrom] = useState<string>('سورۃ البقرہ، آیت ۵');
  const [sabaqTo, setSabaqTo] = useState<string>('سورۃ البقرہ، آیت ۱۲');

  // Sabqi fields
  const [hasSabqi, setHasSabqi] = useState<boolean>(false);
  const [sabqiMistakes, setSabqiMistakes] = useState<string>('5');

  // Hifz Specific fields
  const [isParaComplete, setIsParaComplete] = useState<boolean>(false);
  const [completedParaNumber, setCompletedParaNumber] = useState<string>('۱ الم');
  const [hasManzil, setHasManzil] = useState<boolean>(false);
  const [manzilEntries, setManzilEntries] = useState<ManzilEntry[]>([]);

  // Teacher Opinion
  const [teacherOpinion, setTeacherOpinion] = useState<string>('اے - ون');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or fetch data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setErrorMessage(null);

      let currentStudent = getStudent(studentId);
      if (!currentStudent && students.length > 0) {
        currentStudent = students.find((s) => s.id === studentId);
      }

      if (!currentStudent) {
        try {
          const list = await roznamaService.getStudents();
          currentStudent = list.find((s) => s.id === studentId);
        } catch {
          // ignore
        }
      }

      if (!isMounted) return;

      if (!currentStudent) {
        setErrorMessage('طالب علم نہیں ملا');
        setIsLoading(false);
        return;
      }

      setStudent(currentStudent);

      // Check draft first, then saved record, then fetch from strategy
      const draft = getDraft(studentId);
      const saved = getRecord(studentId);

      if (draft && Object.keys(draft).length > 0) {
        setHasSabaq(draft.hasSabaq ?? draft.sabaqRecited ?? false);
        setLessonStage(draft.lessonStage ?? 'qaeda');
        setBoardNumber(String(draft.boardNumber ?? '5'));
        setSabaqFrom(draft.sabaqFrom ?? 'سورۃ البقرہ، آیت ۵');
        setSabaqTo(draft.sabaqTo ?? 'سورۃ البقرہ، آیت ۱۲');

        setHasSabqi(draft.hasSabqi ?? draft.sabqiRecited ?? false);
        setSabqiMistakes(String(draft.sabqiMistakes ?? '5'));

        setIsParaComplete(draft.isParaComplete ?? draft.paraComplete ?? false);
        setCompletedParaNumber(String(draft.completedParaNumber ?? '۱ الم'));
        setHasManzil(draft.hasManzil ?? draft.manzilRecited ?? false);
        setManzilEntries(draft.manzilEntries || []);

        setTeacherOpinion(draft.teacherOpinion ?? 'اے - ون');
        setIsLoading(false);
        return;
      }

      if (saved) {
        setHasSabaq(saved.hasSabaq ?? saved.sabaqRecited ?? false);
        setLessonStage(saved.lessonStage ?? 'qaeda');
        setBoardNumber(String(saved.boardNumber ?? '5'));
        setSabaqFrom(saved.sabaqFrom || 'سورۃ البقرہ، آیت ۵');
        setSabaqTo(saved.sabaqTo || 'سورۃ البقرہ، آیت ۱۲');

        setHasSabqi(saved.hasSabqi ?? saved.sabqiRecited ?? false);
        setSabqiMistakes(String(saved.sabqiMistakes ?? '5'));

        setIsParaComplete(saved.isParaComplete ?? saved.paraComplete ?? false);
        setCompletedParaNumber(String(saved.completedParaNumber || '۱ الم'));
        setHasManzil(saved.hasManzil ?? saved.manzilRecited ?? false);
        setManzilEntries(saved.manzilEntries || []);

        setTeacherOpinion(saved.teacherOpinion || 'اے - ون');
        setIsLoading(false);
        return;
      }

      try {
        const fetched = await roznamaService.getStudentRoznama(studentId);
        if (!isMounted) return;

        if (fetched) {
          setHasSabaq(fetched.hasSabaq ?? fetched.sabaqRecited ?? false);
          setLessonStage(fetched.lessonStage ?? 'qaeda');
          setBoardNumber(String(fetched.boardNumber ?? '5'));
          setSabaqFrom(fetched.sabaqFrom || 'سورۃ البقرہ، آیت ۵');
          setSabaqTo(fetched.sabaqTo || 'سورۃ البقرہ، آیت ۱۲');

          setHasSabqi(fetched.hasSabqi ?? fetched.sabqiRecited ?? false);
          setSabqiMistakes(String(fetched.sabqiMistakes ?? '5'));

          setIsParaComplete(fetched.isParaComplete ?? fetched.paraComplete ?? false);
          setCompletedParaNumber(String(fetched.completedParaNumber || '۱ الم'));
          setHasManzil(fetched.hasManzil ?? fetched.manzilRecited ?? false);
          setManzilEntries(fetched.manzilEntries || []);

          setTeacherOpinion(fetched.teacherOpinion || 'اے - ون');
        }
      } catch {
        // use defaults
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [studentId, getStudent, getDraft, getRecord, students]);

  // Keep draft in sync with Zustand
  const syncDraft = useCallback(
    (patch: Partial<RoznamaRecord>) => {
      updateDraft(studentId, {
        hasSabaq,
        sabaqRecited: hasSabaq,
        lessonStage,
        boardNumber,
        sabaqFrom,
        sabaqTo,
        hasSabqi,
        sabqiRecited: hasSabqi,
        sabqiMistakes,
        isParaComplete,
        paraComplete: isParaComplete,
        completedParaNumber,
        hasManzil,
        manzilRecited: hasManzil,
        manzilEntries,
        teacherOpinion,
        ...patch,
      });
    },
    [
      studentId,
      hasSabaq,
      lessonStage,
      boardNumber,
      sabaqFrom,
      sabaqTo,
      hasSabqi,
      sabqiMistakes,
      isParaComplete,
      completedParaNumber,
      hasManzil,
      manzilEntries,
      teacherOpinion,
      updateDraft,
    ]
  );

  const handleHasSabaqChange = useCallback(
    (val: boolean) => {
      setHasSabaq(val);
      syncDraft({ hasSabaq: val, sabaqRecited: val });
    },
    [syncDraft]
  );

  const handleHasSabqiChange = useCallback(
    (val: boolean) => {
      setHasSabqi(val);
      syncDraft({ hasSabqi: val, sabqiRecited: val });
    },
    [syncDraft]
  );

  const handleIsParaCompleteChange = useCallback(
    (val: boolean) => {
      setIsParaComplete(val);
      syncDraft({ isParaComplete: val, paraComplete: val });
    },
    [syncDraft]
  );

  const handleHasManzilChange = useCallback(
    (val: boolean) => {
      setHasManzil(val);
      syncDraft({ hasManzil: val, manzilRecited: val });
    },
    [syncDraft]
  );

  const handleAddManzil = useCallback(
    (entry: Omit<ManzilEntry, 'id'>) => {
      const newEntry: ManzilEntry = {
        ...entry,
        id: `manzil-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      const updated = [...manzilEntries, newEntry];
      setManzilEntries(updated);
      setHasManzil(true);
      addManzilEntry(studentId, entry);
    },
    [studentId, manzilEntries, addManzilEntry]
  );

  const handleEditManzil = useCallback(
    (id: string, updatedFields: Partial<ManzilEntry>) => {
      const updated = manzilEntries.map((m) =>
        m.id === id ? { ...m, ...updatedFields } : m
      );
      setManzilEntries(updated);
      editManzilEntry(studentId, id, updatedFields);
    },
    [studentId, manzilEntries, editManzilEntry]
  );

  const handleDeleteManzil = useCallback(
    (id: string) => {
      const updated = manzilEntries.filter((m) => m.id !== id);
      setManzilEntries(updated);
      deleteManzilEntry(studentId, id);
    },
    [studentId, manzilEntries, deleteManzilEntry]
  );

  const getPreviewRecord = useCallback((): RoznamaRecord => {
    const isHifz =
      student?.studentType === 'hifz' || student?.classType === 'hifz';

    return {
      studentId,
      studentName: student?.name ?? 'فاطمہ خان',
      rollNumber: student?.rollNumber ?? '۴',
      studentType: isHifz ? 'hifz' : 'nazra',
      classType: isHifz ? 'hifz' : 'nazra',
      className: student?.className ?? (isHifz ? 'حفظ' : 'ناظرہ'),
      status: student?.status ?? 'pending',
      hasSabaq,
      sabaqRecited: hasSabaq,
      lessonStage: isHifz ? null : lessonStage,
      boardNumber: isHifz ? null : boardNumber,
      sabaqFrom: isHifz ? sabaqFrom : '',
      sabaqTo: isHifz ? sabaqTo : '',
      hasSabqi,
      sabqiRecited: hasSabqi,
      sabqiMistakes,
      isParaComplete: isHifz ? isParaComplete : false,
      paraComplete: isHifz ? isParaComplete : false,
      completedParaNumber: isHifz ? completedParaNumber : null,
      hasManzil: isHifz ? hasManzil : false,
      manzilRecited: isHifz ? hasManzil : false,
      manzilEntries: isHifz ? manzilEntries : [],
      teacherOpinion,
      updatedAt: new Date().toISOString(),
    };
  }, [
    studentId,
    student,
    hasSabaq,
    lessonStage,
    boardNumber,
    sabaqFrom,
    sabaqTo,
    hasSabqi,
    sabqiMistakes,
    isParaComplete,
    completedParaNumber,
    hasManzil,
    manzilEntries,
    teacherOpinion,
  ]);

  const submit = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    const record = getPreviewRecord();
    const success = await saveRoznamaRecord(record);
    setIsSubmitting(false);
    return success;
  }, [getPreviewRecord, saveRoznamaRecord]);

  const isHifz =
    student?.studentType === 'hifz' || student?.classType === 'hifz';

  return {
    student,
    isHifz,
    // Sabaq
    hasSabaq,
    sabaqRecited: hasSabaq,
    lessonStage,
    boardNumber,
    sabaqFrom,
    sabaqTo,
    // Sabqi
    hasSabqi,
    sabqiRecited: hasSabqi,
    sabqiMistakes,
    // Hifz Specific
    isParaComplete,
    paraComplete: isParaComplete,
    completedParaNumber,
    hasManzil,
    manzilRecited: hasManzil,
    manzilEntries,
    // Teacher Opinion
    teacherOpinion,
    isLoading,
    isSubmitting,
    errorMessage,
    // Setters
    setHasSabaq: handleHasSabaqChange,
    setLessonStage: (stg: LessonStage) => {
      setLessonStage(stg);
      syncDraft({ lessonStage: stg });
    },
    setBoardNumber: (b: string) => {
      setBoardNumber(b);
      syncDraft({ boardNumber: b });
    },
    setSabaqFrom: (f: string) => {
      setSabaqFrom(f);
      syncDraft({ sabaqFrom: f });
    },
    setSabaqTo: (t: string) => {
      setSabaqTo(t);
      syncDraft({ sabaqTo: t });
    },
    setHasSabqi: handleHasSabqiChange,
    setSabqiMistakes: (m: string) => {
      setSabqiMistakes(m);
      syncDraft({ sabqiMistakes: m });
    },
    setIsParaComplete: handleIsParaCompleteChange,
    setCompletedParaNumber: (p: string) => {
      setCompletedParaNumber(p);
      syncDraft({ completedParaNumber: p });
    },
    setHasManzil: handleHasManzilChange,
    addManzil: handleAddManzil,
    editManzil: handleEditManzil,
    deleteManzil: handleDeleteManzil,
    setTeacherOpinion: (t: string) => {
      setTeacherOpinion(t);
      syncDraft({ teacherOpinion: t });
    },
    getPreviewRecord,
    submit,
  };
}
