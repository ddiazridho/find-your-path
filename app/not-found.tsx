'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from './i18n/provider';

export default function NotFound() {
  const { t: tx } = useTranslation();
  return <main className="container language-not-found">
    <h1>{tx('Halaman tidak ditemukan')}</h1>
    <p>{tx('Tautan ini mungkin sudah berubah. Kembali ke beranda untuk melanjutkan eksplorasimu.')}</p>
    <Link href="/" className="button button-primary"><ArrowLeft size={18} aria-hidden="true" />{tx('Kembali ke beranda')}</Link>
  </main>;
}
