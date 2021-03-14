import React, { useCallback, useState } from "react";
import { withRouter } from "react-router";

import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/es/Button/Button";

import Card from "../../components/Internals/Card/Card";
import CardHeader from "../../components/Internals/Card/CardHeader";
import GridContainer from "../../components/Internals/Grid/GridContainer";
import GridItem from "../../components/Internals/Grid/GridItem";
import CardBody from "../../components/Internals/Card/CardBody";
import CardFooter from "../../components/Internals/Card/CardFooter";

import api from "apis/index";

const AuthLogin = ({ classes }) => {
  const [passCode, setPassCode] = useState(null);
  const [isFailed, setFailed] = useState(false);

  const handleOnChange = useCallback(
    (value) => {
      setPassCode(value);
    },
    [setPassCode]
  );
  const handleOnSubmit = async () => {
    await submitAuthentication(passCode);
  };
  const submitAuthentication = useCallback(async (passCode) => {
    const response = await api.login().submit(passCode);

    if (response.status === 401) {
      localStorage.clear();
      setFailed(true);
      return;
    }
    localStorage.setItem("jwtToken", response.token);
    window.location.href = "/";
  }, []);

  return (
    <GridContainer>
      <GridItem md={4}>
        <span />
      </GridItem>
      <GridItem md={4}>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Card>
          <CardHeader color="primary">
            <p className={classes.cardCategoryWhite}>Authentication Form</p>
          </CardHeader>
          <CardBody>
            <TextField
              id={"passcode"}
              label={"Passcode"}
              placeholder={"Enter the passcode to be authenticated"}
              fullWidth={true}
              margin="normal"
              onChange={(event) => handleOnChange(event.currentTarget.value)}
              error={isFailed}
              type={"password"}
              helperText={
                isFailed ? (
                  <label className={classes.passCodeError}>
                    {"Passcode is not valid"}
                  </label>
                ) : (
                  <span />
                )
              }
            />
            <GridContainer>
              <GridItem md={10} />
              <GridItem md={2}>
                <Button
                  onClick={handleOnSubmit}
                  className={classes.button}
                  variant="outlined"
                  size="medium"
                  color="primary"
                  autoFocus
                >
                  Submit
                </Button>
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter />
        </Card>
      </GridItem>
      <GridItem md={4}>
        <span />
      </GridItem>
    </GridContainer>
  );
};

const styles = () => ({
  button: {
    float: "right",
    marginRight: "8%",
    marginTop: "17%",
  },
  passCodeError: {
    color: "red",
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
});
export default withRouter(withStyles(styles)(AuthLogin));
