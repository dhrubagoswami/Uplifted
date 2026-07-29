import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../../components/ui/Input'
import { loginSchema } from '../../lib/validators'
import type { LoginFormValues } from '../../lib/validators'

export default function AdminLoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/admin'
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    await login({ email: values.email, password: values.password, role: 'admin' })
    navigate(from, { replace: true })
  }

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="w-full max-w-[400px] rounded-[20px] border border-border bg-surface p-9 shadow-[0_20px_60px_rgba(0,0,0,.6)]">
        <div className="mb-7 flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#6366F1] via-[#A78BFA] to-[#E879F9]" />
          <span className="font-display text-[17px] font-bold text-text">Uplifted</span>
          <span className="ml-auto rounded-md bg-surface-2 px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-text-2">
            Org admin
          </span>
        </div>

        <h1 className="mb-1.5 font-display text-[22px] font-semibold text-text">
          Sign in to your organization
        </h1>
        <p className="mb-6 font-sans text-[13.5px] text-text-2">
          Manage campaigns, donations, and payouts.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <Input type="email" placeholder="Work email" {...register('email')} />
            {formState.errors.email && (
              <p className="mt-1 font-sans text-xs text-danger">{formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <Input type="password" placeholder="Password" {...register('password')} />
            {formState.errors.password && (
              <p className="mt-1 font-sans text-xs text-danger">{formState.errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 rounded-[10px] bg-gradient-to-br from-[#6366F1] via-[#A78BFA] to-[#E879F9] py-3.5 text-center font-sans text-[14.5px] font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 text-center font-sans text-[12.5px] text-text-2">
          Not an org admin?{' '}
          <Link to="/login" className="font-semibold text-primary no-underline">
            Donor sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
