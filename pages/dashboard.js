import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import React from "react";
import Container from "../components/container";

export default function dashboard(props) {
  return (
    <div className="w-full	">
      <NavigationBar />
      <Container>{props.children}</Container>
      <Footer />
    </div>
  );
}
