import type { Stream } from "stream";

export function streamToString(stream: Stream) {
  const chunks: Uint8Array[] | Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on(
      "data",
      (chunk: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) =>
        chunks.push(Buffer.from(chunk))
    );
    stream.on("error", (err: any) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}
