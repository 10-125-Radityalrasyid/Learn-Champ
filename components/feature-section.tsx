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
    <>
      {/* Background gradient (same as Hero) */}
      <div
        className="
        relative isolate 
        py-16 sm:py-24 px-4 sm:px-6 
        overflow-hidden
          bg-[linear-gradient(to_bottom,_#D1FAE5_0%,_#B6EFF6_25%,_#CCF3FA_70%,_#EAF5FB_100%)]
        "
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            {/* LEFT — headline */}
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="text-sm bg-white/70 text-gray-900 px-4 py-1.5 shadow-sm"
              >
                Kenapa LearnChamp?
              </Badge>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-gray-900 max-w-2xl">
                Level Up Your Knowledge <br />
                <span className="text-gray-700">Fast &amp; Fun</span>
              </h2>

              <p className="text-gray-700 max-w-xl">
                Belajar jadi lebih menarik dengan kuis interaktif yang dirancang untuk menguji pemahaman—bukan sekadar menghafal.
              </p>
            </div>

            {/* RIGHT — accordion */}
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
                      border border-white/50
                      backdrop-blur-sm
                      shadow-sm
                      transition
                      data-[state=open]:border-lime-400/50
                      focus-within:border-lime-400/60
                    "
                  >
                    <AccordionTrigger
                      className="
                        px-4 py-3 text-left text-[15px] sm:text-base font-semibold text-gray-900
                        hover:no-underline hover:bg-white/90
                        rounded-xl
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/50 focus-visible:ring-offset-0
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
      </div>
    </>
  )
}
