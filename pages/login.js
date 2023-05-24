import Layout from '../components/layout';
import utilStyles from '../styles/module/utils.module.scss';
import { useRouter } from "next/router";
import React, { useState } from "react";
import { getCsrfToken, signIn } from "next-auth/react";

export default function LoginPage({ csrfToken }) {
  const [error, setError] = useState("");
  const router = useRouter();
  const callbackUrl = (router.query?.callbackUrl) ?? "/";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const _target = e.target;
    const name = _target.name.value;
    const password = _target.password.value;
    const result = await signIn("credentials", {
      name,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError(result.error);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <Layout page='login-page'>
      <section className="block">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Login</h2>

          <form method="post" onSubmit={handleSubmit}>
            {!!error && <p className='mb-3 badge text-bg-danger'>Your email or password is not correct</p>}

            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className='mb-3'>
              <label className="form-label">Name</label>
              <input name="name" className="form-control" type="text" />
            </div>

            <div className='mb-3'>
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" />
            </div>

            <button type="submit" className="btn btn-primary">Sign in</button>
          </form>

          <button type="button" className="btn btn-light mt-3" onClick={()=>signIn('google')}>Sign in with Google</button>
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
