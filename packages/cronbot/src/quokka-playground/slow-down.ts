/* eslint-disable no-console */
import got from "got";

//here we make our timeout synchronous using Promises
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    console.log("sleep");
    return setTimeout(resolve, ms);
  });
}

async function main() {
  const urls = [
    { url: "https://jsonplaceholder.typicode.com/todos/1" },
    { url: "https://jsonplaceholder.typicode.com/todos/2" },
    { url: "https://jsonplaceholder.typicode.com/todos/3" },
    { url: "https://jsonplaceholder.typicode.com/todos/4" },
    { url: "https://jsonplaceholder.typicode.com/todos/5" },
  ];

  for (const item of urls) {
    const p = got(item.url);
    const values = await Promise.all([p, sleep(5000)]);
    const { body } = values[0];
    console.log(body);
  }
}

main().catch(console.error);
