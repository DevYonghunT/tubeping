import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            🎬 Tubeping
          </div>
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            로그인
          </Link>
        </header>

        {/* Hero Section */}
        <main className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            유튜브 채널을
            <br />
            <span className="text-blue-600 dark:text-blue-400">스마트하게</span> 모니터링
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            관심 있는 유튜브 채널의 새 영상을 자동으로 감지하고,
            <br />
            AI가 요약한 내용을 이메일로 받아보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
            >
              시작하기
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors font-semibold text-lg"
            >
              더 알아보기
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                자동 모니터링
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                매일 아침 7시에 자동으로 채널을 확인합니다
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                AI 요약
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                새 영상의 내용을 AI가 간결하게 요약해드립니다
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                이메일 알림
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                새 영상이 올라오면 바로 이메일로 알려드립니다
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

