import React from "react";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import styled from "styled-components";
import { Menu } from "@material-ui/icons";

const Wrapper = styled.div`
  .header-style {
    background-color: #000 !important;
    height: 35px;
    flex-grow: 1;
  }
  h4 {
    color: #fff;
  }
`;

export default class NewHeader extends React.Component {
  onCloseHandle(e) {
    console.log(e);
  }

  render() {
    return (
      <Wrapper>
        <AppBar position="static" className="header-style">
          <Toolbar className="header-style">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => this.props.onClick("header")}
            >
              <Menu />
            </IconButton>
            <h4>BlackfinTech</h4>
          </Toolbar>
        </AppBar>
      </Wrapper>
    );
  }
}
