import Image from 'next/image';

interface AppIconProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export default function AppIcon({ icon, label, onClick }: AppIconProps) {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 bg-black/70 hover:bg-black/50 rounded-xl flex items-center justify-center transition-all"
    >
      <Image src={icon} alt={label} width={40} height={40} />
    </button>
  );
}
