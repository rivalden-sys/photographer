"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SessionId = "session-01" | "session-02" | "session-03" | "session-04" | "session-05" | "session-06" | "session-07" | "session-08";
type FilterId = "all" | SessionId;
type Ratio = "portrait" | "landscape" | "square" | "tall" | "wide";

type Session = { id: SessionId; number: string; title: string; note: string; location: string; year: string; count: number };
type Photo = { id: string; sessionId: SessionId; sessionNumber: string; sessionTitle: string; src: string; frame: number; ratio: Ratio; location: string; year: string };

type Service = { index: string; title: string; description: string; details: string };
type Price = { index: string; title: string; price: string; unit: string };
type Step = { title: string; text: string };
type Testimonial = { quote: string; name: string; context: string };

type SelectedConfig = { id: string; size: string; ratio: string };

const studio = {
  name: "Leila Photography",
  city: "Valencia / Spain",
  instagram: "@photographer_leila_",
  instagramUrl: "https://www.instagram.com/photographer_leila_/",
};

const sessions: Session[] = [
  { id: "session-01", number: "01", title: "Couples by the Sea", note: "soft coastline, warm skin, quiet closeness", location: "Valencia", year: "2026", count: 10 },
  { id: "session-02", number: "02", title: "Golden Portraits", note: "sunset portraits and feminine calm", location: "Spain", year: "2026", count: 10 },
  { id: "session-03", number: "03", title: "Garden Story", note: "green light and natural emotion", location: "Valencia", year: "2026", count: 10 },
  { id: "session-04", number: "04", title: "Black & White Memory", note: "grain, gesture and private emotion", location: "Spain", year: "2026", count: 10 },
  { id: "session-05", number: "05", title: "Family at the Coast", note: "family tenderness in evening light", location: "Valencia", year: "2026", count: 10 },
  { id: "session-06", number: "06", title: "Minimal Couple Study", note: "distance, touch and timeless style", location: "Spain", year: "2026", count: 10 },
  { id: "session-07", number: "07", title: "Portrait of Leila", note: "the photographer behind the frame", location: "Valencia", year: "2026", count: 10 },
  { id: "session-08", number: "08", title: "White Coast", note: "movement, wind and ceremony light", location: "Spain", year: "2026", count: 10 },
];

const hiddenPhotoIds = new Set(["session-08-02"]);
const ratioPattern: Ratio[] = ["portrait", "tall", "square", "landscape", "portrait", "wide", "tall", "portrait", "landscape", "square"];

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

const selectedDesktop: SelectedConfig[] = [
  { id: "session-01-04", size: "lg:col-span-2 lg:row-span-2", ratio: "aspect-[5/4] lg:aspect-auto" },
  { id: "session-02-02", size: "", ratio: "aspect-[4/5]" },
  { id: "session-03-04", size: "", ratio: "aspect-[4/5]" },
  { id: "session-05-01", size: "lg:col-span-2", ratio: "aspect-[16/10]" },
  { id: "session-06-03", size: "", ratio: "aspect-[4/5]" },
  { id: "session-08-01", size: "", ratio: "aspect-[4/5]" },
  { id: "session-03-06", size: "", ratio: "aspect-[4/5]" },
  { id: "session-05-05", size: "", ratio: "aspect-[4/5]" },
];

const selectedMobile = [
  { id: "session-01-01", src: "/photos/session-01/04.jpg" },
  { id: "session-02-02" },
  { id: "session-03-04" },
  { id: "session-05-05" },
  { id: "session-06-03" },
  { id: "session-08-01" },
];

const services: Service[] = [
  { index: "01", title: "Portraits", description: "Soft, minimal portraits for women who want to feel natural, elegant and present in the frame.", details: "Valencia or nearby locations · light direction · refined edit · private gallery" },
  { index: "02", title: "Couples", description: "Intimate love stories built around real emotion, movement, touch and quiet cinematic light.", details: "Beach, city or home session · styling notes · natural posing · full gallery" },
  { index: "03", title: "Families", description: "Family stories with warmth and space: children, parents, small gestures and honest connection.", details: "Outdoor or home session · gentle direction · timeless color · web and print files" },
  { index: "04", title: "Private Stories", description: "Small celebrations, personal milestones and lifestyle shoots photographed with discretion and taste.", details: "Limited bookings · documentary rhythm · curated delivery · Instagram-ready selection" },
];

const investment: Price[] = [
  { index: "01", title: "Individual portraits", price: "from €150", unit: "per hour" },
  { index: "02", title: "Couple love story", price: "€180", unit: "per hour" },
  { index: "03", title: "Family session", price: "from €200", unit: "per hour" },
];

const process: Step[] = [
  { title: "Message", text: "Send a short Instagram note: session type, city, preferred date and the feeling you want." },
  { title: "Planning", text: "Leila helps choose the place, timing and simple clothing direction before the session." },
  { title: "Shooting", text: "The session is calm and gently directed. No forced posing, no pressure." },
  { title: "Editing", text: "The gallery is edited with soft color, natural skin and timeless visual rhythm." },
  { title: "Delivery", text: "You receive a private gallery with selected images ready for personal use, Instagram and print." },
];

const testimonials: Testimonial[] = [
  { quote: "The photos feel very real, but also elegant. We did not feel like we had to perform for the camera.", name: "Client review", context: "couple session" },
  { quote: "Leila sees small emotions and turns them into something soft and timeless. The gallery felt very personal.", name: "Client review", context: "family story" },
  { quote: "I usually feel uncomfortable in portraits, but this session was calm and easy. The result looks like me, only better lit.", name: "Client review", context: "portrait session" },
];

const navItems = [
  ["Gallery", "#gallery"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Prices", "#investment"],
  ["Booking", "#booking"],
] as const;

function getPhoto(id: string, src?: string) {
  const photo = photos.find((item) => item.id === id);
  return photo ? { ...photo, src: src ?? photo.src } : null;
}

function ratioClass(ratio: Ratio) {
  return {
    portrait: "aspect-[4/5]",
    landscape: "aspect-[5/4]",
    square: "aspect-square",
    tall: "aspect-[3/4]",
    wide: "aspect-[16/10]",
  }[ratio];
}

export default function Page() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>(photos);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visiblePhotos = useMemo(() => (activeFilter === "all" ? photos : photos.filter((photo) => photo.sessionId === activeFilter)), [activeFilter]);
  const activeSession = activeFilter === "all" ? null : sessions.find((session) => session.id === activeFilter) ?? null;
  const activeStoryPhotos = activeSession ? visiblePhotos : [];

  const desktopItems = useMemo(
    () => selectedDesktop.map((config) => ({ config, photo: getPhoto(config.id) })).filter((item): item is { config: SelectedConfig; photo: Photo } => Boolean(item.photo)),
    [],
  );
  const desktopLightboxPhotos = useMemo(() => desktopItems.map(({ photo }) => photo), [desktopItems]);

  const mobilePreviewPhotos = useMemo(() => {
    if (activeFilter !== "all") return visiblePhotos.slice(0, 6);
    const selected = selectedMobile.map((item) => getPhoto(item.id, item.src)).filter((photo): photo is Photo => Boolean(photo));
    return selected.length ? selected : photos.slice(0, 6);
  }, [activeFilter, visiblePhotos]);

  const mobilePhotosToShow = mobileGalleryOpen ? visiblePhotos : mobilePreviewPhotos;

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
  }, [activeFilter, mobileGalleryOpen]);

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
  }, [activePhoto, lightboxPhotos]);

  function changeFilter(filter: FilterId) {
    setActiveFilter(filter);
    setMobileGalleryOpen(false);
  }

  function openPhoto(photo: Photo, context: Photo[]) {
    setLightboxPhotos(context.length ? context : [photo]);
    setActivePhoto(photo);
  }

  function movePhoto(direction: -1 | 1) {
    if (!activePhoto) return;
    const source = lightboxPhotos.length ? lightboxPhotos : [activePhoto];
    const index = source.findIndex((photo) => photo.id === activePhoto.id && photo.src === activePhoto.src);
    const nextIndex = ((index === -1 ? 0 : index) + direction + source.length) % source.length;
    setActivePhoto(source[nextIndex]);
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null) return;
    const difference = touchStartX - clientX;
    if (Math.abs(difference) > 48) movePhoto(difference > 0 ? 1 : -1);
    setTouchStartX(null);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe6] text-[#17130f] selection:bg-[#17130f] selection:text-[#f4efe6]">
      <style>{`
        .font-editorial { font-family: Didot, "Bodoni 72", "Iowan Old Style", Georgia, serif; letter-spacing: -0.055em; }
        .font-interface { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .btn-dark, .btn-light, .btn-outline, .btn-ghost-dark { min-height: 56px; display: inline-flex; align-items: center; justify-content: center; padding: 0 28px; font-size: 11px; line-height: 1; font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em; transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, opacity 200ms ease; }
        .btn-dark { background: #17130f !important; color: #f4efe6 !important; border: 1px solid #17130f; }
        .btn-light { background: #f4efe6 !important; color: #17130f !important; border: 1px solid #f4efe6; }
        .btn-outline { background: transparent !important; color: #17130f !important; border: 1px solid rgba(23,19,15,0.28); }
        .btn-ghost-dark { background: transparent !important; color: #f4efe6 !important; border: 1px solid rgba(244,239,230,0.28); }
        [data-reveal] { opacity: 0; transform: translateY(26px); transition: opacity 850ms ease, transform 850ms cubic-bezier(0.19, 1, 0.22, 1); }
        [data-reveal].is-visible { opacity: 1; transform: translateY(0); }
        .hide-scrollbar { scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) { .btn-dark, .btn-light, .btn-outline, .btn-ghost-dark { width: 100%; min-height: 58px; letter-spacing: 0.16em; font-size: 10px; padding: 0 18px; } .font-editorial { letter-spacing: -0.045em; } }
        @media (prefers-reduced-motion: reduce) { [data-reveal] { opacity: 1; transform: none; transition: none; } }
      `}</style>

      <div className="font-interface">
        <header className="sticky top-0 z-50 border-b border-[#17130f]/10 bg-[#f4efe6]/94 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:px-10">
          <nav className="mx-auto flex max-w-[1560px] items-center justify-between gap-3 text-[9px] uppercase tracking-[0.2em] sm:text-[10px] sm:tracking-[0.26em]">
            <a href="#top" onClick={() => setMobileMenuOpen(false)} className="min-w-0 truncate font-bold tracking-[0.16em] sm:tracking-[0.32em]">{studio.name}</a>
            <div className="hidden items-center gap-8 md:flex">{navItems.slice(0, 4).map(([label, href]) => <a key={href} href={href} className="transition hover:text-[#8c6f45]">{label}</a>)}</div>
            <div className="flex shrink-0 items-center gap-2">
              <a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="border border-[#17130f] px-3 py-2 text-[9px] tracking-[0.14em] transition hover:bg-[#17130f] hover:text-[#f4efe6] sm:px-4 sm:text-[10px] sm:tracking-[0.26em]">DM to book</a>
              <button type="button" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((value) => !value)} className="flex h-[39px] w-[43px] items-center justify-center border border-[#17130f] md:hidden">
                <span className="grid w-5 gap-1.5"><span className={`h-px bg-[#17130f] transition ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} /><span className={`h-px bg-[#17130f] transition ${mobileMenuOpen ? "opacity-0" : ""}`} /><span className={`h-px bg-[#17130f] transition ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} /></span>
              </button>
            </div>
          </nav>
          <div className={`${mobileMenuOpen ? "grid" : "hidden"} mx-auto mt-3 max-w-[1560px] gap-2 border-t border-[#17130f]/10 pt-3 text-[11px] uppercase tracking-[0.22em] md:hidden`}>
            {navItems.map(([label, href]) => <a key={href} onClick={() => setMobileMenuOpen(false)} href={href} className={`${label === "Booking" ? "bg-[#17130f] text-[#f4efe6]" : "border border-[#17130f]/12"} px-4 py-4`}>{label}</a>)}
          </div>
        </header>

        <section id="top" className="px-4 pb-12 pt-4 sm:px-6 lg:px-10 lg:pb-24 lg:pt-6">
          <div className="mx-auto grid max-w-[1560px] overflow-hidden border border-[#17130f]/10 bg-[#efe7da] lg:min-h-[calc(100vh-7.5rem)] lg:grid-cols-[1.08fr_0.92fr]">
            <div data-reveal className="relative min-h-[58svh] bg-[#d9c9b4] sm:min-h-[660px] lg:min-h-full">
              <Image src="/photos/session-01/04.jpg" alt="Leila Photography love story in Valencia" fill priority sizes="(max-width: 1024px) 100vw, 56vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/32 via-transparent to-transparent lg:hidden" />
              <p className="absolute bottom-5 left-5 right-5 text-[10px] uppercase leading-5 tracking-[0.24em] text-[#f4efe6] lg:hidden">Valencia · portraits · couples · families</p>
            </div>
            <div data-reveal className="flex flex-col justify-between gap-12 p-5 sm:p-8 lg:p-12 xl:p-16">
              <div><p className="mb-6 max-w-[34rem] text-[10px] uppercase leading-5 tracking-[0.3em] text-[#8c6f45]">Photographer in Valencia · portraits · couples · families</p><h1 className="font-editorial max-w-[44rem] text-[clamp(4rem,11vw,10rem)] leading-[0.82] lg:text-[clamp(5.8rem,7.8vw,9.2rem)]">Real emotion. Timeless light.</h1></div>
              <div className="grid gap-8 xl:grid-cols-[1fr_0.76fr] xl:items-end"><div><p className="max-w-[34rem] text-[16px] leading-8 text-[#4f463d] sm:text-[19px] sm:leading-9">Soft cinematic photography for people who want their story to feel honest, elegant and alive.</p><div className="mt-7 grid gap-3 sm:flex sm:flex-row"><a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="btn-dark">Book via Instagram</a><a href="#gallery" className="btn-outline">View gallery</a></div></div><div className="hidden border-l border-[#17130f]/12 pl-6 text-[10px] uppercase leading-6 tracking-[0.26em] text-[#6f6255] xl:block"><p>Real emotions</p><p>Timeless style</p><p>Booking open</p></div></div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#17130f]/10 px-4 py-5 sm:px-6 lg:px-10"><div className="mx-auto grid max-w-[1560px] gap-3 text-[10px] uppercase leading-5 tracking-[0.22em] text-[#6f6255] sm:grid-cols-3 sm:tracking-[0.28em]"><p>Valencia · Spain</p><p className="sm:text-center">Real emotions · timeless style</p><p className="sm:text-right">Booking open · DM to book</p></div></section>

        <section id="gallery" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1560px]">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-8"><div data-reveal><p className="mb-4 text-[10px] uppercase tracking-[0.26em] text-[#8c6f45] sm:mb-5 sm:tracking-[0.34em]">Gallery</p><h2 className="font-editorial max-w-[58rem] text-[clamp(3.2rem,14vw,9rem)] leading-[0.88] sm:leading-[0.82]">Selected stories from Spain.</h2></div><p data-reveal className="max-w-[39rem] text-[15px] leading-7 text-[#4f463d] sm:text-[17px] sm:leading-8">Start with a curated selection. Choose a story when you want to see the full rhythm of one session.</p></div>

            <div className="sm:hidden">
              <div className="-mx-4 mt-8 border-y border-[#17130f]/10 bg-[#efe7da]/55 py-5"><div className="px-4"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.26em] text-[#8c6f45]">Stories</p><p className="mt-2 text-[13px] leading-5 text-[#5d5146]">Swipe to choose a story →</p></div><p className="text-[10px] uppercase tracking-[0.18em] text-[#6f6255]">{sessions.length} sets</p></div></div><div className="flex gap-3 overflow-x-auto px-4 hide-scrollbar"><button type="button" onClick={() => changeFilter("all")} className={`w-[132px] shrink-0 text-left ${activeFilter === "all" ? "opacity-100" : "opacity-70"}`}><div className={`relative aspect-[4/5] overflow-hidden border ${activeFilter === "all" ? "border-[#17130f]" : "border-[#17130f]/12"}`}><Image src="/photos/session-05/01.jpg" alt="All selected work" fill sizes="132px" className="object-cover" /><div className="absolute inset-0 bg-[#17130f]/25" /><div className="absolute bottom-3 left-3 right-3 text-[#f4efe6]"><p className="text-[10px] uppercase tracking-[0.2em]">All</p><p className="mt-1 text-[11px] uppercase tracking-[0.14em]">Selected</p></div></div></button>{sessions.map((session) => <button key={session.id} type="button" onClick={() => changeFilter(session.id)} className={`w-[132px] shrink-0 text-left ${activeFilter === session.id ? "opacity-100" : "opacity-70"}`}><div className={`relative aspect-[4/5] overflow-hidden border ${activeFilter === session.id ? "border-[#17130f]" : "border-[#17130f]/12"}`}><Image src={`/photos/${session.id}/01.jpg`} alt={`${session.title} cover`} fill sizes="132px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/72 via-[#17130f]/12 to-transparent" /><div className="absolute bottom-3 left-3 right-3 text-[#f4efe6]"><p className="text-[10px] uppercase tracking-[0.2em]">Story {session.number}</p><p className="mt-1 text-[13px] leading-4">{session.title}</p></div></div></button>)}</div></div>
              <div className="mt-8 flex flex-col gap-2 border-b border-[#17130f]/10 pb-5"><p className="text-[10px] uppercase tracking-[0.22em] text-[#8c6f45]">{activeSession ? activeSession.note : "selected work"}</p><h3 className="font-editorial mt-1 text-[clamp(2.5rem,12vw,5.8rem)] leading-[0.92]">{activeSession ? activeSession.title : "Selected frames"}</h3><p className="text-[10px] uppercase leading-5 tracking-[0.2em] text-[#6f6255]">{mobileGalleryOpen ? `${visiblePhotos.length} frames · full archive` : `${mobilePhotosToShow.length} frames · short preview`}</p></div>
              <div className="mt-7 columns-1 gap-4">{mobilePhotosToShow.map((photo) => <article key={`${photo.id}-${photo.src}`} data-reveal className="mb-5 break-inside-avoid"><button type="button" onClick={() => openPhoto(photo, mobilePhotosToShow)} className="block w-full text-left"><div className={`relative overflow-hidden bg-[#d9c9b4] ${ratioClass(photo.ratio)}`}><Image src={photo.src} alt={`${photo.sessionTitle} frame ${photo.frame}`} fill sizes="100vw" className="object-cover" /></div><div className="flex items-start justify-between gap-5 border-b border-[#17130f]/10 py-4"><div><h4 className="font-editorial text-3xl leading-none tracking-[-0.04em]">{photo.sessionTitle}</h4><p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#6f6255]">Frame {String(photo.frame).padStart(2, "0")}</p></div><p className="pt-1 text-right text-[10px] uppercase leading-5 tracking-[0.2em] text-[#8c6f45]">{photo.location}<br />{photo.year}</p></div></button></article>)}</div>
              <div className="mt-8 grid gap-3 border-t border-[#17130f]/10 pt-6"><button type="button" onClick={() => setMobileGalleryOpen((value) => !value)} className="btn-dark">{mobileGalleryOpen ? "Show short preview" : `Open full gallery · ${visiblePhotos.length} frames`}</button><a href="#about" className="btn-outline">Continue to About Leila</a></div>
            </div>

            <div className="hidden sm:block">
              <div className="mt-12 grid auto-rows-[230px] grid-cols-4 gap-4 xl:auto-rows-[270px]">{desktopItems.map(({ config, photo }) => <button key={photo.id} type="button" onClick={() => openPhoto(photo, desktopLightboxPhotos)} data-reveal className={`group relative overflow-hidden bg-[#d9c9b4] text-left ${config.size}`}><Image src={photo.src} alt={`${photo.sessionTitle} selected frame`} fill sizes="(max-width: 1280px) 50vw, 34vw" className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/62 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-[#f4efe6]"><div><p className="text-[10px] uppercase tracking-[0.24em] text-[#c7ad82]">Story {photo.sessionNumber}</p><h3 className="font-editorial mt-2 text-4xl leading-none">{photo.sessionTitle}</h3></div><p className="text-[10px] uppercase tracking-[0.24em]">Open</p></div></button>)}</div>

              <div className="mt-20 border-t border-[#17130f]/12 pt-12"><div data-reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"><div><p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-[#8c6f45]">Stories archive</p><h3 className="font-editorial max-w-[56rem] text-[clamp(3rem,6vw,6.5rem)] leading-[0.86]">Choose one story.</h3></div><p className="max-w-[36rem] text-[16px] leading-8 text-[#4f463d]">Each session opens as its own clean grid. Selected work stays independent, so every click opens the correct photo set.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{sessions.map((session) => <button key={session.id} type="button" onClick={() => changeFilter(session.id)} data-reveal className={`group text-left ${activeFilter === session.id ? "opacity-100" : "opacity-80 hover:opacity-100"}`}><div className={`relative aspect-[4/5] overflow-hidden bg-[#d9c9b4] ${activeFilter === session.id ? "ring-1 ring-[#17130f]" : ""}`}><Image src={`/photos/${session.id}/01.jpg`} alt={`${session.title} cover`} fill sizes="(max-width: 1280px) 25vw, 18vw" className="object-cover transition duration-[900ms] group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/72 via-transparent to-transparent" /><div className="absolute bottom-4 left-4 right-4 text-[#f4efe6]"><p className="text-[10px] uppercase tracking-[0.24em] text-[#c7ad82]">Story {session.number}</p><h4 className="font-editorial mt-2 text-3xl leading-none">{session.title}</h4><p className="mt-3 text-[10px] uppercase tracking-[0.2em]">{session.count} frames</p></div></div></button>)}</div>{activeSession ? <div className="mt-14 border-t border-[#17130f]/12 pt-9"><div className="mb-8 flex items-end justify-between gap-6"><div><p className="text-[10px] uppercase tracking-[0.28em] text-[#8c6f45]">{activeSession.note}</p><h3 className="font-editorial mt-2 text-[clamp(3rem,5vw,5.8rem)] leading-[0.9]">{activeSession.title}</h3></div><button type="button" onClick={() => changeFilter("all")} className="hidden border border-[#17130f]/20 px-5 py-3 text-[10px] uppercase tracking-[0.24em] transition hover:border-[#17130f] lg:block">Close story</button></div><div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">{activeStoryPhotos.map((photo) => <button key={photo.id} type="button" onClick={() => openPhoto(photo, activeStoryPhotos)} data-reveal className="group text-left"><div className="relative aspect-[4/5] overflow-hidden bg-[#d9c9b4]"><Image src={photo.src} alt={`${photo.sessionTitle} frame ${photo.frame}`} fill sizes="(max-width: 1280px) 20vw, 15vw" className="object-cover transition duration-[900ms] group-hover:scale-[1.035]" /></div><p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#6f6255]">Frame {String(photo.frame).padStart(2, "0")}</p></button>)}</div></div> : null}</div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#17130f] px-4 py-20 text-[#f4efe6] sm:px-6 sm:py-28 lg:px-10 lg:py-36"><div className="mx-auto grid max-w-[1560px] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20"><div data-reveal><div className="relative aspect-[4/5] overflow-hidden bg-[#3a342d]"><Image src="/photos/session-07/01.jpg" alt="Leila photographer portrait" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover opacity-95" /></div><p className="mt-5 max-w-[26rem] text-[10px] uppercase leading-5 tracking-[0.22em] text-[#d9c9b4] sm:tracking-[0.28em]">Photographer in Valencia · portraits · couples · families</p></div><div data-reveal className="flex flex-col justify-center"><p className="mb-5 text-[10px] uppercase tracking-[0.26em] text-[#c7ad82] sm:mb-6 sm:tracking-[0.34em]">About Leila</p><h2 className="font-editorial text-[clamp(3.2rem,13vw,8.5rem)] leading-[0.88] sm:leading-[0.84]">Real emotion without forced posing.</h2><div className="mt-8 grid gap-6 text-[16px] leading-8 text-[#d9c9b4] sm:mt-10 sm:text-[18px] sm:leading-9"><p>Leila is a photographer based in Valencia, Spain, working with portraits, couples and families. Her work is built around soft direction, natural gestures and a timeless visual style.</p><p>The sessions are calm and personal. The goal is not to make people look different, but to show their closeness, beauty and emotion with better light, better timing and better composition.</p></div><a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="btn-ghost-dark mt-9 sm:mt-10 sm:w-fit">Open Instagram</a></div></div></section>

        <section id="services" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36"><div className="mx-auto max-w-[1560px]"><div data-reveal className="mb-12 max-w-[58rem] sm:mb-14"><p className="mb-5 text-[10px] uppercase tracking-[0.26em] text-[#8c6f45] sm:tracking-[0.34em]">Services</p><h2 className="font-editorial text-[clamp(3.2rem,13vw,8.5rem)] leading-[0.88] sm:leading-[0.84]">Portraits, couples and families in Valencia.</h2></div><div className="border-t border-[#17130f]/15">{services.map((service) => <article key={service.title} data-reveal className="grid gap-5 border-b border-[#17130f]/15 py-8 md:grid-cols-[0.18fr_0.82fr_1fr] md:gap-10 md:py-12"><p className="text-[10px] uppercase tracking-[0.24em] text-[#8c6f45] sm:tracking-[0.3em]">{service.index}</p><h3 className="font-editorial text-[clamp(2.5rem,11vw,5.4rem)] leading-[0.9] sm:leading-[0.88]">{service.title}</h3><div><p className="text-[16px] leading-8 text-[#3a342d] sm:text-[18px] sm:leading-9">{service.description}</p><p className="mt-5 text-[10px] uppercase leading-5 tracking-[0.2em] text-[#6f6255] sm:tracking-[0.24em]">{service.details}</p></div></article>)}</div></div></section>

        <section id="investment" className="bg-[#e8dece] px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36"><div className="mx-auto max-w-[1560px]"><div data-reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"><div><p className="mb-5 text-[10px] uppercase tracking-[0.26em] text-[#8c6f45] sm:tracking-[0.34em]">Investment</p><h2 className="font-editorial max-w-[58rem] text-[clamp(3.2rem,13vw,8.5rem)] leading-[0.88] sm:leading-[0.84]">Simple pricing for private sessions.</h2></div><p className="max-w-[38rem] text-[16px] leading-8 text-[#4f463d] sm:text-[18px] sm:leading-9">Final price depends on location, timing and the selected format. To check availability, send a direct message on Instagram.</p></div><div className="mt-12 border-t border-[#17130f]/15 sm:mt-14">{investment.map((item) => <article key={item.title} data-reveal className="grid gap-5 border-b border-[#17130f]/15 py-8 md:grid-cols-[0.18fr_1fr_0.55fr] md:items-end md:gap-10 md:py-12"><p className="text-[10px] uppercase tracking-[0.24em] text-[#8c6f45] sm:tracking-[0.3em]">{item.index}</p><h3 className="font-editorial text-[clamp(2.5rem,11vw,5.4rem)] leading-[0.9] sm:leading-[0.88]">{item.title}</h3><div className="md:text-right"><p className="font-editorial text-[clamp(2.6rem,10vw,5rem)] leading-none tracking-[-0.05em] text-[#17130f]">{item.price}</p><p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#6f6255]">{item.unit}</p></div></article>)}</div><div data-reveal className="mt-8 grid gap-3 sm:flex sm:items-center sm:justify-between"><p className="max-w-[34rem] text-[13px] leading-6 text-[#5d5146]">Prices are shown for hourly sessions. Travel, extended coverage and custom requests are discussed individually.</p><a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="btn-dark sm:w-fit">Ask for availability</a></div></div></section>

        <section id="process" className="bg-[#e8dece] px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36"><div className="mx-auto grid max-w-[1560px] gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:gap-20"><div data-reveal className="lg:sticky lg:top-32 lg:self-start"><p className="mb-5 text-[10px] uppercase tracking-[0.26em] text-[#8c6f45] sm:tracking-[0.34em]">Process</p><h2 className="font-editorial text-[clamp(3.1rem,12vw,7.5rem)] leading-[0.88] sm:leading-[0.84]">Easy booking. Calm session. Timeless gallery.</h2></div><div className="space-y-4">{process.map((step, index) => <article key={step.title} data-reveal className="grid gap-4 border border-[#17130f]/10 bg-[#f4efe6]/45 p-5 sm:p-7 md:grid-cols-[0.18fr_0.82fr] md:gap-5"><p className="font-editorial text-5xl leading-none text-[#8c6f45]">{String(index + 1).padStart(2, "0")}</p><div><h3 className="text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.3em]">{step.title}</h3><p className="mt-4 max-w-[46rem] text-[15px] leading-7 text-[#4f463d] sm:text-[17px] sm:leading-8">{step.text}</p></div></article>)}</div></div></section>

        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36"><div className="mx-auto max-w-[1560px]"><div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end lg:gap-8"><div data-reveal><p className="mb-5 text-[10px] uppercase tracking-[0.26em] text-[#8c6f45] sm:tracking-[0.34em]">Reviews</p><h2 className="font-editorial text-[clamp(3.1rem,12vw,7.5rem)] leading-[0.88] sm:leading-[0.84]">The best proof is recognition.</h2></div><p data-reveal className="max-w-[38rem] text-[16px] leading-8 text-[#4f463d] sm:text-[18px] sm:leading-9">The photographs should still feel like you — only softer, calmer and more timeless.</p></div><div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-3">{testimonials.map((item) => <article key={item.context} data-reveal className="flex min-h-[300px] flex-col justify-between border border-[#17130f]/12 bg-[#efe7da] p-6 sm:min-h-[330px] sm:p-7"><p className="font-editorial text-[2rem] leading-[1.05] tracking-[-0.05em] text-[#261c14]">“{item.quote}”</p><div className="mt-10 border-t border-[#17130f]/12 pt-5"><p className="text-[11px] uppercase tracking-[0.24em]">{item.name}</p><p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#8c6f45]">{item.context}</p></div></article>)}</div></div></section>

        <section id="booking" className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-10"><div className="mx-auto max-w-[1560px] bg-[#17130f] px-5 py-10 text-[#f4efe6] sm:px-8 sm:py-14 lg:px-14 lg:py-20"><div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"><div data-reveal className="flex flex-col justify-center"><p className="mb-5 text-[10px] uppercase tracking-[0.26em] text-[#c7ad82]">Booking open</p><h2 className="font-editorial text-[clamp(3.1rem,13vw,9rem)] leading-[0.88]">Write to Leila and choose your date.</h2><p className="mt-7 max-w-[34rem] text-[16px] leading-8 text-[#d9c9b4] sm:text-[18px] sm:leading-9">Send a direct message on Instagram with the session type, city, preferred date and the atmosphere you want. Leila will reply with availability and next steps.</p></div><div data-reveal className="relative min-h-[420px] overflow-hidden bg-[#2a2018] sm:min-h-[520px]"><Image src="/photos/session-05/01.jpg" alt="Leila family session booking preview" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/92 via-[#17130f]/38 to-[#17130f]/10" /><div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10"><p className="mb-4 text-[10px] uppercase leading-5 tracking-[0.2em] text-[#c7ad82]">DM to book · portraits · couples · families</p><a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="btn-light">Book via Instagram</a><div className="mt-6 grid gap-3 text-[10px] uppercase tracking-[0.22em] text-[#f4efe6]"><a href={studio.instagramUrl} target="_blank" rel="noreferrer">{studio.instagram}</a><p>{studio.city}</p></div></div></div></div></div></section>

        <footer className="px-4 py-8 sm:px-6 lg:px-10"><div className="mx-auto flex max-w-[1560px] flex-col gap-4 border-t border-[#17130f]/12 pt-6 text-[10px] uppercase tracking-[0.2em] text-[#6f6255] md:flex-row md:items-center md:justify-between"><p>© 2026 {studio.name}</p><a href={studio.instagramUrl} target="_blank" rel="noreferrer">{studio.instagram}</a><p>{studio.city}</p></div></footer>

        {activePhoto ? <div role="dialog" aria-modal="true" aria-label="Photo preview" onClick={() => setActivePhoto(null)} onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)} onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#17130f]/95 p-4 text-[#f4efe6] sm:p-8"><button type="button" onClick={() => setActivePhoto(null)} className="absolute right-4 top-4 z-10 border border-[#f4efe6]/20 px-4 py-3 text-[10px] uppercase tracking-[0.22em] transition hover:border-[#f4efe6]">Close</button><button type="button" onClick={(event) => { event.stopPropagation(); movePhoto(-1); }} className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 border border-[#f4efe6]/20 px-4 py-5 text-[10px] uppercase tracking-[0.26em] md:block">Prev</button><button type="button" onClick={(event) => { event.stopPropagation(); movePhoto(1); }} className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 border border-[#f4efe6]/20 px-4 py-5 text-[10px] uppercase tracking-[0.26em] md:block">Next</button><figure onClick={(event) => event.stopPropagation()} className="grid max-h-[92vh] w-full max-w-[1180px] gap-4 sm:gap-5"><div className="relative h-[68vh] max-h-[760px] w-full overflow-hidden sm:h-[70vh]"><Image src={activePhoto.src} alt={`${activePhoto.sessionTitle} full preview`} fill sizes="100vw" className="object-contain" priority /></div><figcaption className="flex flex-col gap-2 border-t border-[#f4efe6]/15 pt-4 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="font-editorial text-4xl leading-none">{activePhoto.sessionTitle}</h3><p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#d9c9b4]">Story {activePhoto.sessionNumber} · Frame {String(activePhoto.frame).padStart(2, "0")}</p></div><p className="text-[10px] uppercase tracking-[0.22em] text-[#c7ad82]">{activePhoto.location} · {activePhoto.year}</p></figcaption><div className="grid grid-cols-2 gap-3 md:hidden"><button type="button" onClick={() => movePhoto(-1)} className="border border-[#f4efe6]/20 px-4 py-4 text-[10px] uppercase tracking-[0.22em]">Prev</button><button type="button" onClick={() => movePhoto(1)} className="border border-[#f4efe6]/20 px-4 py-4 text-[10px] uppercase tracking-[0.22em]">Next</button></div></figure></div> : null}
      </div>
    </main>
  );
}
