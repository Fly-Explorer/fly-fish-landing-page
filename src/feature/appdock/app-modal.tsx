interface AppModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
  }
  
  export default function AppModal({ title, children, onClose }: AppModalProps) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div>{children}</div>
        </div>
      </div>
    );
  }
  