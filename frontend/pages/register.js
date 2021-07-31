import { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../graphql/users';

export default function register() {
  const initialState = {
    username: '',
    email: '',
    password: '',
  };
  const [values, setValues] = useState(initialState);

  const [registerUser] = useMutation(REGISTER, {
    onCompleted(data) {
      console.log(data);
      setValues(initialState);
    },
    onError(error) {
      console.log(error);
      console.log(error.graphQLErrors);
    },
    variables: {
      registerInput: {
        username: values.username,
        email: values.email,
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
    registerUser({ values });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for='username'>Username</Label>
        <Input type='text' name='username' value={values.username} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for='email'>Email</Label>
        <Input type='email' name='email' value={values.email} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for='password'>Password</Label>
        <Input type='password' name='password' value={values.password} onChange={handleChange} />
      </FormGroup>
      <Button color='primary'>Submit</Button>
    </Form>
  );
}
