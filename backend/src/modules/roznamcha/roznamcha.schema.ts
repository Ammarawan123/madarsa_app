import { z } from 'zod';

export const submitHifzReportSchema = z.object({
  student_id: z.number({ message: 'Student ID required is a number' }),
  reciter_type: z.string().optional().default('qari'),
  reciter_student_name: z.string().optional(),
  completed_para: z.number().optional(),
  sabaq_surah_from: z.string().optional(),
  sabaq_surah_to: z.string().optional(),
  sabqi_mistakes: z.number().optional().default(0),
  manzil_details: z.string().optional(),
  manzil_recited: z.boolean().optional(),
  status: z.string().optional().default('submitted'),
});

export const submitNazraReportSchema = z.object({
  student_id: z.number({ message: 'Student ID required is a number' }),
  reciter_type: z.string().optional().default('qari'),
  reciter_student_name: z.string().optional(),
  qaida_name: z.string().optional(),
  takhti_number: z.number().optional(),
  mistakes: z.number().optional().default(0),
  teacher_remarks: z.string().optional(),
  status: z.string().optional().default('submitted'),
});

export const submitParentReportSchema = z.object({
  student_id: z.number({ message: 'Student ID required is a number' }),
  home_arrival_time: z.string().optional(),
  fajr_offered: z.boolean().optional().default(false),
  zuhr_offered: z.boolean().optional().default(false),
  asr_offered: z.boolean().optional().default(false),
  maghrib_offered: z.boolean().optional().default(false),
  isha_offered: z.boolean().optional().default(false),
  screen_time_hours: z.number().optional().default(0),
  screen_time_minutes: z.number().optional().default(0),
  parent_remarks: z.string().optional(),
  status: z.string().optional().default('submitted'),
});

export const roznamchaStudentParamSchema = z.object({
  studentId: z.string().regex(/^\d+$/, 'Student ID must be a valid number string'),
});

export type SubmitParentReportInput = z.infer<typeof submitParentReportSchema>;
export type RoznamchaStudentParamInput = z.infer<typeof roznamchaStudentParamSchema>;