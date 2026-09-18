import { z } from 'zod';

// Shared Status Enum
export const AttendanceStatusEnum = z.enum(['PRESENT', 'ABSENT', 'LEAVE', 'LATE'], {
  message: 'Status must be PRESENT, ABSENT, LEAVE, or LATE',
});

// 1. Mark Qari Self Attendance
export const markQariSelfAttendanceSchema = z.object({
  status: AttendanceStatusEnum,
  remarks: z.string().optional(),
});

// 2. Mark Student Attendance
export const markStudentAttendanceSchema = z.object({
  studentId: z.number({ message: 'Student ID required is a number' }),
  status: AttendanceStatusEnum,
  remarks: z.string().optional(),
});

// 3. Student Param Params Schema
export const studentParamSchema = z.object({
  studentId: z.string().regex(/^\d+$/, 'Student ID must be a valid number string'),
});

// TypeScript Types Export
export type MarkQariSelfAttendanceInput = z.infer<typeof markQariSelfAttendanceSchema>;
export type MarkStudentAttendanceInput = z.infer<typeof markStudentAttendanceSchema>;
export type StudentParamInput = z.infer<typeof studentParamSchema>;