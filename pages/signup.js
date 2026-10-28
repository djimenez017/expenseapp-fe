import Navigation from "../components/Navigation/navigationBar";
import RegisterForm from "../components/forms/registerForm";
import Title from "../components/UI/Title";

export default function Signup() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <main
        className="container box-border p-4 space-y-4 m-auto"
        style={{ maxWidth: "750px" }}
      >
        <Title>Create an Account</Title>
        <RegisterForm />
      </main>
    </div>
  );
}
