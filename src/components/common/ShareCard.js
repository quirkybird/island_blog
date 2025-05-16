import formatDate from "../../utils/formatDate";

const ShareCard = ({ blog, onClose }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("链接已复制到剪贴板！");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">分享文章</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {/* 分享预览卡片 */}
        <div className="border p-4 rounded-lg mb-4">
          {/* 添加封面图片 */}
          {blog.cover && (
            <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
              <img
                src={blog.cover}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/default-cover.jpg"; // 设置默认封面
                }}
              />
            </div>
          )}
          <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
          <div className="text-sm text-gray-600">
            <p>发布于：{formatDate(blog.create_at)}</p>
            <p>字数：{blog.content.length}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={copyLink}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            复制链接
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
