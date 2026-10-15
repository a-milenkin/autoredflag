import { NextResponse } from 'next/server';
import { getProvider, toPreview } from '@/lib/provider';

// Бесплатная проверка: только превью без деталей.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q') ?? '';
  const report = await getProvider().getReport(q);
  if (!report) return NextResponse.json({ error: 'unrecognized_identifier' }, { status: 400 });
  return NextResponse.json(toPreview(report));
}
