import { redirect, LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request, params }) => {
  return redirect(
    "/" + params.guild! + "/users/" + params.member + "/overview"
  );
};

export default function Index() {
  return <></>;
}
