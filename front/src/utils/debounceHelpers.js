import axios from "axios";
import debounce from "lodash.debounce";

export const checkEmailExists = debounce(async (email, resolve, reject) => {
  try {
    const { data } = await axios.get("check-email-exists", {
      params: { email },
    });

    // API returns the user document when found, otherwise `null`.
    if (data) {
      reject("Email is already in use");
    } else {
      resolve();
    }
  } catch (error) {
    // Never leave form validation hanging on request failure.
    resolve();
  }
}, 500);

export const checkUsernameExists = debounce(
  async (username, resolve, reject) => {
    try {
      const { data } = await axios.get("check-username-exists", {
        params: { username },
      });

      //console.log("Username exists check data:", data);
      // API returns the user document when found, otherwise `null`.
      if (data) {
        reject("Username is already in use");
      } else {
        resolve();
      }
    } catch (error) {
      // Never leave form validation hanging on request failure.
      resolve();
    }
  },
  500,
);
