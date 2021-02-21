import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";
import enUsTrans from "../locales/en-us.json";
import zhCnTrans from "../locales/zh-cn.json";
import {
  initReactI18next
} from 'react-i18next';

i18n
.use(LanguageDetector) //Detect browser‘s language
.use(initReactI18next) //init i18next
.init({
  //import resource file
  resources: {
    en: {
      translation: enUsTrans,
    },
    zh: {
      translation: zhCnTrans,
    },
  },
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false, 
  },
})

export default i18n;