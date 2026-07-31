export function DuoDemo() {
  return (
    <div
      className="duo-stage relative mx-auto w-full max-w-xl px-1"
      aria-label="Démonstration : Zoé et Max votent chacun de leur côté"
    >
      <p className="mb-6 text-center text-sm font-medium text-white/75">
        Chacun son téléphone — les votes restent privés
      </p>

      <div className="duo-scene relative mx-auto">
        <div className="duo-match pointer-events-none absolute left-1/2 top-[40%] z-20 -translate-x-1/2 -translate-y-1/2">
          <span className="duo-match-pill inline-block rounded-full bg-coral px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_0_24px_rgb(255_92_122/0.55)]">
            Match
          </span>
        </div>

        <div className="grid grid-cols-2 items-start gap-3 sm:gap-5">
          {/* Zoé */}
          <div className="duo-phone duo-phone-left">
            <div className="duo-phone-body">
              <div className="duo-phone-notch" aria-hidden />
              <div className="duo-phone-screen">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky text-[10px] font-bold text-coral-deep">
                    Z
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-ink">Zoé</p>
                    <p className="text-[9px] text-ink-soft">son téléphone</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[9px] font-semibold text-coral">maison</p>
                <p className="mt-0.5 text-[12px] font-bold leading-snug text-ink">
                  Soirée cuisine à l’aveugle
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-ink-soft">
                  Un ingrédient surprise chacun…
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
              Zoé a dit oui
            </p>
          </div>

          {/* Max */}
          <div className="duo-phone duo-phone-right">
            <div className="duo-phone-body">
              <div className="duo-phone-notch" aria-hidden />
              <div className="duo-phone-screen">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foam text-[10px] font-bold text-ink">
                    M
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-ink">Max</p>
                    <p className="text-[9px] text-ink-soft">son téléphone</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[9px] font-semibold text-coral">maison</p>
                <p className="mt-0.5 text-[12px] font-bold leading-snug text-ink">
                  Soirée cuisine à l’aveugle
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-ink-soft">
                  Il ne voit pas le vote de Zoé.
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
              Max a dit oui
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs font-medium text-white/55">
        Même idée · votes privés · FlipOn croise le résultat
      </p>
    </div>
  );
}
