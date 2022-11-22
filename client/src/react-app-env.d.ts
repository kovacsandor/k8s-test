/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_ORIGIN: string;
    readonly REACT_APP_WEBSITE_NAME: string;
  }
}
