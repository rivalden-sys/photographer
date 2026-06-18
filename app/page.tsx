"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SessionId =
  | "session-01"
  | "session-02"
  | "session-03"
  | "session-04"
  | "session-05"
  | "session-06"
  | "session-07"
  | "session-08";

type FilterId = "all" | SessionId;
type PhotoRatio = "portrait" | "landscape" | "square" | "tall" | "wide";

type PhotoSession = {
  id: SessionId;
  number: string;
  title: string;
  note: string;
  location: string;
  year: string;
  count: number;
};

type Photo = {
  id: string;
  sessionId: SessionId;
  sessionNumber: string;
  sessionTitle: string;
  src: string;
  frame: number;
  ratio: PhotoRatio;
  location: string;
  year: string;
};

const studio = {
  name: "Leila Photography",
  city: "Valencia / Spain",
  instagram: "@photographer_leila_",
  instagramUrl: "https://www.instagram.com/photographer_leila_/",
};

const sessions: PhotoSession[] = [
  { id: "session-01", number: "01", title: "Couples by the Sea", note: "soft coastline, warm skin, quiet closeness", location: "Valencia", year: "2026", count: 10 },
  { id: "session-02", number: "02", title: "Golden Portraits", note: "sunset portraits and feminine calm", location: "Spain", year: "2026", count: 10 },
  { id: "session-03", number: "03", title: "Garden Story", note: "green light and natural emotion", location: "Valencia", year: "2026", count: 10 },
  { id: "session-04", number: "04", title: "Black & White Memory", note: "grain, gesture and private emotion", location: "Spain", year: "2026", count: 10 },
  { id: "session-05", number: "05", title: "Family at the Coast", note: "family tenderness in evening light", location: "Valencia", year: "2026", count: 10 },
  { id: "session-06", number: "06", title: "Minimal Couple Study", note: "distance, touch and timeless style", location: "Spain", year: "2026", count: 10 },
  { id: "session-07", number: "07", title: "Portrait of Leila", note: "the photographer behind the frame", location: "Valencia", year: "2026", count: 10 },
  { id: "session-08", number: "08", title: "White Coast", note: "movement, wind and ceremony light", location: "Spain", year: "2026", count: 10 },
];

const ratioPattern: PhotoRatio[] = ["portrait", "tall", "square", "landscape", "portrait", "wide", "tall", "portrait", "landscape", "square"];
const hiddenPhotoIds = new Set(["session-08-02"]);

const photos: Photo[] = sessions
  .flatMap((session) =>
    Array.from({ length: session.count }, (_, index) => {
      const frame = index + 1;
      const file = String(frame).padStart(2, "0");

      return {
        id: `${session.id}-${file}`,
        sessionId: session.id,
        sessionNumber: session.number,
        sessionTitle: session.title,
        src: `/photos/${session.id}/${file}.jpg`,
        frame,
        ratio: ratioPattern[index % ratioPattern.length],
        location: session.location,
        year: session.year,
      };
    }),
  )
  .filter((photo) => !hiddenPhotoIds.has(photo.id));

const services = [
  ["01", "Portraits", "Soft, minimal portraits for women who want to feel natural, elegant and present in the frame.", "Valencia or nearby locations · light direction · refined edit · private gallery"],
  ["02", "Couples", "Intimate couple sessions built around real emotion, movement, touch and quiet cinematic light.", "Beach, city or home session · styling notes · natural posing · full gallery"],
  ["03", "Families", "Family stories with warmth and space: children, parents, small gestures and honest connection.", "Outdoor or home session · gentle direction · timeless color · web and print files"],
  ["04", "Private Stories", "Small celebrations, personal milestones and lifestyle shoots photographed with discretion and taste.", "Limited bookings · documentary rhythm · curated delivery · Instagram-ready selection"],
];

const process = [
  ["Message", "You send a short note on Instagram: who you want to photograph, the city, the date and the feeling you want."],
  ["Planning", "Leila helps choose the place, timing and simple clothing direction so the session already has a visual mood."],
  ["Shooting", "The session is calm and gently directed. No forced posing, no pressure, just real emotion with better composition."],
  ["Editing", "The gallery is edited with soft color, natural skin and a timeless visual style that does not feel artificial."],
  ["Delivery", "You receive a private gallery with selected images ready for personal use, Instagram and print."],
];

const testimonials = [
  ["The photos feel very real, but also elegant. We did not feel like we had to perform for the camera.", "Client review", "couple session"],
  ["Leila sees small emotions and turns them into something soft and timeless. The gallery felt very personal.", "Client review", "family story"],
  ["I usually feel uncomfortable in portraits, but this session was calm and easy. The result looks like me, only better lit.", "Client review", "portrait session"],
];

function getRatioClass(ratio: PhotoRatio) {
  const classes: Record<PhotoRatio, string> = {
    portrait: "aspect-[4/5]",
    landscape: "aspect-[5/4]",
    square: "aspect-square",
    tall: "aspect-[3/4]",
    wide: "aspect-[16/10]",
  };

  return classes[ratio];
}

export default function Page() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  const visiblePhotos = useMemo(() => {
    if (activeFilter === "all") return photos;
    return photos.filter((photo) => photo.sessionId === activeFilter);
  }, [activeFilter]);

  const activeSession = activeFilter === "all" ? null : sessions.find((session) => session.id === activeFilter) ?? null;

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [activeFilter]);

  useEffect(() => {
    if (!activePhoto) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActivePhoto(null);
      if (event.key === "ArrowRight") movePhoto(1);
      if (event.key === "ArrowLeft") movePhoto(-1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto, visiblePhotos]);

  function movePhoto(direction: -1 | 1) {
    if (!activePhoto) return;
    const currentIndex = visiblePhotos.findIndex((photo) => photo.id === activePhoto.id);
    const nextIndex = (currentIndex + direction + visiblePhotos.length) % visiblePhotos.length;
    setActivePhoto(visiblePhotos[nextIndex]);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe6] text-[#17130f] selection:bg-[#17130f] selection:text-[#f4efe6]">
      <style>{`
        .font-editorial { font-family: Didot, "Bodoni 72", "Iowan Old Style", Georgia, serif; letter-spacing: -0.055em; }
        .font-interface { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        [data-reveal] { opacity: 0; transform: translateY(26px); transition: opacity 850ms ease, transform 850ms cubic-bezier(0.19, 1, 0.22, 1); }
        [data-reveal].is-visible { opacity: 1; transform: translateY(0); }
        .hide-scrollbar { scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) { [data-reveal] { opacity: 1; transform: none; transition: none; } }
      `}</style>

      <div className="font-interface">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[#17130f]/10 bg-[#f4efe6]/88 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <nav className="mx-auto flex max-w-[1560px] items-center justify-between gap-4 text-[10px] uppercase tracking-[0.26em]">
            <a href="#top" className="font-medium tracking-[0.32em]">{studio.name}</a>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#gallery" className="transition hover:text-[#8c6f45]">Gallery</a>
              <a href="#about" className="transition hover:text-[#8c6f45]">About</a>
              <a href="#services" className="transition hover:text-[#8c6f45]">Services</a>
            </div>
            <a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="border border-[#17130f] px-4 py-2 transition hover:bg-[#17130f] hover:text-[#f4efe6]">DM to book</a>
          </nav>
        </header>

        <section id="top" className="px-4 pb-16 pt-28 sm:px-6 lg:px-10 lg:pb-24 lg:pt-32">
          <div className="mx-auto grid max-w-[1560px] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div className="flex flex-col justify-between gap-14 lg:min-h-[calc(100vh-9rem)]">
              <div data-reveal>
                <p className="mb-6 max-w-[34rem] text-[10px] uppercase leading-5 tracking-[0.34em] text-[#6f6255]">Photographer in Spain · Valencia · portraits · couples · families</p>
                <h1 className="font-editorial max-w-[52rem] text-[clamp(4.3rem,14vw,13rem)] leading-[0.78]">Real emotions, timeless style.</h1>
              </div>
              <div data-reveal>
                <p className="max-w-[34rem] text-[15px] leading-7 text-[#4f463d] sm:text-[17px] sm:leading-8">Soft cinematic photography in Valencia for people who want honest emotion, natural direction and images that feel elegant without being staged.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center bg-[#17130f] px-7 text-[10px] uppercase tracking-[0.28em] text-[#f4efe6] transition hover:bg-[#3a2b1e]">Book via Instagram</a>
                  <a href="#gallery" className="inline-flex min-h-12 items-center justify-center border border-[#17130f]/25 px-7 text-[10px] uppercase tracking-[0.28em] transition hover:border-[#17130f]">View gallery</a>
                </div>
              </div>
            </div>

            <div data-reveal className="grid gap-4 sm:grid-cols-[1.1fr_0.7fr] lg:min-h-[calc(100vh-9rem)]">
              <div className="relative min-h-[520px] overflow-hidden bg-[#d9c9b4] sm:min-h-[620px] lg:min-h-0">
                <Image src="/photos/session-01/01.jpg" alt="Leila Photography couple session in Valencia" fill priority sizes="(max-width: 768px) 100vw, 58vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/34 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex justify-between gap-6 text-[#f4efe6]">
                  <p className="max-w-[14rem] text-[10px] uppercase leading-5 tracking-[0.28em]">Portraits · Couples · Families</p>
                  <p className="hidden text-[10px] uppercase tracking-[0.28em] sm:block">Valencia</p>
                </div>
              </div>
              <div className="hidden grid-rows-[0.74fr_1fr] gap-4 sm:grid">
                <div className="relative overflow-hidden bg-[#d9c9b4]"><Image src="/photos/session-07/01.jpg" alt="Leila portrait" fill sizes="24vw" className="object-cover" /></div>
                <div className="relative overflow-hidden bg-[#d9c9b4]"><Image src="/photos/session-08/01.jpg" alt="Couple session on the coast" fill sizes="24vw" className="object-cover" /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#17130f]/10 px-4 py-5 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-[1560px] gap-4 text-[10px] uppercase leading-5 tracking-[0.28em] text-[#6f6255] sm:grid-cols-3">
            <p>Valencia · Spain</p><p className="sm:text-center">Real emotions · timeless style</p><p className="sm:text-right">Booking open · DM to book</p>
          </div>
        </section>

        <section id="gallery" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1560px]">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div data-reveal>
                <p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-[#8c6f45]">Gallery</p>
                <h2 className="font-editorial max-w-[58rem] text-[clamp(3.7rem,9vw,9rem)] leading-[0.82]">Soft stories from Spain.</h2>
              </div>
              <p data-reveal className="max-w-[39rem] text-[15px] leading-7 text-[#4f463d] sm:text-[17px] sm:leading-8">Browse the archive by session. Each story has its own rhythm, but the visual language stays calm, emotional and timeless.</p>
            </div>

            <div className="sticky top-[65px] z-40 -mx-4 mt-10 border-y border-[#17130f]/10 bg-[#f4efe6]/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
              <div className="mx-auto flex max-w-[1560px] items-center gap-3 overflow-x-auto hide-scrollbar">
                <button type="button" onClick={() => setActiveFilter("all")} aria-pressed={activeFilter === "all"} className={`shrink-0 border px-5 py-3 text-[10px] uppercase tracking-[0.24em] transition ${activeFilter === "all" ? "border-[#17130f] bg-[#17130f] text-[#f4efe6]" : "border-[#17130f]/16 text-[#4f463d] hover:border-[#17130f]/60"}`}>All / {photos.length}</button>
                {sessions.map((session) => (
                  <button key={session.id} type="button" onClick={() => setActiveFilter(session.id)} aria-pressed={activeFilter === session.id} className={`shrink-0 border px-5 py-3 text-[10px] uppercase tracking-[0.24em] transition ${activeFilter === session.id ? "border-[#17130f] bg-[#17130f] text-[#f4efe6]" : "border-[#17130f]/16 text-[#4f463d] hover:border-[#17130f]/60"}`}>Story {session.number}</button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 border-b border-[#17130f]/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#8c6f45]">{activeSession ? activeSession.note : "full archive"}</p>
                <h3 className="font-editorial mt-2 text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9]">{activeSession ? activeSession.title : "All stories"}</h3>
              </div>
              <p className="text-[10px] uppercase leading-5 tracking-[0.24em] text-[#6f6255]">{visiblePhotos.length} frames · tap to open</p>
            </div>

            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 2xl:columns-4">
              {visiblePhotos.map((photo, index) => (
                <article key={photo.id} data-reveal className={`mb-4 break-inside-avoid ${index % 8 === 2 ? "lg:pt-12" : ""} ${index % 11 === 5 ? "2xl:pt-20" : ""}`}>
                  <button type="button" onClick={() => setActivePhoto(photo)} className="group block w-full text-left">
                    <div className={`relative overflow-hidden bg-[#d9c9b4] ${getRatioClass(photo.ratio)}`}>
                      <Image src={photo.src} alt={`${photo.sessionTitle} frame ${photo.frame}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-[1100ms] ease-out group-hover:scale-[1.035]" />
                      <div className="absolute inset-0 bg-[#17130f]/0 transition group-hover:bg-[#17130f]/14" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 opacity-0 transition duration-500 group-hover:opacity-100">
                        <span className="bg-[#f4efe6] px-4 py-3 text-[10px] uppercase tracking-[0.22em]">Open</span>
                        <span className="hidden text-[10px] uppercase tracking-[0.22em] text-[#f4efe6] sm:inline">{photo.sessionNumber}.{String(photo.frame).padStart(2, "0")}</span>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-5 border-b border-[#17130f]/10 py-4">
                      <div><h4 className="font-editorial text-3xl leading-none tracking-[-0.04em]">{photo.sessionTitle}</h4><p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#6f6255]">Frame {String(photo.frame).padStart(2, "0")}</p></div>
                      <p className="pt-1 text-right text-[10px] uppercase leading-5 tracking-[0.22em] text-[#8c6f45]">{photo.location}<br />{photo.year}</p>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#17130f] px-4 py-20 text-[#f4efe6] sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto grid max-w-[1560px] gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
            <div data-reveal>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#3a342d]"><Image src="/photos/session-07/01.jpg" alt="Leila photographer portrait" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover opacity-95" /></div>
              <p className="mt-5 max-w-[26rem] text-[10px] uppercase leading-5 tracking-[0.28em] text-[#d9c9b4]">Photographer in Valencia · portraits · couples · families</p>
            </div>
            <div data-reveal className="flex flex-col justify-center">
              <p className="mb-6 text-[10px] uppercase tracking-[0.34em] text-[#c7ad82]">About Leila</p>
              <h2 className="font-editorial text-[clamp(3.6rem,8vw,8.5rem)] leading-[0.84]">Real emotion without forced posing.</h2>
              <div className="mt-10 grid gap-7 text-[16px] leading-8 text-[#d9c9b4] sm:text-[18px] sm:leading-9">
                <p>Leila is a photographer based in Valencia, Spain, working with portraits, couples and families. Her work is built around soft direction, natural gestures and a timeless visual style.</p>
                <p>The sessions are calm and personal. The goal is not to make people look different, but to show their closeness, beauty and emotion with better light, better timing and better composition.</p>
              </div>
              <a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="mt-10 inline-flex min-h-12 w-fit items-center justify-center border border-[#f4efe6]/25 px-7 text-[10px] uppercase tracking-[0.28em] transition hover:border-[#f4efe6]">Open Instagram</a>
            </div>
          </div>
        </section>

        <section id="services" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1560px]">
            <div data-reveal className="mb-14 max-w-[58rem]"><p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-[#8c6f45]">Services</p><h2 className="font-editorial text-[clamp(3.6rem,8vw,8.5rem)] leading-[0.84]">Portraits, couples and families in Valencia.</h2></div>
            <div className="border-t border-[#17130f]/15">
              {services.map(([index, title, description, details]) => (
                <article key={title} data-reveal className="grid gap-6 border-b border-[#17130f]/15 py-8 md:grid-cols-[0.18fr_0.82fr_1fr] md:gap-10 md:py-12">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#8c6f45]">{index}</p>
                  <h3 className="font-editorial text-[clamp(2.6rem,5vw,5.4rem)] leading-[0.88]">{title}</h3>
                  <div><p className="text-[16px] leading-8 text-[#3a342d] sm:text-[18px] sm:leading-9">{description}</p><p className="mt-5 text-[10px] uppercase leading-5 tracking-[0.24em] text-[#6f6255]">{details}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="bg-[#e8dece] px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto grid max-w-[1560px] gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:gap-20">
            <div data-reveal className="lg:sticky lg:top-32 lg:self-start"><p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-[#8c6f45]">Process</p><h2 className="font-editorial text-[clamp(3.4rem,7vw,7.5rem)] leading-[0.84]">Easy booking. Calm session. Timeless gallery.</h2></div>
            <div className="space-y-4">
              {process.map(([title, text], index) => (
                <article key={title} data-reveal className="grid gap-5 border border-[#17130f]/10 bg-[#f4efe6]/45 p-5 sm:p-7 md:grid-cols-[0.18fr_0.82fr]">
                  <p className="font-editorial text-5xl leading-none text-[#8c6f45]">{String(index + 1).padStart(2, "0")}</p>
                  <div><h3 className="text-[11px] uppercase tracking-[0.3em]">{title}</h3><p className="mt-4 max-w-[46rem] text-[15px] leading-7 text-[#4f463d] sm:text-[17px] sm:leading-8">{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1560px]">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
              <div data-reveal><p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-[#8c6f45]">Reviews</p><h2 className="font-editorial text-[clamp(3.4rem,7vw,7.5rem)] leading-[0.84]">The best proof is recognition.</h2></div>
              <p data-reveal className="max-w-[38rem] text-[16px] leading-8 text-[#4f463d] sm:text-[18px] sm:leading-9">The photographs should still feel like you — only softer, calmer and more timeless.</p>
            </div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {testimonials.map(([quote, name, context]) => (
                <article key={context} data-reveal className="flex min-h-[330px] flex-col justify-between border border-[#17130f]/12 bg-[#efe7da] p-7">
                  <p className="font-editorial text-[2.25rem] leading-[1.03] tracking-[-0.05em] text-[#261c14]">“{quote}”</p>
                  <div className="mt-10 border-t border-[#17130f]/12 pt-5"><p className="text-[11px] uppercase tracking-[0.28em]">{name}</p><p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8c6f45]">{context}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="booking" className="px-4 pb-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1560px] bg-[#17130f] px-5 py-10 text-[#f4efe6] sm:px-8 sm:py-14 lg:px-14 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div data-reveal className="flex flex-col justify-center">
                <p className="mb-6 text-[10px] uppercase tracking-[0.34em] text-[#c7ad82]">Booking open</p>
                <h2 className="font-editorial text-[clamp(3.8rem,9vw,9rem)] leading-[0.82]">Write to Leila and choose your date.</h2>
                <p className="mt-8 max-w-[34rem] text-[16px] leading-8 text-[#d9c9b4] sm:text-[18px] sm:leading-9">Send a direct message on Instagram with the session type, city, preferred date and the atmosphere you want. Leila will reply with availability and next steps.</p>
              </div>
              <div data-reveal className="relative min-h-[460px] overflow-hidden bg-[#2a2018]">
                <Image src="/photos/session-05/01.jpg" alt="Leila family session booking preview" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/90 via-[#17130f]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                  <p className="mb-5 text-[10px] uppercase leading-5 tracking-[0.28em] text-[#c7ad82]">DM to book · portraits · couples · families</p>
                  <a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-14 w-full items-center justify-center bg-[#f4efe6] px-7 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#17130f] transition hover:bg-white sm:w-auto">Book via Instagram</a>
                  <div className="mt-6 grid gap-3 text-[10px] uppercase tracking-[0.26em] text-[#f4efe6]"><a href={studio.instagramUrl} target="_blank" rel="noreferrer">{studio.instagram}</a><p>{studio.city}</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[1560px] flex-col gap-5 border-t border-[#17130f]/12 pt-6 text-[10px] uppercase tracking-[0.24em] text-[#6f6255] md:flex-row md:items-center md:justify-between"><p>© 2026 {studio.name}</p><a href={studio.instagramUrl} target="_blank" rel="noreferrer">{studio.instagram}</a><p>{studio.city}</p></div>
        </footer>

        {activePhoto ? (
          <div role="dialog" aria-modal="true" aria-label="Photo preview" onClick={() => setActivePhoto(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#17130f]/95 p-4 text-[#f4efe6] sm:p-8">
            <button type="button" onClick={() => setActivePhoto(null)} className="absolute right-4 top-4 z-10 border border-[#f4efe6]/20 px-4 py-3 text-[10px] uppercase tracking-[0.26em] transition hover:border-[#f4efe6] sm:right-8 sm:top-8">Close</button>
            <button type="button" onClick={(event) => { event.stopPropagation(); movePhoto(-1); }} className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 border border-[#f4efe6]/20 px-4 py-5 text-[10px] uppercase tracking-[0.26em] transition hover:border-[#f4efe6] md:block">Prev</button>
            <button type="button" onClick={(event) => { event.stopPropagation(); movePhoto(1); }} className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 border border-[#f4efe6]/20 px-4 py-5 text-[10px] uppercase tracking-[0.26em] transition hover:border-[#f4efe6] md:block">Next</button>
            <figure onClick={(event) => event.stopPropagation()} className="grid max-h-[92vh] w-full max-w-[1180px] gap-5">
              <div className="relative h-[70vh] max-h-[760px] w-full overflow-hidden"><Image src={activePhoto.src} alt={`${activePhoto.sessionTitle} full preview`} fill sizes="100vw" className="object-contain" priority /></div>
              <figcaption className="flex flex-col gap-2 border-t border-[#f4efe6]/15 pt-4 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="font-editorial text-4xl leading-none">{activePhoto.sessionTitle}</h3><p className="mt-2 text-[10px] uppercase tracking-[0.26em] text-[#d9c9b4]">Story {activePhoto.sessionNumber} · Frame {String(activePhoto.frame).padStart(2, "0")}</p></div><p className="text-[10px] uppercase tracking-[0.26em] text-[#c7ad82]">{activePhoto.location} · {activePhoto.year}</p></figcaption>
              <div className="grid grid-cols-2 gap-3 md:hidden"><button type="button" onClick={() => movePhoto(-1)} className="border border-[#f4efe6]/20 px-4 py-4 text-[10px] uppercase tracking-[0.26em]">Prev</button><button type="button" onClick={() => movePhoto(1)} className="border border-[#f4efe6]/20 px-4 py-4 text-[10px] uppercase tracking-[0.26em]">Next</button></div>
            </figure>
          </div>
        ) : null}
      </div>
    </main>
  );
}
