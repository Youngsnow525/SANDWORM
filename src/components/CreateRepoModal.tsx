import { useState } from 'react';
import { X, Lock, Globe } from 'lucide-react';
import { Repository, User } from '../types';

interface CreateRepoModalProps {
  onClose: () => void;
  onCreate: (repo: Repository) => void;
  currentUser: User;
}

export function CreateRepoModal({
  onClose,
  onCreate,
  currentUser,
}: CreateRepoModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newRepo: Repository = {
      id: Date.now().toString(),
      name,
      description,
      owner: currentUser,
      collaborators: [],
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPrivate,
    };

    onCreate(newRepo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--purple-dark)] border border-white/20 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">Crear nuevo repositorio</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">
              Nombre del repositorio
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mi-proyecto-increible"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu proyecto..."
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-white mb-3">Visibilidad</label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  !isPrivate
                    ? 'border-purple-400 bg-purple-400/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-300" />
                  <div>
                    <div className="text-white">Público</div>
                    <div className="text-gray-400">
                      Cualquiera puede ver este repositorio
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isPrivate
                    ? 'border-purple-400 bg-purple-400/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-300" />
                  <div>
                    <div className="text-white">Privado</div>
                    <div className="text-gray-400">
                      Solo tú y los colaboradores pueden verlo
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              style={{ background: 'var(--purple-accent)' }}
            >
              Crear repositorio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
