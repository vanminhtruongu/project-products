'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Chào mừng đến với</span>
              <span className="block text-indigo-600">Thế Giới Mua Sắm Online</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Khám phá hàng nghìn sản phẩm chất lượng với giá cả cạnh tranh nhất thị trường
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất cho bạn
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Giao hàng nhanh chóng</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Cam kết giao hàng trong vòng 24h đối với nội thành và 72h đối với các tỉnh thành khác
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Giá cả cạnh tranh</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Chúng tôi cam kết mang đến mức giá tốt nhất cho khách hàng với chính sách đối chiếu giá thị trường
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Chất lượng đảm bảo</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Tất cả sản phẩm đều được kiểm định chất lượng nghiêm ngặt trước khi đến tay khách hàng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Về Chúng Tôi
            </h2>
          </div>
          <div className="prose prose-lg mx-auto text-gray-500">
            <p>
              Được thành lập từ năm 2023, chúng tôi tự hào là một trong những đơn vị tiên phong trong lĩnh vực thương mại điện tử tại Việt Nam. 
              Với sứ mệnh mang đến trải nghiệm mua sắm trực tuyến tuyệt vời nhất cho người tiêu dùng Việt Nam, chúng tôi không ngừng đổi mới 
              và phát triển để đáp ứng nhu cầu ngày càng cao của khách hàng.
            </p>
            <p>
              Chúng tôi cung cấp đa dạng các mặt hàng từ thời trang, điện tử, gia dụng đến mỹ phẩm, thực phẩm và nhiều hơn nữa. 
              Tất cả sản phẩm đều được tuyển chọn kỹ lưỡng từ các nhà cung cấp uy tín trong và ngoài nước, đảm bảo chất lượng và 
              giá cả hợp lý cho người tiêu dùng.
            </p>
            <p>
              Với đội ngũ nhân viên chuyên nghiệp, nhiệt tình và giàu kinh nghiệm, chúng tôi cam kết mang đến dịch vụ chăm sóc 
              khách hàng tốt nhất. Mọi thắc mắc và yêu cầu của khách hàng đều được xử lý nhanh chóng và hiệu quả thông qua 
              các kênh hỗ trợ đa dạng như hotline, email, chat trực tuyến.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Dịch Vụ Của Chúng Tôi
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mua sắm trực tuyến 24/7</h3>
              <p className="text-gray-500">
                Mua sắm mọi lúc, mọi nơi với giao diện thân thiện và dễ sử dụng. Thanh toán an toàn với nhiều phương thức đa dạng.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dịch vụ khách hàng</h3>
              <p className="text-gray-500">
                Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7 qua điện thoại, email và chat trực tuyến.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chính sách đổi trả</h3>
              <p className="text-gray-500">
                Đổi trả miễn phí trong vòng 30 ngày với các sản phẩm không vừa ý hoặc có lỗi từ nhà sản xuất.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Sẵn sàng để mua sắm?</span>
            <span className="block text-indigo-200">Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                Đăng ký ngay
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/products" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600">
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
