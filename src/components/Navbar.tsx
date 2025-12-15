import { User } from '../types';
import { Search, Plus, User as UserIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onCreateRepo: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Navbar({
  user,
  onLogout,
  onCreateRepo,
  searchTerm,
  onSearchChange,
}: NavbarProps) {
  return (
    <nav
      className="border-b border-white/20 sticky top-0 z-50 backdrop-blur-sm"
      style={{ background: 'rgba(45, 27, 78, 0.9)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="24" r="20" fill="#8b5fd1" />
                <path
                  d="M24 12C24 12 28 16 28 20C28 24 24 28 24 28C24 28 20 24 20 20C20 16 24 12 24 12Z"
                  fill="white"
                />
                <path
                  d="M24 20C24 20 28 24 28 28C28 32 24 36 24 36C24 36 20 32 20 28C20 24 24 20 24 20Z"
                  fill="white"
                  opacity="0.7"
                />
              </svg>
              <span className="text-white">SANDWORM</span>
            </div>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar repositorios..."
                className="pl-10 pr-4 py-2 w-64 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCreateRepo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
              <UserIcon className="w-4 h-4 text-purple-300" />
              <span className="text-white hidden sm:inline">{user.username}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
