import React, { useState, useEffect } from "react";
import { Container } from "./Container";
import { Formik, Form, Field } from "formik";
import { ButtonIcon } from "./Buttons";
import { IconSave } from "./fontawesome-icons";
import { useAuth0 } from "../lib/auth/react-auth0-wrapper";
// import { apiRequest, useApi } from "../contexts/postgres-api";

export const HelpDesk: React.FC<{ hdData?: any; hdText?: string }> = ({
  hdData,
  hdText,
}) => {
  const { loading, user, isAuthenticated, getTokenSilently } = useAuth0();
  const [token, setToken] = useState<string>();
  useEffect(() => {
    async function getToken() {
      try {
        const t = await getTokenSilently();
        setToken(t);
        // console.log('got token', t);
      } catch (error) {
        console.error(error);
      }
    }
    getToken();
  }, [getTokenSilently, setToken]);

  const postData: (opts: {
    token: string;
    data: string;
    email: string;
    name: string;
    text: string;
  }) => Promise<void> = async ({ token, data, email, name, text }) => {
    try {
      console.log(data, email, name, text);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Container>
        <Formik
          initialValues={{
            data: hdData ? JSON.stringify(hdData, null, 2) : "",
            text: hdText ? hdText : "",
            email: user.email,
            name: user.nickname,
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            if (!token) return;
            const opts = {
              token,
              data: values.data,
              email: values.email,
              name: values.name,
              text: values.text,
            };
            postData(opts).catch((err) => {
              throw err;
            });
          }}
        >
          <Form>
            <Field name="email">
              {({ field }) => (
                <div className="field">
                  <label htmlFor="email">E-Mail</label>
                  <div className="control">
                    <input
                      type="email"
                      className="input"
                      placeholder="E-Mail"
                      {...field}
                    />
                  </div>
                </div>
              )}
            </Field>

            <Field name="name">
              {({ field }) => (
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      placeholder="Ihr Name"
                      {...field}
                    />
                  </div>
                </div>
              )}
            </Field>
            <Field name="text">
              {({ field }) => (
                <div className="field">
                  <label htmlFor="text">Text</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Freier Text"
                      {...field}
                    ></textarea>
                  </div>
                </div>
              )}
            </Field>
            <Field name="data">
              {({ field }) => (
                <div className="field">
                  <label htmlFor="text">Daten</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Freier Text"
                      {...field}
                    ></textarea>
                  </div>
                </div>
              )}
            </Field>
            {/* <Field type="input" name="name" placeholder="Name" /> */}
            <div className="buttons">
              <ButtonIcon
                additionalClassNames="is-primary"
                type="submit"
                text="Sende"
              >
                <IconSave></IconSave>
              </ButtonIcon>
            </div>
          </Form>
        </Formik>
      </Container>
    </>
  );
};
