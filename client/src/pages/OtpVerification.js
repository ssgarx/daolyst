import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function OtpVerification(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(verifyotp, {
    code: "",
  });

  const [addUser, { loading }] = useMutation(VERIFY_OTP, {
    update(_, { data: { verifyOtp: userData } }) {
      console.log("userDataX  :", userData);
      context.login(userData);
      props.history.push("/staging");
    },
    onError(err) {
      console.log("err", err.graphQLErrors[0]);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function verifyotp() {
    addUser();
  }

  return (
    <Container>
      <Form noValidate onSubmit={onSubmit} className={loading ? "loading" : ""}>
        <h1>ValidateOtp</h1>
        <Form.Input
          label="oTP LABEL"
          placeholder="ADD OT[.."
          name="code"
          value={values.code}
          error={errors.code ? true : false}
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

export default OtpVerification;

const VERIFY_OTP = gql`
  mutation verifyOtp($code: String!) {
    verifyOtp(code: $code) {
      code
      token
      email
      createdAt
    }
  }
`;
