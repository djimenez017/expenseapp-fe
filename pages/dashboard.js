import NavigationBar from "../components/Navigation/navigationBar";

import React from "react";
import Container from "../components/container";

export default function dashboard(props) {
  return (
    <>
      <NavigationBar />
      <Container>{props.children}</Container>
    </>
  );
}
