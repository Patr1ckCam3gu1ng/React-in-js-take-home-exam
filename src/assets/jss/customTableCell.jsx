import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell/TableCell";

const CustomTableCell = withStyles(() => ({
  head: {
    color: "#a13bb6",
    fontSize: 15
  },
  body: {
    fontSize: 12.5,
    maxWidth: "100px",
    minWidth: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}))(TableCell);

export { CustomTableCell };
