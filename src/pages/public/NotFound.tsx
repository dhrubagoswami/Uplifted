import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-76px)] flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="-mb-10 font-display text-[96px] font-bold leading-none text-surface-2">404</div>
      <h1 className="font-display text-[26px] font-semibold text-text">This page wandered off</h1>
      <p className="max-w-[360px] font-sans text-[15px] text-text-2">
        The route you followed doesn't lead anywhere on Uplifted.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-[10px] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3] px-6 py-3 font-sans text-[14.5px] font-semibold text-white no-underline"
      >
        Back to home
      </Link>
    </div>
  )
}
