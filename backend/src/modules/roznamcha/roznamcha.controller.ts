import { FastifyRequest, FastifyReply } from 'fastify';
import { RoznamchaService } from './roznamcha.service';
import {
  submitParentReportSchema,
  roznamchaStudentParamSchema,
  submitHifzReportSchema,
  submitNazraReportSchema,
} from './roznamcha.schema';

const service = new RoznamchaService();

const handleServiceError = (reply: FastifyReply, err: any) => {
  const errorMap: Record<string, { status: number; message: string }> = {
    QARI_NOT_FOUND: { status: 404, message: 'Qari profile not found' },
    PARENT_NOT_FOUND: { status: 404, message: 'Parent profile not found' },
    FORBIDDEN_NOT_YOUR_CHILD: { status: 403, message: 'Unauthorized: Access restricted to your own child' },
    INVALID_TRACK_TYPE: { status: 400, message: 'Invalid track type specified' },
  };

  const matchedError = errorMap[err.message];
  if (matchedError) {
    return reply.status(matchedError.status).send({ success: false, message: matchedError.message });
  }

  throw err;
};

export async function submitQariRoznamchaHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number };
  
  // Basic payload runtime check via zod
  let body = request.body as any;
  if (body?.qaida_name || body?.takhti_number) {
    body = submitNazraReportSchema.parse(body);
  } else {
    body = submitHifzReportSchema.parse(body);
  }

  try {
    const result = await service.submitQariReport(user.id, body);
    return reply.status(200).send({ success: true, message: 'Roznamcha submitted successfully', data: result });
  } catch (err: any) {
    return handleServiceError(reply, err);
  }
}

export async function submitParentRoznamchaHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number };
  const body = submitParentReportSchema.parse(request.body);

  try {
    const result = await service.submitParentReport(user.id, body);
    return reply.status(200).send({ success: true, message: 'Parent report submitted successfully', data: result });
  } catch (err: any) {
    return handleServiceError(reply, err);
  }
}

export async function getStudentRoznamchaHandler(request: FastifyRequest, reply: FastifyReply) {
  const params = roznamchaStudentParamSchema.parse(request.params);
  const user = request.user as { id: number; role: string };

  try {
    const report = await service.getStudentDailyReport(Number(params.studentId), user.id, user.role);
    return reply.status(200).send({ success: true, data: report });
  } catch (err: any) {
    return handleServiceError(reply, err);
  }
}