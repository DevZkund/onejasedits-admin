import Link from "next/link";
import { FolderKanban, Info, Star } from "lucide-react";
import Image from "next/image";
import logo from "./darkIcon.png";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col items-center p-6">
      {/* Logo and Title Inline */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src={logo}
          width={32}
          height={32}
          alt="Logo"
          className="invert" // makes dark image appear white
        />
        <h1 className="text-xl font-bold">Onejas Edits</h1>
      </div>

      <nav className="flex flex-col space-y-6 text-lg items-start w-full">
        <Link href="/" className="flex items-center gap-3 hover:text-yellow-400">
          <FolderKanban size={20} />
          <span>Services</span>
        </Link>
        <Link href="/About" className="flex items-center gap-3 hover:text-yellow-400">
          <Info size={20} />
          <span>Abouts</span>
        </Link>
        <Link href="/reviews" className="flex items-center gap-3 hover:text-yellow-400">
          <Star size={20} />
          <span>Reviews</span>
        </Link>
      </nav>
    </div>
  );
}
