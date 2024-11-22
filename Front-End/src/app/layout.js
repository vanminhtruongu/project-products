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
          position="top-right" // Vị trí của toast
          autoClose={5000}     // Tự động đóng sau 5 giây
          hideProgressBar={false} // Hiển thị thanh tiến trình
          newestOnTop={false} // Toast mới xuất hiện ở trên cùng
          closeOnClick        // Đóng toast khi click
          rtl={false}         // Chế độ từ phải sang trái
          pauseOnFocusLoss    // Tạm dừng khi tab bị mất focus
          draggable           // Có thể keo toast
          pauseOnHover        // Tạm dừng khi hover vào
          theme="light"       // Chủ đề: light hoặc dark
        />
      </body>
    </html>
  )
}