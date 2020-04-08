import React, { useState, useEffect } from "react";
import { Container } from "./Container";
import { Formik, Form, Field } from "formik";
import { ButtonIcon } from "./Buttons";
import { IconSave } from "./fontawesome-icons";
import { useAuth0 } from "../lib/auth/react-auth0-wrapper";
import { useHelpDesk } from "../contexts/helpdesk";
import * as Yup from "yup";
import { MessageProvider, useMessages } from "../contexts/messages";
import history from "../lib/history";

interface InitialValues {
  data?: string;
  text?: string;
  email?: string;
  name?: string;
  spotId?: number;
  spotName?: string;
  userId?: number;
}
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Bitte geben Sie eine valide E-Mail Adresse an.")
    .required("Email ist ein Pflichtfeld."),
  text: Yup.string()
    .min(15, "Bitte schreiben Sie mehr als 15 Zeichen")
    .max(1000, "Bitte nicht mehr als 1000 Zeichen")
    .required("Text ist ein Pflichtfeld."),
  name: Yup.string()
    .min(3, "Ist Ihr Name nicht länger als drei Zeichen?")
    .max(1000, "Bitte nicht mehr als 1000 Zeichen")

    .required("Name ist ein Pflichtfeld."),
});

export const HelpDesk: React.FC<{ hdData?: any; hdText?: string }> = ({
  hdData,
  hdText,
}) => {
  const [, messageDispatch] = useMessages();
  const { user, isAuthenticated, getTokenSilently } = useAuth0();
  const [helpDeskState] = useHelpDesk();
  const [token, setToken] = useState<string>();

  const [initialValues, setInitialValues] = useState<InitialValues>({
    text: hdText,
    email: "",
  });

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

  // useEffect(() => {
  //   if (!helpDeskState.spot) return;
  // });
  useEffect(() => {
    setInitialValues({
      data: hdData ? JSON.stringify(hdData, null, 2) : "",
      text: hdText ? hdText : "",
      email: user.email,
      name: `${user.pgapiData.firstName} ${user.pgapiData.lastName}`,
      spotId: helpDeskState.spot ? helpDeskState.spot.id : undefined,
      spotName: helpDeskState.spot ? helpDeskState.spot.name : "",
      userId: user.pgapiData.id,
    });
  }, [user.email, user.pgapiData, hdText, hdData, helpDeskState.spot]);
  const postData: (opts: {
    token: string;
    email: string;
    name: string;
    text: string;
    data?: string;
    spotId?: number;
    spotName?: string;
    userId?: number;
    callBack: (success?: boolean) => void;
  }) => Promise<void> = async ({
    token,
    data,
    email,
    name,
    text,
    callBack,
    spotId,
    spotName,
    userId,
  }) => {
    try {
      // eslint-disable-next-line no-console

      // console.log(data, email, name, text);
      const url = "/helpdesk/v1/messages";
      const config: RequestInit = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          name,
          text,
          data,
          spotId,
          userId,
          spotName,
        }),
      };
      const response = await fetch(url, config);
      if (response.ok === true) {
        // const json = await response.json();
        callBack(true);
        messageDispatch({
          type: "ADD_MESSAGE",
          payload: {
            type: "normal",
            message:
              "Ihre E-Mail wurde versand. Ich schicke Sie in 5 Sekunden zurück zur Startseite.",
          },
        });
        setInitialValues({});
        setTimeout(() => {
          history.push("");
        }, 5000);
      } else {
        callBack();
        messageDispatch({
          type: "ADD_MESSAGE",
          payload: {
            type: "warning",
            message: `Beim senden der Nachricht ist ein Fehler aufgetreten. ${response.text}`,
          },
        });
        console.error("repsonse not ok", response);
      }
    } catch (error) {
      callBack();
      console.error(error);
    }
  };
  return (
    <>
      <MessageProvider>
        <Container>
          {isAuthenticated && user ? (
            <Formik
              enableReinitialize={true}
              validationSchema={schema}
              initialValues={initialValues}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                if (!token) return;
                const opts = {
                  token,
                  data: values.data,
                  email: values.email ? values.email : "",
                  name: values.name ? values.name : "",
                  text: values.text ? values.text : "",
                  spotId: values.spotId,
                  spotName: values.spotName,
                  userId: values.userId,
                  callBack: (success?: boolean) => {
                    setSubmitting(false);
                    if (success) {
                      resetForm();
                    }
                  },
                };
                postData(opts).catch((err) => {
                  throw err;
                });
              }}
            >
              {({ isValid, isSubmitting }) => (
                <Form>
                  <Field name="email">
                    {({ field, meta }) => (
                      <div className="field">
                        <label htmlFor="email">E-Mail *</label>
                        <div className="control">
                          <input
                            type="email"
                            className={`input ${
                              meta.touched && meta.error ? "is-danger" : ""
                            }`}
                            placeholder="E-Mail"
                            {...field}
                          />
                          {meta.touched && meta.error && (
                            <div className="helpdesk__field--error">
                              {meta.error}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Field>

                  <Field name="name">
                    {({ field, meta }) => (
                      <div className="field">
                        <label htmlFor="name">Ihr Name *</label>
                        <div className="control">
                          <input
                            type="text"
                            className={`input ${
                              meta.touched && meta.error ? "is-danger" : ""
                            }`}
                            placeholder="Ihr Name"
                            {...field}
                          />
                          {meta.touched && meta.error && (
                            <div className="helpdesk__field--error">
                              {meta.error}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Field>
                  <Field name="userId">
                    {({ field }) => (
                      <div className="field">
                        <label htmlFor="userId">Ihre Benutzer ID</label>
                        <div className="control">
                          <input
                            type="number"
                            className="input"
                            placeholder="Ihre UserID"
                            {...field}
                          />
                        </div>
                      </div>
                    )}
                  </Field>
                  <Field name="spotName">
                    {({ field }) => (
                      <div className="field">
                        <label htmlFor="spotName">Name der Badestelle</label>
                        <div className="control">
                          <input
                            type="text"
                            className="input"
                            placeholder="Name der Badestelle"
                            {...field}
                          />
                        </div>
                      </div>
                    )}
                  </Field>
                  <Field name="spotId">
                    {({ field }) => (
                      <div className="field">
                        <label htmlFor="spotId">ID der Badestelle</label>
                        <div className="control">
                          <input
                            type="number"
                            className="input"
                            placeholder="Badestellen ID"
                            {...field}
                          />
                        </div>
                      </div>
                    )}
                  </Field>
                  <Field name="text">
                    {({ field, meta }) => (
                      <div className="field">
                        <label htmlFor="text">Freier Text *</label>
                        <div className="control">
                          <textarea
                            className={`textarea ${
                              meta.touched && meta.error ? "is-danger" : ""
                            }`}
                            placeholder="Freier Text"
                            {...field}
                          ></textarea>
                          {meta.touched && meta.error && (
                            <div className="helpdesk__field--error">
                              {meta.error}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Field>
                  <Field name="data">
                    {({ field }) => (
                      <div className="field">
                        <label htmlFor="text">Systemgenerierte Daten</label>
                        <div className="control">
                          <textarea
                            className="textarea"
                            placeholder="System Daten"
                            {...field}
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </Field>
                  {/* <Field type="input" name="name" placeholder="Name" /> */}
                  <div className="buttons">
                    <ButtonIcon
                      additionalClassNames={`${
                        isValid ? "is-primary" : "is-outlined"
                      } ${isSubmitting ? "is-loading" : ""}`}
                      type="submit"
                      text="Senden"
                      isDisabled={!isValid}
                    >
                      <IconSave></IconSave>
                    </ButtonIcon>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <>
              <div className="content">
                <p>Sie sind nicht authentifiziert.</p>
              </div>
            </>
          )}
        </Container>
      </MessageProvider>
    </>
  );
};
