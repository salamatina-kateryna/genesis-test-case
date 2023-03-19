import React from "react";
import { PageHeader } from "antd";
import logo from "../img/logo.png";
import "./Header.scss";

const Header = () => {
  return (
    <>
      <a href="/">
        <PageHeader
          className="header"
          title="Front-end School 2.0. Кейсове завдання."
          avatar={{
            src: logo,
            size: 80,
          }}
        ></PageHeader>
      </a>
    </>
  );
};

export default Header;
