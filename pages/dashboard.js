import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import React from "react";
import MainContainer from "../components/maincontainer";

export default function dashboard(props) {
  return (
    <>
      {/* <NavigationBar /> */}
      <MainContainer>{props.children}</MainContainer>
      {/* <Footer /> */}
    </>
  );
}
