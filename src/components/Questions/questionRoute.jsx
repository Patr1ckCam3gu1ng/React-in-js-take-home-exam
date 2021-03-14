import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";

function QuestionRoute({
  match,
  id,
  title,
  showTitle,
  children,
  onRedirect,
  classes,
  rootUrl,
  returnUrl,
  secondaryTitle,
  responseGroupTitle,
  hasParentOption,
  sectionId
}) {
  const pathName =
    typeof rootUrl === "undefined"
      ? `${process.env.PUBLIC_URL}/sections/${sectionId}${match.url.replace(
          process.env.PUBLIC_URL,
          ""
        )}`
      : `${process.env.PUBLIC_URL}/sections/${sectionId}/${rootUrl}`;

  let toolTipTitle = (
    <React.Fragment>
      <span>
        {typeof hasParentOption === "undefined" ? "" : "Parent Option:"}{" "}
        <b>{title === null ? <i>not indicated</i> : title}</b>
      </span>
      {typeof hasParentOption === "undefined" ? (
        <span />
      ) : (
        <span>
          <br />
          <br />
        </span>
      )}
      <span>
        <i>{secondaryTitle}</i>
      </span>
      <span className={classes.arrowArrow} />
    </React.Fragment>
  );

  //This is not possible if the ParentQuestion is a group.
  // Instead, it should display the text: Response Group
  if (typeof responseGroupTitle !== "undefined") {
    if (responseGroupTitle !== null) {
      toolTipTitle = (
        <React.Fragment>
          <span>{responseGroupTitle}</span>
          <span className={classes.arrowArrow} />
        </React.Fragment>
      );
    }
  }

  return (
    <Tooltip
      disableHoverListener={typeof showTitle === "undefined"}
      placement={"bottom"}
      title={toolTipTitle}
      classes={{ popper: classes.arrowPopper, tooltip: classes.customWidth }}
    >
      <Link
        to={`${pathName}/${id}`}
        onClick={event => {
          window.open(`${pathName}/${id}?&newTab=`, "_blank");
          event.preventDefault();
        }}
      >
        {children === null
          ? null
          : children.substring(0, 80) + (children.length >= 80 ? "..." : "")}
      </Link>
    </Tooltip>
  );
}

const styles = theme => ({
  customWidth: {
    fontSize: 15,
    maxWidth: "none"
  },
  arrowPopper: {
    '&[x-placement*="bottom"] $arrowArrow': {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${
          theme.palette.grey[700]
        } transparent`
      }
    },
    '&[x-placement*="top"] $arrowArrow': {
      bottom: 0,
      left: 0,
      marginBottom: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${
          theme.palette.grey[700]
        } transparent transparent transparent`
      }
    },
    '&[x-placement*="right"] $arrowArrow': {
      left: 0,
      top: 30,
      marginLeft: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 1em 1em 0",
        borderColor: `transparent ${
          theme.palette.grey[700]
        } transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrowArrow': {
      right: 0,
      top: 30,
      marginRight: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 0 1em 1em",
        borderColor: `transparent transparent transparent ${
          theme.palette.grey[700]
        }`
      }
    }
  },
  arrowArrow: {
    marginLeft: "45%",
    position: "absolute",
    fontSize: 7,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid"
    }
  }
});

export default withRouter(withStyles(styles)(QuestionRoute));
