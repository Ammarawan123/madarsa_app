import { RoznamchaRepository } from './roznamcha.repository';
import { getFormattedAttendanceDateUrdu } from '../../utils/date-formatter';

export interface IQariReportStrategy {
  processAndSave(
    repo: RoznamchaRepository,
    qariId: number,
    body: any
  ): Promise<any>;
}

export class HifzReportStrategy implements IQariReportStrategy {
  async processAndSave(repo: RoznamchaRepository, qariId: number, body: any) {
    return repo.upsertHifzReport({
      student_id: Number(body.student_id),
      qari_id: qariId,
      reciter_type: body.reciter_type || 'qari',
      reciter_student_name: body.reciter_student_name,
      completed_para: body.completed_para,
      sabaq_surah_from: body.sabaq_surah_from,
      sabaq_surah_to: body.sabaq_surah_to,
      sabqi_mistakes: Number(body.sabqi_mistakes || 0),
      manzil_details: body.manzil_details,
      manzil_recited: body.manzil_recited,
      status: body.status || 'submitted',
    });
  }
}

export class NazraReportStrategy implements IQariReportStrategy {
  async processAndSave(repo: RoznamchaRepository, qariId: number, body: any) {
    return repo.upsertNazraReport({
      student_id: Number(body.student_id),
      qari_id: qariId,
      reciter_type: body.reciter_type || 'qari',
      reciter_student_name: body.reciter_student_name,
      qaida_name: body.qaida_name,
      takhti_number: body.takhti_number,
      mistakes: Number(body.mistakes || 0),
      teacher_remarks: body.teacher_remarks,
      status: body.status || 'submitted',
    });
  }
}

export class RoznamchaService {
  private repo = new RoznamchaRepository();

  private strategies: Record<string, IQariReportStrategy> = {
    HIFZ: new HifzReportStrategy(),
    NAZRA: new NazraReportStrategy(),
  };

  async submitQariReport(loggedInUserId: number, body: any) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) throw new Error('QARI_NOT_FOUND');

    const strategy = this.strategies[qari.track_type];
    if (!strategy) throw new Error('INVALID_TRACK_TYPE');

    return strategy.processAndSave(this.repo, qari.id, body);
  }

  async submitParentReport(loggedInUserId: number, body: any) {
    const parent = await this.repo.findParentByUserId(loggedInUserId);
    if (!parent) throw new Error('PARENT_NOT_FOUND');

    return this.repo.upsertParentReport({
      student_id: Number(body.student_id),
      parent_id: parent.id,
      home_arrival_time: body.home_arrival_time
        ? new Date(body.home_arrival_time)
        : undefined,
      fajr_offered: Boolean(body.fajr_offered),
      zuhr_offered: Boolean(body.zuhr_offered),
      asr_offered: Boolean(body.asr_offered),
      maghrib_offered: Boolean(body.maghrib_offered),
      isha_offered: Boolean(body.isha_offered),
      screen_time_hours: Number(body.screen_time_hours || 0),
      screen_time_minutes: Number(body.screen_time_minutes || 0),
      parent_remarks: body.parent_remarks,
      status: body.status || 'submitted',
    });
  }

  async getStudentDailyReport(
    studentId: number,
    loggedInUserId: number,
    role: string
  ) {
    const isParentRole = role === 'PARENT';
    const isMyChild = isParentRole
      ? await this.repo.checkParentAccess(loggedInUserId, studentId)
      : true;

    if (!isMyChild) throw new Error('FORBIDDEN_NOT_YOUR_CHILD');

    const report = await this.repo.getCombinedReport(studentId);
    const dateInfo = getFormattedAttendanceDateUrdu(new Date());

    return {
      dateInfo, // Urdu Gregorian aur Hijri dates for frontend card header
      report,
    };
  }
}