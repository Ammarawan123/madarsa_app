import { z } from 'zod';

// Shared Status Enum (Sirf PRESENT, ABSENT, LEAVE)
export const AttendanceStatusEnum = z.enum(['PRESENT', 'ABSENT', 'LEAVE'], {
  message: 'Status must be PRESENT, ABSENT, or LEAVE',
});

export const markStudentAttendanceSchema = z.object({
  studentId: z.number(),
  status: z.enum(['PRESENT', 'ABSENT', 'LEAVE']),
  remarks: z.string().optional(),
});

export const markQariSelfAttendanceSchema = z.object({
  status: z.enum(['PRESENT', 'ABSENT', 'LEAVE']),
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