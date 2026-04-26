import "./globals.scss";

export const metadata = {
  title: "Earth-Y | Coastal Risk Assessment",
  description: "Physics-Informed Neural Network for Coastal Erosion Prediction",
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