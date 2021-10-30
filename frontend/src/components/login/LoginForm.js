import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Link,
  Button,
  CircularProgress,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";

import { backend_url } from "../../Constants";

function ErrorMessage({ message }) {
  return (
    <Box my={4}>
      <Alert status="error" borderRadius={4}>
        <AlertIcon />
        <AlertDescription> {message}</AlertDescription>
      </Alert>
    </Box>
  );
}

async function doLogin(email, password) {
  if (email === "") {
    return { error: "Email is blank" };
  }
  if (password === "") {
    return { error: "Password is blank" };
  }

  const data = {
    email: email.toLower(),
    password: password,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify(data),
  };

  const r = await fetch(`${backend_url}auth/login`, options);
  if (r.status !== 200) {
    return { error: "Incorrect email or password" };
  }
  const ret = await r.json();
  return ret;
}

async function doRegister(name, email, zId, password, confirm) {
  if (name === "") {
    return { error: "Name is blank" };
  }
  if (email === "") {
    return { error: "Email is blank" };
  }
  if (zId === "") {
    return { error: "zID is blank" };
  }
  if (password === "") {
    return { error: "Password is blank" };
  }
  if (confirm !== password) {
    return { error: "Passwords do not match" };
  }

  // Check valid zID
  if (zId.length !== 8) {
    return { error: "Invalid zID" };
  }
  if (zId[0] !== "z") {
    return { error: "Invalid zID" };
  }
  if (zId.replace(/\d/g, "") !== "z") {
    return { error: "Invalid zID" };
  }

  const data = {
    name: name,
    email: email.toLower(),
    zid: zId,
    password: password,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify(data),
  };

  const r = await fetch(`${backend_url}auth/register`, options);
  if (r.status !== 200) {
    return { error: "Incorrect email or password" };
  }
  const ret = await r.json();
  return ret;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [zId, setZId] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [login, setLogin] = useState(true);

  const history = useHistory();

  return (
    <Flex width="Full" align="center" justifyContent="center" pt={16}>
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Box textAlign="center">
          <Heading> {login ? "Sign In" : "Sign Up"} </Heading>
        </Box>
        <Box my={4} textAlign="left">
          <form>
            {error && <ErrorMessage message={error} />}
            {!login && (
              <FormControl isRequired>
                <FormLabel> Name </FormLabel>
                <Input
                  type="text"
                  placeholder="John Smith"
                  size="lg"
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </FormControl>
            )}
            <FormControl isRequired>
              <FormLabel> Email </FormLabel>
              <Input
                type="email"
                placeholder="test@test.com"
                size="lg"
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </FormControl>
            {!login && (
              <FormControl isRequired>
                <FormLabel> zID </FormLabel>
                <Input
                  type="text"
                  placeholder="z1234567"
                  size="lg"
                  onChange={(e) => setZId(e.currentTarget.value)}
                />
              </FormControl>
            )}
            <FormControl isRequired mt={6}>
              <FormLabel> Password </FormLabel>
              <Input
                type="password"
                placeholder="********"
                size="lg"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </FormControl>
            {!login && (
              <FormControl isRequired mt={6}>
                <FormLabel> Confirm Password </FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  size="lg"
                  onChange={(e) => setConfirm(e.currentTarget.value)}
                />
              </FormControl>
            )}
            <br />
            <Link
              color="blue"
              as="i"
              onClick={() => {
                setLogin(!login);
              }}
            >
              {login
                ? "Don't have an account? Sign up!"
                : "Already have an account? Log In!"}
            </Link>
            <Button
              variant="outline"
              width="full"
              mt={4}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsLoading(true);
                if (login) {
                  doLogin(email, password).then((r) => {
                    
                    setIsLoading(false);
                    if (r.hasOwnProperty("error")) {
                      setError(r.error);
                    } else {
                      localStorage.setItem("token", r.token);
                      r.staff === true
                        ? localStorage.setItem("staff", 1)
                        : localStorage.setItem("staff", 0);
                      localStorage.setItem("id", r.id);
                      history.push("/");
                    }
                  });
                } else {
                  doRegister(name, email, zId, password, confirm).then((r) => {
                    
                    setIsLoading(false);
                    if (r.hasOwnProperty("error")) {
                      setError(r.error);
                    } else {
                      localStorage.setItem("token", r.token);
                      r.staff === true
                        ? localStorage.setItem("staff", 1)
                        : localStorage.setItem("staff", 0);
                      localStorage.setItem("id", r.id);
                      history.push("/");
                    }
                  });
                }
              }}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                `${login ? "Sign In" : "Sign Up"}`
              )}
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}
