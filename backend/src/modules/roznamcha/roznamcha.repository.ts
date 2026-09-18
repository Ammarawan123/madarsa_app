import prisma from '../../config/db';

export class RoznamchaRepository {
  private getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  async findQariByUserId(userId: number) {
    return (prisma as any).qaris.findUnique({
      where: { user_id: userId },
      select: { id: true, track_type: true },
    });
  }

  async findParentByUserId(userId: number) {
    return (prisma as any).parents.findUnique({
      where: { user_id: userId },
      select: { id: true },
    });
  }

  async checkParentAccess(userId: number, studentId: number): Promise<boolean> {
    const parent = await (prisma as any).parents.findUnique({ where: { user_id: userId } });
    if (!parent) return false;

    const student = await (prisma as any).students.findFirst({
      where: { id: studentId, parent_id: parent.id },
    });

    return !!student;
  }

  async upsertHifzReport(data: any) {
    const report_date = this.getTodayDate();
    return (prisma as any).daily_hifz_reports.upsert({
      where: { student_id_report_date: { student_id: data.student_id, report_date } },
      update: { ...data, report_date },
      create: { ...data, report_date },
    });
  }

  async upsertNazraReport(data: any) {
    const report_date = this.getTodayDate();
    return (prisma as any).daily_nazra_reports.upsert({
      where: { student_id_report_date: { student_id: data.student_id, report_date } },
      update: { ...data, report_date },
      create: { ...data, report_date },
    });
  }

  async upsertParentReport(data: any) {
    const report_date = this.getTodayDate();
    return (prisma as any).daily_parent_reports.upsert({
      where: { student_id_report_date: { student_id: data.student_id, report_date } },
      update: { ...data, report_date },
      create: { ...data, report_date },
    });
  }

  async getCombinedReport(studentId: number) {
    const report_date = this.getTodayDate();
    const where = { student_id_report_date: { student_id: studentId, report_date } };

    const [hifzReport, nazraReport, parentReport] = await Promise.all([
      (prisma as any).daily_hifz_reports.findUnique({ where }),
      (prisma as any).daily_nazra_reports.findUnique({ where }),
      (prisma as any).daily_parent_reports.findUnique({ where }),
    ]);

    return {
      date: report_date,
      qariReport: hifzReport || nazraReport || null,
      parentReport: parentReport || null,
    };
  }
}