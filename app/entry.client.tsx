import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);
hydrate(<RemixBrowser />, document);
