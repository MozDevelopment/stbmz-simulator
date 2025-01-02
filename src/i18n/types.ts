// src/i18n/types.ts
import { routing } from "./routing";

export type ValidLocale = (typeof routing.locales)[number];
