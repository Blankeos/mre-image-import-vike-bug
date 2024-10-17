import { type FlowProps } from "solid-js";
import { Head } from "vike-solid/Head";
import { usePageContext } from "vike-solid/usePageContext";

export default function RootLayout(props: FlowProps) {
  const pageContext = usePageContext();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Demo showcasing Vike" />
        <link rel="icon" href={`${pageContext.urlParsed.origin}/logo.svg`} />
      </Head>

      {props.children}
    </>
  );
}
