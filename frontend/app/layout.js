import Providers from "./Providers";

// TODO Choisir notre font
// import { Inter } from "next/font/google";

import Layout from "./components/Layout";

// TODO Choisir notre font
// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Projet 3 Alyra | MEDXBEN",
  description: "Projet 3 pour Alyra formation dev BC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
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
