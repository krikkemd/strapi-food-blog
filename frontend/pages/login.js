import { useContext, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';
import { LOGIN } from '../graphql/users';
import { setAccessTokenInMemory } from '../util/accessToken';

export default function Login() {
  // Local state
  const initialState = {
    username: '',
    password: '',
  };
  const [values, setValues] = useState(initialState);

  // Context
  const { contextLogin } = useContext(AuthContext);

  const [loginUser] = useMutation(LOGIN, {
    update(_, res) {
      // console.log(res);
    },
    onCompleted(data) {
      setValues(initialState);
      // setAccessTokenInMemory(data.login.jwt);
      console.log(data);
      contextLogin(data.login.user);
    },
    onError(error) {
      console.log(error);
      console.log(error.graphQLErrors);
    },
    variables: {
      loginInput: {
        identifier: values.username,
        password: values.password,
      },
    },
  });

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(values);
    loginUser({ values });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for='username'>Username</Label>
        <Input type='text' name='username' value={values.username} onChange={handleChange} />
      </FormGroup>

      <FormGroup>
        <Label for='password'>Password</Label>
        <Input type='password' name='password' value={values.password} onChange={handleChange} />
      </FormGroup>
      <Button color='primary'>Submit</Button>
    </Form>
  );
}
