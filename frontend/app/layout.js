import Providers from "./Providers";

import Layout from "./components/Layout";

export const metadata = {
  title: "Voting | MEDXBEN",
  description: "Projet 3 pour Alyra formation dev BC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
