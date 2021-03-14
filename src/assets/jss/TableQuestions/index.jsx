const questionTableStyle = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    flexBasis: 200
  },
  textPlain: {
    width: "17%",
    fontWeight: "500"
  },
  margin: {
    margin: theme.spacing.unit,
    padding: 0
  },
  inputAdornment: {
    marginLeft: "0"
  },
  widthTotal: {
    fontWeight: "bold",
    alignItems: "center",
    height: "37px",
    display: "inline-flex",
    marginLeft: "10px"
  },
  div: {
    display: "inline-block",
    padding: 3,
    float: "right",
    marginTop: "5%"
  },
  separator: {
    margin: "2px"
  }
});

export default questionTableStyle;
