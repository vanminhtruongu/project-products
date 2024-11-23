import './globals.css'
import Navigation from './components/Navigation'
import { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: 'My App',
  description: 'Created with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
            <Navigation />
          </header>
          <main className="flex-grow mt-[64px]">
            {children}
          </main>
          <Toaster position="top-right" />
        </div>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          limit={8}
          toastClassName="!bg-gradient-to-br !from-purple-500 !via-pink-500 !to-red-500 !text-white !backdrop-blur-lg !rounded-xl !shadow-2xl"
          progressClassName="!bg-gradient-to-r !from-purple-400 !via-pink-400 !to-red-400"
          closeButton={false}
        />
      </body>
    </html>
  )
}