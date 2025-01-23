import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <main></main>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
