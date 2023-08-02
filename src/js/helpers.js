import { TIMEOUT_SEC } from './config.js';

const timeout = async function (seconds) {
  return new Promise((_, reject) => {
    setTimeout(function () {
      reject(
        new Error(`Request took too long. Timout after ${seconds} seconds`),
      );
    }, seconds * 1000);
  });
};

export const getJSON = async function (url, uploadData = undefined) {
  try {
    const fetchPro = fetch(
      url,
      uploadData
        ? {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
          }
        : undefined,
    );

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }
    return data;
  } catch (e) {
    throw e;
  }
};
