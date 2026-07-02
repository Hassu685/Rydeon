import "./globals.css";


export const metadata = {
  title: {
    default: "Rydeon",
    template: "%s | Rydeon",
  },
  description: "A modern website built with Next.js",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
