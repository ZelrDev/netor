export default interface DiscordEmbed {
  title: string | undefined;
  description: string | undefined;
  url: string | undefined;
  color: number | undefined;
  footer:
    | {
        text: string | undefined;
        icon_url: string | undefined;
      }
    | undefined;
  image:
    | {
        url: string;
      }
    | undefined;
  thumbnail: {
    url: string | undefined;
  };
  fields:
    | {
        name: string;
        value: string;
        inline: boolean;
      }[]
    | undefined;
  author?:
    | {
        name: string;
        url: string | undefined;
        icon_url: string | undefined;
      }
    | undefined;
}
