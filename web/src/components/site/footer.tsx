import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-screen-lg px-4 md:px-6 py-8 text-sm text-neutral-600 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © {new Date().getFullYear()} IronMatrix100
        </p>
        <div className="flex items-center gap-4">
          <Link href="/">Start</Link>
          <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


