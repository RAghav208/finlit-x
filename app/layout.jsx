import './globals.css'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'

export const metadata = {
  title: 'FinLit-X — AI-Driven Financial Literacy for Indian Students',
  description: 'FinLit-X bridges the financial knowledge gap through an interdisciplinary approach combining Machine Learning, Economics, Animation, and Computer Science.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
