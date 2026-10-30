import RegisterForm from "../components/forms/registerForm";
import Title from "../components/UI/Title";

export default function Signup() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <main className="shell space-y-6">
        <Title>Create an Account</Title>
        <RegisterForm />
      </main>
    </div>
  );
}
