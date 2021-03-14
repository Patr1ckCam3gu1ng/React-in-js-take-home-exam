import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import sidebarStyle from "assets/jss/material-dashboard-react/components/sidebarStyle.jsx";
import { ArrowBack } from "@material-ui/icons";

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1 ? true : false;
  }

  const { classes, color, image, routes, onClick, open } = props;
  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        if (prop.redirect) return null;
        var activePro = " ";
        var listItemClasses;
        if (prop.path === "/upgrade-to-pro") {
          activePro = classes.activePro + " ";
          listItemClasses = classNames({
            [" " + classes[color]]: true
          });
        } else {
          listItemClasses = classNames({
            [" " + classes[color]]: activeRoute(prop.path)
          });
        }
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.path)
        });

        const sectionSettings = `${process.env.PUBLIC_URL}/sectionSettings`;

        const forms = `${process.env.PUBLIC_URL}/forms/:id`;

        const formFormVersions = `${process.env.PUBLIC_URL}/forms/:id/formVersions/:id`;

        const formFormVersionSections = `${process.env.PUBLIC_URL}/forms/:id/formVersions/:id/sections/:id`;

        const formFormVersionSectionSectionSettings = `${process.env.PUBLIC_URL}/forms/:id/formVersions/:id/sections/:id/sectionSettings/:id`;

        if (
          prop.path === sectionSettings ||
          prop.path === forms ||
          prop.path === formFormVersions ||
          prop.path === formFormVersionSections ||
          prop.path === formFormVersionSectionSectionSettings
        ) {
          return <span key={key} />;
        }
        return (
          <NavLink
            to={prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
            onClick={() => onClick("sidemenu")}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              <ListItemText
                primary={prop.sidebarName}
                className={classes.itemText + whiteFontClasses}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  var brand = (
    <div
      className={classes.logo}
      onClick={() => onClick("sidemenu")}
      style={{ color: "white", cursor: "pointer" }}
    >
      {/* <a href="https://blackfintech.co" className={classes.logoLink}>
        {logoText}
      </a> */}
      <ArrowBack style={{ position: "absolute" }} />{" "}
      <span style={{ marginLeft: 28 }}>Hide</span>
    </div>
  );
  return (
    <div>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          variant="persistent"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(sidebarStyle)(Sidebar);
