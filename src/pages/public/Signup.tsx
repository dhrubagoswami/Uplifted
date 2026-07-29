import { DonorAuthForm } from '../../components/DonorAuthForm'

export default function Signup() {
  return (
    <div className="grid min-h-[calc(100vh-76px)] grid-cols-1 lg:grid-cols-2">
      <DonorAuthForm mode="signup" />
      <div className="hidden flex-col justify-center bg-gradient-to-br from-[#3F7A5C] via-[#5B9E77] to-[#7FBF8C] p-16 lg:flex">
        <div className="max-w-[380px] text-white">
          <div className="mb-4 font-display text-[32px] font-bold leading-tight">
            &ldquo;86 of 120 filters funded, and I can see exactly which ones.&rdquo;
          </div>
          <div className="font-sans text-sm text-white/85">— Rhea Kapoor, donor since 2025</div>
        </div>
      </div>
    </div>
  )
}
