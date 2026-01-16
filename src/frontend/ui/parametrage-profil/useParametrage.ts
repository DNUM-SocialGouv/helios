import { useRouter } from "next/router";
import { useContext } from "react";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfileContext } from "../commun/contexts/ProfilContext";
import { useDependencies } from "../commun/contexts/useDependencies";

enum ErrorKind {
  OK,
  EMPTY_LABEL,
  LABEL_ALREADY_EXISTS,
  UNKNOWN_ERROR,
}

export function useParametrage() {
  const profileContext = useContext(ProfileContext);
  const router = useRouter();
  const { paths } = useDependencies();

  const updateProfile = (userId: string, code: string, value: ProfileValue, name: string) => {
    fetch("/api/profile/update", {
      body: JSON.stringify({ userId, code, value, name }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then((response) => {
      if (response.status === 200)
        router.push(paths.PROFILES_LIST)
    })
  }

  const saveProfile = async (userId: string, label: string, profile: ProfileValue) => {
    let statusCode = 0;
    return fetch("/api/profile/add", {
      body: JSON.stringify({ userId, label, value: profile }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then((response) => {
      statusCode = response.status;
      return response.text();
    }).then((message) => {
      if (statusCode === 200) {
        router.push(paths.PROFILES_LIST)
        return ErrorKind.OK;
      } else if (statusCode === 400) {
        if (message === "Bad request: label is required") {
          return ErrorKind.EMPTY_LABEL;
        } else if (message === "Bad request: label already exists") {
          return ErrorKind.LABEL_ALREADY_EXISTS;
        } else { return ErrorKind.UNKNOWN_ERROR; }
      } else {
        return ErrorKind.UNKNOWN_ERROR;
      }
    })
  };

  const getAllProfiles = (userId: string) => {
    const params = { userId: userId };
    fetch("/api/profile/get/?" + new URLSearchParams(params).toString(), {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        profileContext?.setProfiles(data.response);
      });
  };

  return {
    getAllProfiles,
    saveProfile,
    updateProfile,
    ErrorKind
  };
}
