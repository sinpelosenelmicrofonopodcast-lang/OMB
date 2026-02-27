import { Input } from "@/components/ui/input";
import { signInAction, signUpAction } from "@/actions/auth-actions";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = first(resolvedSearchParams.next) ?? "/admin";
  const message = first(resolvedSearchParams.message);

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-gold/80">Account Access</p>
      <h1 className="mt-4 font-heading text-5xl text-softWhite">Admin Authentication</h1>

      {message ? (
        <p className="mt-4 rounded-2xl border border-gold/35 bg-gold/10 p-4 text-sm text-gold/90">{message}</p>
      ) : null}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <form action={signInAction} className="panel space-y-4">
          <h2 className="font-heading text-3xl text-softWhite">Sign In</h2>
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label htmlFor="signInEmail" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Email
            </label>
            <Input id="signInEmail" name="email" type="email" required />
          </div>
          <div>
            <label htmlFor="signInPassword" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Password
            </label>
            <Input id="signInPassword" name="password" type="password" required />
          </div>
          <button className="w-full rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-4 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
            Sign In
          </button>
        </form>

        <form action={signUpAction} className="panel space-y-4">
          <h2 className="font-heading text-3xl text-softWhite">Create Account</h2>
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label htmlFor="signUpName" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Full Name
            </label>
            <Input id="signUpName" name="full_name" required />
          </div>
          <div>
            <label htmlFor="signUpEmail" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Email
            </label>
            <Input id="signUpEmail" name="email" type="email" required />
          </div>
          <div>
            <label htmlFor="signUpPassword" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Password
            </label>
            <Input id="signUpPassword" name="password" type="password" minLength={6} required />
          </div>
          <button className="w-full rounded-2xl border border-gold/50 px-4 py-2 text-sm text-gold hover:bg-gold/10">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}
