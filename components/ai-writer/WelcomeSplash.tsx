export const WelcomeSplash = () => (
  <section className="rounded-2xl border border-secondary-200 bg-white p-4 text-left shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-6">
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-600 dark:text-primary-300">
        Ready when you are
      </p>
      <h2 className="text-xl font-semibold text-charcoal-700 dark:text-secondary-100 sm:text-2xl">
        Draft your next campaign in three quick inputs
      </h2>
      <ul className="space-y-2 text-xs text-charcoal-500 dark:text-secondary-400 sm:text-sm">
        <li>• Topic — what story do you want to tell?</li>
        <li>• Keywords — comma-separated highlights to weave in</li>
        <li>• Tone — pick the voice that matches the publication</li>
      </ul>
    </div>
  </section>
)

