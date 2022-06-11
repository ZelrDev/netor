import { json } from "@remix-run/server-runtime";

export function error(
  condition: any,
  message: any,
  code?: number,
  raw?: boolean
): asserts condition {
  if (!condition) {
    let title = "Unknown Error";
    if (code === 401) title = "Unauthorized Session";
    if (code === 400) title = "Missing parameters";
    if (code === 500) title = "Internal Server Error";
    throw json(
      {
        message,
        title,
        raw_error: false,
      },
      code
    );
  }
}
