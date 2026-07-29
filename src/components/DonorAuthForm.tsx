import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FormEvent, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Input } from './ui/Input'
import { Logo } from './ui/Logo'
import { loginSchema, signupSchema, type LoginFormValues, type SignupFormValues } from '../lib/validators'

export interface DonorAuthFormProps {
  mode: 'login' | 'signup'
}

function useRedirectAfterLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/account'
  return () => navigate(from, { replace: true })
}

function AuthShell({
  headline,
  subline,
  ctaLabel,
  ctaLoadingLabel,
  switchPrompt,
  switchHref,
  switchLabel,
  children,
  onSubmit,
}: {
  headline: string
  subline: string
  ctaLabel: string
  ctaLoadingLabel: string
  switchPrompt: string
  switchHref: string
  switchLabel: string
  children: ReactNode
  onSubmit: (e: FormEvent) => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col justify-center px-20 py-16">
      <Link to="/" className="mb-12 flex items-center gap-2.5 no-underline">
        <Logo size={28} />
        <span className="font-display text-lg font-bold text-text">Uplifted</span>
      </Link>

      <h1 className="mb-2 font-display text-[30px] font-semibold text-text">{headline}</h1>
      <p className="mb-8 font-sans text-[14.5px] text-text-2">{subline}</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        {children}
        <SubmitButton label={ctaLabel} loadingLabel={ctaLoadingLabel} />
      </form>

      <div className="mt-6 text-center font-sans text-[13.5px] text-text-2">
        {switchPrompt}{' '}
        <Link to={switchHref} className="font-semibold text-primary no-underline">
          {switchLabel}
        </Link>
      </div>
    </div>
  )
}

function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
  const { isLoading } = useAuth()
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="rounded-[10px] bg-gradient-to-br from-[#3F7A5C] via-[#5B9E77] to-[#7FBF8C] py-3.5 text-center font-sans text-[15px] font-semibold text-white disabled:opacity-60"
    >
      {isLoading ? loadingLabel : label}
    </button>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 font-sans text-xs text-danger">{message}</p>
}

function LoginForm() {
  const { login } = useAuth()
  const redirect = useRedirectAfterLogin()
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    await login({ email: values.email, password: values.password, role: 'donor' })
    redirect()
  }

  return (
    <AuthShell
      headline="Welcome back"
      subline="Sign in to see your giving history and impact."
      ctaLabel="Sign in"
      ctaLoadingLabel="Please wait…"
      switchPrompt="Don't have an account?"
      switchHref="/signup"
      switchLabel="Sign up"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Input type="email" placeholder="Email address" {...register('email')} />
        <FieldError message={formState.errors.email?.message} />
      </div>
      <div>
        <Input type="password" placeholder="Password" {...register('password')} />
        <FieldError message={formState.errors.password?.message} />
      </div>
    </AuthShell>
  )
}

function SignupForm() {
  const { login } = useAuth()
  const redirect = useRedirectAfterLogin()
  const { register, handleSubmit, formState } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(values: SignupFormValues) {
    await login({ email: values.email, password: values.password, role: 'donor' })
    redirect()
  }

  return (
    <AuthShell
      headline="Create your account"
      subline="Track every gift and its impact in one place."
      ctaLabel="Create account"
      ctaLoadingLabel="Please wait…"
      switchPrompt="Already have an account?"
      switchHref="/login"
      switchLabel="Sign in"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Input placeholder="Full name" {...register('name')} />
        <FieldError message={formState.errors.name?.message} />
      </div>
      <div>
        <Input type="email" placeholder="Email address" {...register('email')} />
        <FieldError message={formState.errors.email?.message} />
      </div>
      <div>
        <Input type="password" placeholder="Password" {...register('password')} />
        <FieldError message={formState.errors.password?.message} />
      </div>
    </AuthShell>
  )
}

export function DonorAuthForm({ mode }: DonorAuthFormProps) {
  return mode === 'signup' ? <SignupForm /> : <LoginForm />
}
