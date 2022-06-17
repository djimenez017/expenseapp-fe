import Navigation from "../components/Navigation/navigationBar";
import RegisterForm from "../components/forms/registerForm";

export default function Signup() {
  return (
    <div className="w-full	">
      <Navigation />
      <main
        className="container box-border p-2 space-y-4"
        style={{ maxWidth: "750px" }}
      >
        <h2>Create an Account</h2>
        <RegisterForm />
      </main>
    </div>
  );
}
