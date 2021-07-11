import React, { useContext, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    userusername: "",
    bio: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
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
    <Container style={{ width: "500px" }}>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          type="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Userusername"
          placeholder="Userusername"
          name="userusername"
          type="userusername"
          value={values.userusername}
          error={errors.userusername ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Bio"
          placeholder="Describe yourself"
          name="bio"
          type="bio"
          value={values.bio}
          error={errors.bio ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $email: String!
    $password: String!
    $confirmPassword: String!
    $username: String!
    $userusername: String!
    $bio: String!
  ) {
    register(
      registerInput: {
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        username: $username
        userusername: $userusername
        bio: $bio
      }
    ) {
      id
      email
      username
      userusername
      bio
      createdAt
      token
    }
  }
`;

export default Register;
