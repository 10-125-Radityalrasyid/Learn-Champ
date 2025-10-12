// components/feature-section.tsx
'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

const items = [
  {
    id: 'i1',
    title: 'Cara Terbaik untuk Mengukur Kemampuanmu',
    desc: 'Kuis singkat yang menilai konsep inti—bukan sekadar hafalan—agar kamu tahu posisi dan progresmu.',
  },
  {
    id: 'i2',
    title: 'Belajar Bukan Lagi Tugas, Tapi Tantangan Seru',
    desc: 'Umpan balik instan membuat proses belajar terasa seperti gim: cepat, ringan, memuaskan.',
  },
  {
    id: 'i3',
    title: 'Tinggalkan Cara Lama, Kuasai Ilmu dengan Cepat',
    desc: 'Materi ringkas dan relevan; fokus pada pemahaman yang bisa langsung diterapkan.',
  },
  {
    id: 'i4',
    title: 'Uji Pengetahuanmu Tanpa Terikat Waktu dan Tempat',
    desc: 'Main kapan saja. Skor tersimpan anonim, tanpa akun, tanpa ribet.',
  },
  {
    id: 'i5',
    title: 'Kuis Berbatas Waktu Melatih Respons Cepat & Akurat',
    desc: 'Timer singkat melatih fokus, kecepatan, dan ketepatan pengambilan keputusan.',
  },
]

export default function FeaturesSection() {
  return (
    <section
      className="
        relative isolate
        bg-emerald-100
        py-16 sm:py-24
        px-4 sm:px-6
        text-gray-900
        overflow-hidden
      "
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* grid */}
        <div className="mt-4 grid grid-cols-1 gap-10 lg:mt-8 lg:grid-cols-2 lg:gap-16 items-start">
          {/* LEFT — big, minimal copy */}
          <div className="space-y-10 md:space-y-14">
            <h3 className="font-[var(--font-pt-mono)] text-[clamp(28px,5vw,44px)] leading-tight tracking-[-0.01em]">
              <span className="block">Level Up Your Knowledge</span>
              <span className="block text-gray-700">Fast &amp; Fun</span>
            </h3>

            <h3 className="font-[var(--font-pt-mono)] text-[clamp(28px,5vw,44px)] leading-tight tracking-[-0.01em]">
              <span className="block">Stop Memorizing</span>
              <span className="block text-gray-700">Start Mastering</span>
            </h3>
          </div>

          {/* RIGHT — minimalist accordion */}
          <div className="w-full">
            <Accordion
              type="single"
              collapsible
              defaultValue="i1"
              className="space-y-3"
            >
              {items.map((it) => (
                <AccordionItem
                  key={it.id}
                  value={it.id}
                  className="
                    rounded-xl bg-white/80
                    ring-1 ring-black/5
                    backdrop-blur-sm
                    transition
                    data-[state=open]:ring-emerald-300/50
                    focus-within:ring-emerald-300/60
                  "
                >
                  <AccordionTrigger
                    className="
                      px-4 py-3 text-left text-[15px] sm:text-base font-semibold
                      hover:no-underline hover:bg-white
                      rounded-xl
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-0
                      data-[state=open]:[&>svg]:rotate-180
                    "
                  >
                    {it.title}
                  </AccordionTrigger>

                  <AccordionContent
                    className="px-4 pt-0 pb-4 text-sm sm:text-[15px] leading-relaxed text-gray-700"
                  >
                    {it.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
