type ArrowProps = { className?: string };

function classes(className?: string) {
  return className ? `ui-arrow ${className}` : "ui-arrow";
}

export function ArrowUpRight({ className }: ArrowProps) {
  return <svg className={classes(className)} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 12.5 12 4M5 4h7v7" /></svg>;
}

export function ArrowDown({ className }: ArrowProps) {
  return <svg className={classes(className)} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2.5v10M3.75 8.5 8 12.75l4.25-4.25" /></svg>;
}

export function ArrowLeft({ className }: ArrowProps) {
  return <svg className={classes(className)} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M13.5 8h-11M6.5 4 2.5 8l4 4" /></svg>;
}

export function ArrowRight({ className }: ArrowProps) {
  return <svg className={classes(className)} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2.5 8h11M9.5 4l4 4-4 4" /></svg>;
}

export function ArrowUp({ className }: ArrowProps) {
  return <svg className={classes(className)} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 13.5v-11M3.75 6.5 8 2.25l4.25 4.25" /></svg>;
}
