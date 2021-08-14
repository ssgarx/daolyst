import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    email: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER2_USER, {
    update(_, { data: { register: userData } }) {
      console.log("userData", userData);
      //   context.login(userData);
      props.history.push("/otpverification");
    },
    onError(err) {
      console.log("err", err.graphQLErrors[0]);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <Container>
      <Form noValidate onSubmit={onSubmit} className={loading ? "loading" : ""}>
        <h1>Register/Login</h1>
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Send otp
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </Container>
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
