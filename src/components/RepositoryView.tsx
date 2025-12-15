import { useState } from 'react';
import { Repository, User, File as FileType } from '../types';
import {
  ArrowLeft,
  Users,
  Upload,
  FileText,
  Pencil,
  Trash2,
  Plus,
  X,
  Lock,
  Globe,
} from 'lucide-react';

interface RepositoryViewProps {
  repository: Repository;
  currentUser: User;
  onBack: () => void;
  onUpdateRepo: (repo: Repository) => void;
}

export function RepositoryView({
  repository,
  currentUser,
  onBack,
  onUpdateRepo,
}: RepositoryViewProps) {
  const [activeTab, setActiveTab] = useState<'files' | 'collaborators'>('files');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [editingFile, setEditingFile] = useState<FileType | null>(null);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');

  const handleUploadFile = () => {
    if (!newFileName) return;

    const newFile: FileType = {
      id: Date.now().toString(),
      name: newFileName,
      path: `/${newFileName}`,
      content: newFileContent,
      size: newFileContent.length,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser,
    };

    onUpdateRepo({
      ...repository,
      files: [...repository.files, newFile],
      updatedAt: new Date().toISOString(),
    });

    setNewFileName('');
    setNewFileContent('');
    setShowUploadModal(false);
  };

  const handleEditFile = (file: FileType) => {
    setEditingFile(file);
    setNewFileContent(file.content);
  };

  const handleSaveEdit = () => {
    if (!editingFile) return;

    const updatedFiles = repository.files.map((f) =>
      f.id === editingFile.id
        ? {
            ...f,
            content: newFileContent,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser,
          }
        : f
    );

    onUpdateRepo({
      ...repository,
      files: updatedFiles,
      updatedAt: new Date().toISOString(),
    });

    setEditingFile(null);
    setNewFileContent('');
  };

  const handleDeleteFile = (fileId: string) => {
    onUpdateRepo({
      ...repository,
      files: repository.files.filter((f) => f.id !== fileId),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddCollaborator = () => {
    if (!newCollaboratorEmail) return;

    // Mock collaborator
    const newCollaborator: User = {
      id: Date.now().toString(),
      username: newCollaboratorEmail.split('@')[0],
      email: newCollaboratorEmail,
    };

    onUpdateRepo({
      ...repository,
      collaborators: [...repository.collaborators, newCollaborator],
    });

    setNewCollaboratorEmail('');
    setShowAddCollaboratorModal(false);
  };

  const handleRemoveCollaborator = (userId: string) => {
    onUpdateRepo({
      ...repository,
      collaborators: repository.collaborators.filter((c) => c.id !== userId),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a repositorios
      </button>

      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-white">{repository.name}</h2>
              <span className="px-3 py-1 rounded-full bg-white/10 text-purple-300 flex items-center gap-1">
                {repository.isPrivate ? (
                  <>
                    <Lock className="w-3 h-3" />
                    Privado
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3" />
                    Público
                  </>
                )}
              </span>
            </div>
            <p className="text-gray-300">{repository.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <span>Propietario: {repository.owner.username}</span>
          <span>•</span>
          <span>
            Actualizado:{' '}
            {new Date(repository.updatedAt).toLocaleDateString('es-ES')}
          </span>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
        <div className="border-b border-white/20 flex">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-6 py-3 flex items-center gap-2 transition-colors ${
              activeTab === 'files'
                ? 'bg-white/10 text-white border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Archivos ({repository.files.length})
          </button>
          <button
            onClick={() => setActiveTab('collaborators')}
            className={`px-6 py-3 flex items-center gap-2 transition-colors ${
              activeTab === 'collaborators'
                ? 'bg-white/10 text-white border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Colaboradores ({repository.collaborators.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'files' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white">Archivos del proyecto</h3>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  style={{ background: 'var(--purple-accent)' }}
                >
                  <Upload className="w-4 h-4" />
                  Subir archivo
                </button>
              </div>

              <div className="space-y-2">
                {repository.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-300" />
                      <div>
                        <div className="text-white">{file.name}</div>
                        <div className="text-gray-400">
                          {file.size} bytes • Actualizado por{' '}
                          {file.updatedBy.username} •{' '}
                          {new Date(file.updatedAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditFile(file)}
                        className="p-2 text-purple-300 hover:text-purple-200 hover:bg-white/10 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {repository.files.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay archivos en este repositorio</p>
                  <p>Sube tu primer archivo para comenzar</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'collaborators' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white">Miembros del equipo</h3>
                <button
                  onClick={() => setShowAddCollaboratorModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  style={{ background: 'var(--purple-accent)' }}
                >
                  <Plus className="w-4 h-4" />
                  Añadir colaborador
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      {repository.owner.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white">{repository.owner.username}</div>
                      <div className="text-gray-400">{repository.owner.email}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded">
                    Propietario
                  </span>
                </div>

                {repository.collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white">
                        {collaborator.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white">{collaborator.username}</div>
                        <div className="text-gray-400">{collaborator.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--purple-dark)] border border-white/20 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Subir nuevo archivo</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewFileName('');
                  setNewFileContent('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Nombre del archivo</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="ejemplo.txt"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Contenido</label>
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="Escribe o pega el contenido del archivo..."
                  rows={10}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setNewFileName('');
                    setNewFileContent('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUploadFile}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  style={{ background: 'var(--purple-accent)' }}
                >
                  Subir archivo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit File Modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--purple-dark)] border border-white/20 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Editar: {editingFile.name}</h3>
              <button
                onClick={() => {
                  setEditingFile(null);
                  setNewFileContent('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Contenido</label>
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setEditingFile(null);
                    setNewFileContent('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  style={{ background: 'var(--purple-accent)' }}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Collaborator Modal */}
      {showAddCollaboratorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--purple-dark)] border border-white/20 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Añadir colaborador</h3>
              <button
                onClick={() => {
                  setShowAddCollaboratorModal(false);
                  setNewCollaboratorEmail('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Email del colaborador</label>
                <input
                  type="email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  placeholder="colaborador@email.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddCollaboratorModal(false);
                    setNewCollaboratorEmail('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCollaborator}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  style={{ background: 'var(--purple-accent)' }}
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
