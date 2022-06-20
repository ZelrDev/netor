import he from "he";

export const cleanUpMessage = (message: string, tags: any) => {
  tags.forEach((item: { value: any }, idx: any) => {
    message = message
      .replaceAll(`<span class="mention" data-index="${idx}" `, "")
      .replaceAll(
        `data-value="${item.value}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">^`,
        ""
      );

    // var
    message = message.replaceAll(
      `</span>${item.value}</span>﻿</span>`,
      `^${item.value}`
    );
  });
  message = message
    .replaceAll(`data-denotation-char="^" `, "")
    .replaceAll(`data-id="" `, "")
    .replaceAll("<p>", "")
    .replaceAll("</p>", "");
  return he.decode(message);
};
