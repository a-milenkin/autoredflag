import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/provider';

// Полный отчёт. В прототипе оплата - заглушка: любой planId открывает отчёт.
// Здесь потом будет проверка платежа (ЮKassa/Stripe webhook) или списание отчёта из пакета.
export async function POST(req: Request) {
  const { id, planId } = (await req.json().catch(() => ({}))) as { id?: string; planId?: string };
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });
  const report = await getProvider().getReport(id);
  if (!report) return NextResponse.json({ error: 'unrecognized_identifier' }, { status: 400 });
  return NextResponse.json({ report, payment: { status: 'stub_paid', planId: planId ?? 'one' } });
}
