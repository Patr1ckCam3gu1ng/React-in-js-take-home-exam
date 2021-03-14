import Typography from "@material-ui/core/Typography/Typography";
import React from "react";

function ColumnLabel({ label }) {
  return (
    <Typography
      align={"right"}
      color={"default"}
      style={{ margin: "10px 0px 0px 0px", fontWeight: "bold" }}
    >
      {label}
    </Typography>
  );
}

export default ColumnLabel;
