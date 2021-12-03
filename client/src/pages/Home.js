// /* eslint-disable jsx-a11y/anchor-is-valid */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/auth";
// import LoggedInScreen from "../components/LoggedInScreen";
// import OneTimeForm from "./OneTimeForm";
// import { gql, useLazyQuery, useMutation } from "@apollo/client";
// import Register from "./Register";
// import { Box, CircularProgress } from "@material-ui/core";

// function Home(props) {
//   const [isNewUser, setIsNewUser] = useState(true);
//   const { user } = useContext(AuthContext);
//   let email = user?.email;

//   useEffect(() => {
//     //this check decides if show OTF or main screen
//     //if user exists, call checlIfNewUser and deleteOtps function
//     if (user) {
//       checkIfNewUser();
//       deleteOtps();
//     }
//   }, []);

//   const [checkIfNewUser, { loading }] = useLazyQuery(CHECK_FOR_NEWUSER, {
//     onCompleted: (data) => {
//       if (data.checkIfNewUser) {
//         //NEW USER DETECTED
//         setIsNewUser(true);
//       } else {
//         //OLD USER DETECTED
//         setIsNewUser(false);
//       }
//     },
//     variables: {
//       email,
//     },
//     fetchPolicy: "network-only",
//   });

//   const [deleteOtps] = useMutation(DELETE_OTP, {
//     variables: {
//       email,
//     },
//   });

//   let markUp;
//   if (loading) {
//     markUp = <CircularProgress style={{ color: "black" }} />;
//   } else {
//     user
//       ? isNewUser
//         ? (markUp = <OneTimeForm />)
//         : (markUp = <LoggedInScreen user={user} />)
//       : (markUp = <Register />);
//   }
//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       minHeight={"95vh"}
//     >
//       {markUp}
//     </Box>
//   );
// }

// const DELETE_OTP = gql`
//   mutation deleteOtp($email: String!) {
//     deleteOtps(email: $email)
//   }
// `;

// const CHECK_FOR_NEWUSER = gql`
//   query checkIfNewUser($email: String!) {
//     checkIfNewUser(email: $email)
//   }
// `;

// export default Home;

import React, { useContext, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import { AuthContext } from "../context/auth";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

function Home(props) {
  const { width, ref } = useResizeDetector();
  console.log("width", width);
  const [open, setOpen] = useState(false);

  const [isNewUser, setIsNewUser] = useState(true);
  const { user } = useContext(AuthContext);
  let email = user?.email;
  console.log("email", email);

  useEffect(() => {
    //this check decides if show OTF or main screen
    //if user exists, call checlIfNewUser and deleteOtps function
    if (user) {
      checkIfNewUser();
    }
  }, []);

  const [checkIfNewUser, { loading }] = useLazyQuery(CHECK_FOR_NEWUSER, {
    onCompleted: (data) => {
      if (data.checkIfNewUser) {
        //NEW USER DETECTED
        setIsNewUser(true);
      } else {
        //OLD USER DETECTED
        setIsNewUser(false);
      }
    },
    variables: {
      email,
    },
    fetchPolicy: "network-only",
  });

  return (
    <div ref={ref}>
      <div>
        {width > 800 ? (
          <Navbar setOpen={setOpen} />
        ) : (
          <MobileNavbar setOpen={setOpen} />
        )}
      </div>
    </div>
  );
}

const CHECK_FOR_NEWUSER = gql`
  query checkIfNewUser($email: String!) {
    checkIfNewUser(email: $email)
  }
`;

export default Home;
