import RegisterForm from "../components/forms/registerForm";
import Title from "../components/UI/Title";
import BackLink from "../components/UI/BackLink";

export default function Signup() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <main className="shell space-y-5">
        <div>
          <BackLink href="/">Sign in</BackLink>
          <Title>Create an account</Title>
        </div>
        <RegisterForm />
      </main>
    </div>
  );
}
