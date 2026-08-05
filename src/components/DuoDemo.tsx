export function DuoDemo() {
  return (
    <div
      className="duo-stage relative mx-auto w-full max-w-xl px-1"
      aria-label="Démonstration : Alex et Sam votent chacun de leur côté"
    >
      <p className="mb-4 text-center text-xs font-medium text-white/70 sm:mb-6 sm:text-sm">
        Votes privés → idée validée
      </p>

      <div className="duo-scene relative mx-auto">
        <div className="duo-match pointer-events-none absolute left-1/2 top-[40%] z-20 -translate-x-1/2 -translate-y-1/2">
          <span className="duo-match-pill inline-block rounded-md bg-coral px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            D’accord
          </span>
        </div>

        <div className="grid grid-cols-2 items-start gap-2 sm:gap-5">
          <div className="duo-phone duo-phone-left">
            <div className="duo-phone-body">
              <div className="duo-phone-notch" aria-hidden />
              <div className="duo-phone-screen">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky text-[10px] font-bold text-coral-deep">
                    A
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-ink">Alex</p>
                    <p className="text-[9px] text-ink-soft">son téléphone</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[9px] font-semibold text-coral">
                  dehors
                </p>
                <p className="mt-0.5 text-[12px] font-bold leading-snug text-ink">
                  Marché + café en terrasse
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-ink-soft">
                  90 minutes dehors, budget soft…
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <span className="rounded-md border border-line bg-white py-1.5 text-center text-[9px] font-semibold text-ink-soft">
                    Passer
                  </span>
                  <span className="duo-yes duo-yes-left rounded-md bg-coral py-1.5 text-center text-[9px] font-bold text-white">
                    Oui ✓
                  </span>
                </div>
              </div>
            </div>
            <p className="duo-caption duo-caption-left mt-2.5 text-center text-[11px] font-semibold text-white/80">
              Alex a dit oui
            </p>
          </div>

          <div className="duo-phone duo-phone-right">
            <div className="duo-phone-body">
              <div className="duo-phone-notch" aria-hidden />
              <div className="duo-phone-screen">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foam text-[10px] font-bold text-ink">
                    S
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-ink">Sam</p>
                    <p className="text-[9px] text-ink-soft">son téléphone</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[9px] font-semibold text-coral">
                  dehors
                </p>
                <p className="mt-0.5 text-[12px] font-bold leading-snug text-ink">
                  Marché + café en terrasse
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-ink-soft">
                  Sam ne voit pas le vote d’Alex.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <span className="rounded-md border border-line bg-white py-1.5 text-center text-[9px] font-semibold text-ink-soft">
                    Passer
                  </span>
                  <span className="duo-yes duo-yes-right rounded-md bg-coral py-1.5 text-center text-[9px] font-bold text-white">
                    Oui ✓
                  </span>
                </div>
              </div>
            </div>
            <p className="duo-caption duo-caption-right mt-2.5 text-center text-[11px] font-semibold text-white/80">
              Sam a dit oui
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs font-medium text-white/55">
        Votes privés · une seule idée pour tout le monde
      </p>
    </div>
  );
}
