import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer, Font } from '@react-pdf/renderer';
import styled from '@react-pdf/styled-components';
import { IAnswer } from '../../lib/common/interfaces';
import { Container } from '../Container';
import { RouteComponentProps } from 'react-router';
const fontBold = require('../../assets/fonts/open-sans-v16-latin-600.ttf');
const font = require('../../assets/fonts/open-sans-v16-latin-300.ttf');
const fontItalic = require('../../assets/fonts/open-sans-v16-latin-300italic.ttf');

// Supported components for styled
//     Document
//     Page
//     View
//     Image
//     Text
//     Link

const Document = styled.Document`
  font-family: 'Open Sans';
`;
const Page = styled.Page`
  flex-direction: 'row';
  // background-color: red;
`;

Font.register({
  family: 'Open Sans Bold',
  src: fontBold,
  format: 'truetype',
});
Font.register({
  family: 'Open Sans',
  src: font,
  format: 'truetype',
});
Font.register({
  family: 'Open Sans Italic',
  src: fontItalic,
  format: 'truetype',
});
const View = styled.View`
  margin: 5vw;
  padding: 5vh;
  flex-grow: 1;
`;

const Title = styled.Text`
  text-align: center;
  font-size: 24pt;
  font-weight: 600;
  font-family: 'Open Sans Bold';
  padding-bottom: 15pt;
`;
const SubTitle = styled.Text`
  text-align: center;
  font-size: 16pt;
  font-weight: 300;
  font-family: 'Open Sans Italic';
  padding-bottom: 15pt;
`;

const QuestionText = styled.Text`
  border-top: 1px dashed gray;
  text-align: left;
  font-size: 12pt;
  font-weight: 600;
  font-family: 'Open Sans Bold';
  padding-bottom: 15pt;
`;

const AnswerText = styled.Text`
  font-size: 12pt;
  padding-bottom: 13pt;
`;

const TextItalic = styled.Text`
  font-size: 12pt;
  font-family: 'Open Sans Italic';
  padding-bottom: 13pt;
`;

interface IPDFReportProps {
  questions: string[];
  answers: IAnswer[];
  addInfoQuestion: string[];
  title: string;
  probability: string;
  allAnswersGiven: boolean;
}

interface IPDFReportRendererProps extends IPDFReportProps {
  children?: React.ReactNode;
}
const ReportPDF: React.FC<IPDFReportProps> = ({
  questions,
  answers,
  addInfoQuestion,
  title,
  probability,
  allAnswersGiven,
}) => {
  return (
    <Document>
      <Page size='A4'>
        <View>
          <Title>{title}</Title>
          <SubTitle>{probability}</SubTitle>
          {allAnswersGiven === true && (
            <SubTitle>Achtung! Es wurden nicht all Fragen beantwortet</SubTitle>
          )}
          {questions !== undefined &&
            questions.length > 0 &&
            questions.map((ele, i) => (
              <React.Fragment key={i}>
                <QuestionText>
                  {i + 1}
                  {'.'}
                  {ele}
                </QuestionText>
                {addInfoQuestion[i] !== null ||
                  (addInfoQuestion[i] !== undefined && (
                    <TextItalic>addInfoQuestion[i]</TextItalic>
                  ))}

                {(() => {
                  let res: JSX.Element = (
                    <AnswerText key={`${i}not`}>
                      Noch nicht beantwortet
                    </AnswerText>
                  );
                  for (const answer of answers) {
                    const split = answer.id.split('-');
                    const aid = parseInt(split[0], 10);
                    if (i + 1 === aid) {
                      res = (
                        <React.Fragment key={`${i}yes`}>
                          <AnswerText key={answer.id}>{answer.text}</AnswerText>
                          <TextItalic>{answer.additionalText}</TextItalic>
                        </React.Fragment>
                      );
                    }
                  }
                  return res;
                })()}
                {/* {answers.map((answer) => {
                  const split = answer.id.split('-');
                  const aid = parseInt(split[0], 10);
                  if (i + 1 === aid) {
                    return <AnswerText>{answer.text}</AnswerText>;
                  }
                })} */}
              </React.Fragment>
            ))}
        </View>
      </Page>
    </Document>
  );
};

export const PDFPage: React.FC<RouteComponentProps> = (props) => {
  return (
    <Container
      containerClassName={'container__pdf--fullpage'}
      columnClassName={'pdfviewer__parent'}
    >
      <PDFRendererViewer {...props.location.state}></PDFRendererViewer>
    </Container>
  );
};
export const PDFRendererViewer: React.FC<IPDFReportRendererProps> = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setOpen(true);
    return () => setOpen(false);
  }, []);

  return (
    <>
      {open && (
        <PDFViewer
          width='100%'
          className={'pdfviewer'}
          style={{
            height: '100%',
          }}
        >
          <ReportPDF {...props}></ReportPDF>
        </PDFViewer>
      )}
    </>
  );
};

export const PDFRendererDLLink: React.FC<IPDFReportRendererProps> = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setOpen(true);
    return () => setOpen(false);
  }, []);

  return (
    <>
      {open && (
        <PDFDownloadLink
          document={<ReportPDF {...props} />}
          fileName={`report-${new Date()
            .toISOString()
            .replace(/:|\./g, '-')}.pdf`}
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download now!'
          }
        </PDFDownloadLink>
        // <PDFViewer width={600} height={450}>
        //   <Document>
        //     <Page size='A4'>
        //       <View style={styles.section}>
        //         <Text>Hello World</Text>
        //       </View>
        //     </Page>
        //   </Document>
        // </PDFViewer>
      )}
    </>
  );
};
