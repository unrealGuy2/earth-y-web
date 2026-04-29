import "./globals.scss";

export const metadata = {
  title: "Earth-Y | AI Intelligence for Earth Risk Monitoring",
  description: "Earth-Y analyzes satellite and environmental data using artificial intelligence to detect land instability and environmental risks.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}