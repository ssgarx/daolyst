import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Form } from "semantic-ui-react";
import { useForm } from "../util/hooks";

function OneTimeForm(props) {
  let history = useHistory();
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(completeOtf, {
    username: "",
    userusername: "",
  });

  const [submitOtf] = useMutation(SUBMIT_OTF, {
    update(_, { data: { oneTimeForm: userData } }) {
      history.push("/");
      if (userData) {
        //FIND A BETTER WAY TO DO THIS
        window.location.reload();
      }
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function completeOtf() {
    submitOtf();
  }

  return (
    <Container>
      <Form onSubmit={onSubmit} noValidate>
        <h1>Please complete this OTF</h1>
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
        <Button type="submit" primary>
          Done
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

const SUBMIT_OTF = gql`
  mutation oneTimeForm($username: String!, $userusername: String!) {
    oneTimeForm(username: $username, userusername: $userusername) {
      id
      email
      username
      userusername
    }
  }
`;

export default OneTimeForm;
