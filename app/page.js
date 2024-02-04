"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, API } from "aws-amplify";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import { get } from "aws-amplify/api";

Amplify.configure({
  // aws_project_region: "ap-southeast-1",
  // aws_cognito_region: "ap-southeast-1",
  // aws_user_pools_id: "ap-southeast-1_RHES4nRAv",
  // aws_user_pools_web_client_id: "5rqtpcdoju6scubq3449eqdfuv",
  // aws_manatory_sign_in: "enable",
  Auth: {
    Cognito: {
      userPoolClientId: "5rqtpcdoju6scubq3449eqdfuv",
      userPoolId: "ap-southeast-1_RHES4nRAv",
      loginWith: {
        // Optional
        username: "false",
        email: "true", // Optional
        phone: "false", // Optional
      },
    },
  },
  API: {
    REST: {
      ApiSls: {
        endpoint:
          "https://v0iagmjeu5.execute-api.ap-southeast-1.amazonaws.com/dev",
        region: "ap-southeast-1", // Optional
      },
    },
  },
});

export default function Home() {
  const getUser = async () => {
    try {
      const session = await fetchAuthSession(); // Fetch the authentication session
      const idToken = session.tokens.idToken.toString();
      // console.log("Access Token:", session.tokens.accessToken);
      // console.log("ID Token:", session.tokens.idToken);
      // console.log(session);
      const restOperation = get({
        apiName: "ApiSls",
        path: "/hello",
        options: {
          headers: {
            Authorization: idToken,
          },
        },
      });
      const { body } = await restOperation.response;
      const str = await body.json();
      console.log(str);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <h1>Hello</h1>
      <Authenticator
        loginMechanisms={["email"]}
        signUpAttributes={["name", "email"]}
      >
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user.userId}</h1>
            <button onClick={signOut}>Sign out</button>
            <button onClick={getUser}>get out</button>
          </main>
        )}
      </Authenticator>
    </div>
  );
}
