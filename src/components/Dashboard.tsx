import { Repository } from '../types';
import { Lock, Users, FileText, Clock } from 'lucide-react';

interface DashboardProps {
  repositories: Repository[];
  onSelectRepo: (repo: Repository) => void;
  searchTerm: string;
}

export function Dashboard({ repositories, onSelectRepo, searchTerm }: DashboardProps) {
  const filteredRepos = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-white mb-2">Tus Repositorios</h2>
        <p className="text-gray-300">Administra y colabora en tus proyectos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRepos.map((repo) => (
          <button
            key={repo.id}
            onClick={() => onSelectRepo(repo)}
            className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/10 transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-300" />
                <h3 className="text-white group-hover:text-purple-300 transition-colors">
                  {repo.name}
                </h3>
              </div>
              {repo.isPrivate && (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <p className="text-gray-300 mb-4 line-clamp-2">{repo.description}</p>

            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{repo.collaborators.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{repo.files.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(repo.updatedAt).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredRepos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-gray-300 mb-2">No se encontraron repositorios</h3>
          <p className="text-gray-400">
            {searchTerm
              ? 'Intenta con otro término de búsqueda'
              : 'Crea tu primer repositorio para comenzar'}
          </p>
        </div>
      )}
    </div>
  );
}
