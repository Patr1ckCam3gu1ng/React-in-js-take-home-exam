import { emphasize } from "@material-ui/core/styles/colorManipulator";

export default {
  getAll: theme => {
    return {
      root: {
        flexGrow: 1,
        height: 250,
        padding: 0
      },
      input: {
        display: "flex",
        fontSize: 16,
        fontWeight: "bold",
        padding: 0,
        margin: 0
      },
      valueContainer: {
        display: "flex",
        flexWrap: "wrap",
        flex: 1,
        alignItems: "center",
        overflow: "hidden",
        padding: 0
      },
      chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
      },
      chipFocused: {
        backgroundColor: emphasize(
          theme.palette.type === "light"
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
          0.08
        )
      },
      noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
      },
      singleValue: {
        fontSize: 16,
        fontWeight: "bold"
      },
      placeholder: {
        position: "absolute",
        fontSize: 16,
        color: "red"
      },
      paper: {
        position: "absolute",
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0
      },
      divider: {
        height: theme.spacing.unit * 2
      }
    };
  }
};
