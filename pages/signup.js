import Navigation from "../components/Navigation/navigationBar";
import RegisterForm from "../components/forms/registerForm";
import Title from "../components/UI/Title";

export default function Signup() {
  return (
    <div className="w-full	container flex justify-center items-center h-screen">
      <main
        className="container box-border p-2 space-y-4 "
        style={{ maxWidth: "750px" }}
      >
        <Title>Create an Account</Title>
        <RegisterForm />
      </main>
    </div>
  );
}
