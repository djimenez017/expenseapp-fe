import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import React from "react";
import Container from "../components/container";
import Session from "../components/hoc/session";

export default function dashboard(props) {
  return (
    <Session>
      <div className="w-full">
        <NavigationBar />
        <Container>{props.children}</Container>
        <Footer />
      </div>
    </Session>
  );
}
