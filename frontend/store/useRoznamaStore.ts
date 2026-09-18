import { create } from 'zustand';
import { roznamaService } from '@/services/roznama/RoznamaService';
import {
  ManzilEntry,
  RoznamaRecord,
  RoznamaStatus,
  Student,
  StudentType,
} from '@/types/roznama.types';

export type StatusFilter = 'all' | RoznamaStatus;

interface RoznamaState {
  students: Student[];
  records: Record<string, RoznamaRecord>;
  drafts: Record<string, Partial<RoznamaRecord>>;
  selectedClass: StudentType;
  statusFilter: StatusFilter;
  searchQuery: string;
  isLoading: boolean;
  errorMessage: string | null;

  // Actions
  setSelectedClass: (classType: StudentType) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setSearchQuery: (query: string) => void;
  loadStudents: (classType?: StudentType) => Promise<void>;
  updateDraft: (studentId: string, patch: Partial<RoznamaRecord>) => void;
  clearDraft: (studentId: string) => void;
  addManzilEntry: (
    studentId: string,
    entry: Omit<ManzilEntry, 'id'>
  ) => void;
  editManzilEntry: (
    studentId: string,
    entryId: string,
    updated: Partial<ManzilEntry>
  ) => void;
  deleteManzilEntry: (studentId: string, entryId: string) => void;
  saveRoznamaRecord: (record: RoznamaRecord) => Promise<boolean>;
  submitAllRoznamas: () => Promise<boolean>;
  getStudent: (studentId: string) => Student | undefined;
  getRecord: (studentId: string) => RoznamaRecord | undefined;
  getDraft: (studentId: string) => Partial<RoznamaRecord> | undefined;
}

export const useRoznamaStore = create<RoznamaState>((set, get) => ({
  students: [],
  records: {},
  drafts: {},
  selectedClass: 'nazra',
  statusFilter: 'all',
  searchQuery: '',
  isLoading: false,
  errorMessage: null,

  setSelectedClass: (selectedClass: StudentType) => {
    set({ selectedClass });
  },

  setStatusFilter: (statusFilter: StatusFilter) => {
    set({ statusFilter });
  },

  setSearchQuery: (searchQuery: string) => {
    set({ searchQuery });
  },

  loadStudents: async (classType?: StudentType) => {
    set({ isLoading: true, errorMessage: null });
    try {
      const data = await roznamaService.getStudents();
      set({ students: data, isLoading: false });
    } catch {
      set({ errorMessage: 'طلبہ کی فہرست لوڈ نہیں ہو سکی', isLoading: false });
    }
  },

  updateDraft: (studentId: string, patch: Partial<RoznamaRecord>) => {
    set((state) => {
      const currentDraft = state.drafts[studentId] || {};
      const newDraft = { ...currentDraft, ...patch, studentId };

      const updatedStudents = state.students.map((s) => {
        if (s.id === studentId && s.status === 'pending') {
          return { ...s, status: 'draft' as RoznamaStatus };
        }
        return s;
      });

      return {
        drafts: {
          ...state.drafts,
          [studentId]: newDraft,
        },
        students: updatedStudents,
      };
    });
  },

  clearDraft: (studentId: string) => {
    set((state) => {
      const newDrafts = { ...state.drafts };
      delete newDrafts[studentId];
      return { drafts: newDrafts };
    });
  },

  addManzilEntry: (studentId: string, entryData: Omit<ManzilEntry, 'id'>) => {
    set((state) => {
      const currentDraft = state.drafts[studentId] || {};
      const currentEntries = currentDraft.manzilEntries || [];
      const newEntry: ManzilEntry = {
        ...entryData,
        id: `manzil-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };

      const updatedDraft = {
        ...currentDraft,
        studentId,
        hasManzil: true,
        manzilEntries: [...currentEntries, newEntry],
      };

      const updatedStudents = state.students.map((s) => {
        if (s.id === studentId && s.status === 'pending') {
          return { ...s, status: 'draft' as RoznamaStatus };
        }
        return s;
      });

      return {
        drafts: {
          ...state.drafts,
          [studentId]: updatedDraft,
        },
        students: updatedStudents,
      };
    });
  },

  editManzilEntry: (
    studentId: string,
    entryId: string,
    updated: Partial<ManzilEntry>
  ) => {
    set((state) => {
      const currentDraft = state.drafts[studentId] || {};
      const currentEntries = currentDraft.manzilEntries || [];
      const updatedEntries = currentEntries.map((item) =>
        item.id === entryId ? { ...item, ...updated } : item
      );

      return {
        drafts: {
          ...state.drafts,
          [studentId]: {
            ...currentDraft,
            manzilEntries: updatedEntries,
          },
        },
      };
    });
  },

  deleteManzilEntry: (studentId: string, entryId: string) => {
    set((state) => {
      const currentDraft = state.drafts[studentId] || {};
      const currentEntries = currentDraft.manzilEntries || [];
      const updatedEntries = currentEntries.filter((item) => item.id !== entryId);

      return {
        drafts: {
          ...state.drafts,
          [studentId]: {
            ...currentDraft,
            manzilEntries: updatedEntries,
          },
        },
      };
    });
  },

  saveRoznamaRecord: async (record: RoznamaRecord) => {
    try {
      const success = await roznamaService.saveRoznama(record);
      if (!success) return false;

      const completedRecord: RoznamaRecord = {
        ...record,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };

      set((state) => {
        const newDrafts = { ...state.drafts };
        delete newDrafts[record.studentId];

        const updatedStudents = state.students.map((s) =>
          s.id === record.studentId
            ? { ...s, status: 'completed' as RoznamaStatus }
            : s
        );

        return {
          records: {
            ...state.records,
            [record.studentId]: completedRecord,
          },
          students: updatedStudents,
          drafts: newDrafts,
        };
      });

      return true;
    } catch {
      return false;
    }
  },

  submitAllRoznamas: async () => {
    try {
      const success = await roznamaService.submitAllRoznamas();
      if (!success) return false;

      set((state) => ({
        students: state.students.map((s) => ({
          ...s,
          status: 'completed' as RoznamaStatus,
        })),
      }));

      return true;
    } catch {
      return false;
    }
  },

  getStudent: (studentId: string) => {
    return get().students.find((s) => s.id === studentId);
  },

  getRecord: (studentId: string) => {
    return get().records[studentId];
  },

  getDraft: (studentId: string) => {
    return get().drafts[studentId];
  },
}));
