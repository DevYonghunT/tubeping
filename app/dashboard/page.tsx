"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Channel {
  id: string;
  channelUrl: string;
  channelId: string;
  channelName: string | null;
  email: string;
  lastCheckedAt: string;
  isActive: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    channelUrl: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchChannels();
    }
  }, [session]);

  const fetchChannels = async () => {
    try {
      const response = await fetch("/api/channels");
      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels || []);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "채널 등록에 실패했습니다.");
        return;
      }

      // 성공 시 폼 초기화 및 목록 새로고침
      setFormData({ channelUrl: "", email: "" });
      setShowForm(false);
      fetchChannels();
    } catch (error) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (channelId: string) => {
    if (!confirm("정말 이 채널을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/channels/${channelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchChannels();
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
      alert("채널 삭제에 실패했습니다.");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            🎬 Tubeping
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {session.user?.email}
            </span>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              로그아웃
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              대시보드
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              모니터링할 유튜브 채널을 등록하세요
            </p>
          </div>

          {/* Add Channel Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
            >
              + 새 채널 추가
            </button>
          )}

          {/* Add Channel Form */}
          {showForm && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                새 채널 등록
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="channelUrl"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    유튜브 채널 URL
                  </label>
                  <input
                    id="channelUrl"
                    type="url"
                    value={formData.channelUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, channelUrl: e.target.value })
                    }
                    required
                    placeholder="https://www.youtube.com/@channelname"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    알림 수신 이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "등록 중..." : "등록하기"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setError("");
                      setFormData({ channelUrl: "", email: "" });
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Channels List */}
          <div className="space-y-4">
            {channels.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                <div className="text-5xl mb-4">📺</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  등록된 채널이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  위의 "새 채널 추가" 버튼을 클릭하여 채널을 등록하세요
                </p>
              </div>
            ) : (
              channels.map((channel) => (
                <div
                  key={channel.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {channel.channelName || "알 수 없는 채널"}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          <span className="font-medium">채널:</span>{" "}
                          <a
                            href={channel.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {channel.channelUrl}
                          </a>
                        </p>
                        <p>
                          <span className="font-medium">알림 이메일:</span>{" "}
                          {channel.email}
                        </p>
                        <p>
                          <span className="font-medium">마지막 확인:</span>{" "}
                          {new Date(channel.lastCheckedAt).toLocaleString("ko-KR")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(channel.id)}
                      className="ml-4 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

