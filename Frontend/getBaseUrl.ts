import Constants from "expo-constants";

const {expoConfig} = Constants

export const baseUrl = `http://${expoConfig?.hostUri?.split(":").shift()}:8080`;