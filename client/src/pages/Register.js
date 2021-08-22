import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "../util/hooks";
import Grid from "@material-ui/core/Grid";
import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Union from "../../src/assets/Union.png";

function Register(props) {
  const [errors, setErrors] = useState({});
  let history = useHistory();
  const { onChange, onSubmit, values } = useForm(registerUser, {
    email: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER2_USER, {
    onCompleted() {
      history.push("/otpverification");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="97vh"
    >
      <Container maxWidth="md">
        <Grid container>
          <Grid md={6} xs={12}>
            <div className="leftSide">
              <p>all</p>
              <p>your</p>
              <p>bookmarks</p>
              <p>in one place</p>
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="rightSide">
              <img className="icon" src={Union} alt="" />
              <form
                noValidate
                onSubmit={onSubmit}
                className={loading ? "loading" : ""}
              >
                <div className="ip_plus_error">
                  <input
                    className="email_input"
                    placeholder="enter your email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={onChange}
                  />
                  <br />
                  {Object.keys(errors).length > 0 && (
                    <div className="error_msgs">
                      {Object.values(errors).map((value) => (
                        <div key={value}>{value}</div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="reg_button" type="submit">
                  send otp
                </button>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Register;

const REGISTER2_USER = gql`
  mutation register($email: String!) {
    register(email: $email) {
      id
      email
    }
  }
`;
