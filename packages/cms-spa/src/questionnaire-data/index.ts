// const filenames = [
//   'Frage-1.1.1.-gew2.json',
//   'Frage-2.1.1.-gew4.json',
//   'Frage-2.2.1.-gew4.json',
//   'Frage-2.3.1.-gew4.json',
//   'Frage-2.4.1.-gew4.json',
//   'Frage-3.1.1.-gew1.json',
//   'Frage-3.2.1.-gew0.json',
//   'Frage-3.2.2.-gew2.json',
//   'Frage-3.2.3.-gew4.json',
//   'Frage-3.3.1.-gew0.json',
//   'Frage-3.3.2.-gew3.json',
//   'Frage-3.3.3.-gew3.json',
//   'Frage-4.1.1.-gew3.json',
//   'Frage-4.2.1.-gew3.json',
//   'Frage-4.3.1.-gew3.json',
//   'Frage-4.4.1.-gew3.json',
//   'Frage-5.1.1.-gew3.json',
//   'Frage-6.1.1.-gew2.json',
//   'Frage-7.1.1.-gew4.json',
//   'Frage-8.1.1.-gew4.json',
//   'Frage-8.2.1.-gew4.json',
//   'Frage-8.3.1.-gew4.json',
//   'Frage-8.4.1.-gew4.json',
//   'Frage-9.1.1.-gew3.json',
//   'Frage-9.2.1.-gew3.json',
//   'Frage-10.1.1.-gew2.json',
//   'Frage-10.2.1.-gew2.json',
//   'Frage-10.3.1.-gew2.json',
// ];

const filenames = [
  "Frage-1.1.1.-gew2.json",
  "Frage-2.1.1.-gew4.json",
  "Frage-2.2.1.-gew4.json",
  "Frage-2.3.1.-gew4.json",
  "Frage-2.4.1.-gew4.json",
  "Frage-3.1.1.-gew1.json",
  "Frage-3.2.2.-gew2.json",
  "Frage-3.2.3.-gew4.json",
  "Frage-3.3.2.-gew3.json",
  "Frage-4.1.1.-gew3.json",
  "Frage-4.2.1.-gew3.json",
  "Frage-4.3.1.-gew3.json",
  "Frage-4.4.1.-gew3.json",
  "Frage-5.1.1.-gew3.json",
  "Frage-6.1.1.-gew2.json",
  "Frage-7.1.1.-gew4.json",
  "Frage-8.1.1.-gew4.json",
  "Frage-8.2.1.-gew4.json",
  "Frage-8.3.1.-gew4.json",
  "Frage-8.4.1.-gew4.json",
  "Frage-9.1.1.-gew3.json",
  "Frage-9.2.1.-gew3.json",
  "Frage-10.1.1.-gew2.json",
  "Frage-10.2.1.-gew2.json",
  "Frage-10.3.1.-gew2.json",
];

export const getQuestions = async () => {
  try {
    const data: any[] = [{}];
    for (const fn of filenames) {
      const file = await import(`./${fn}`).catch((err) => {
        console.error(err);
      });
      data.push(file);
    }
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};
