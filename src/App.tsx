import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { RepositoryView } from "./components/RepositoryView";
import { CreateRepoModal } from "./components/CreateRepoModal";
import { User, Repository } from "./types";

// Mock data
const mockRepositories: Repository[] = [
  {
    id: "1",
    name: "proyecto-principal",
    description: "Aplicación web principal del equipo",
    owner: {
      id: "1",
      username: "demo_user",
      email: "demo@sandworm.com",
    },
    collaborators: [
      {
        id: "2",
        username: "maria_dev",
        email: "maria@sandworm.com",
      },
      {
        id: "3",
        username: "carlos_design",
        email: "carlos@sandworm.com",
      },
    ],
    files: [
      {
        id: "1",
        name: "README.md",
        path: "/README.md",
        content:
          "# Proyecto Principal\n\nBienvenido al proyecto principal de nuestro equipo.",
        size: 67,
        updatedAt: "2025-12-10T10:00:00Z",
        updatedBy: {
          id: "1",
          username: "demo_user",
          email: "demo@sandworm.com",
        },
      },
      {
        id: "2",
        name: "config.json",
        path: "/config.json",
        content:
          '{\n  "version": "1.0.0",\n  "name": "proyecto-principal"\n}',
        size: 52,
        updatedAt: "2025-12-12T14:30:00Z",
        updatedBy: {
          id: "2",
          username: "maria_dev",
          email: "maria@sandworm.com",
        },
      },
    ],
    createdAt: "2025-11-01T08:00:00Z",
    updatedAt: "2025-12-12T14:30:00Z",
    isPrivate: false,
  },
  {
    id: "2",
    name: "documentacion",
    description: "Documentación técnica y guías del proyecto",
    owner: {
      id: "1",
      username: "demo_user",
      email: "demo@sandworm.com",
    },
    collaborators: [
      {
        id: "3",
        username: "carlos_design",
        email: "carlos@sandworm.com",
      },
    ],
    files: [
      {
        id: "3",
        name: "guia-inicio.md",
        path: "/guia-inicio.md",
        content:
          "# Guía de Inicio\n\n## Instalación\n\n1. Clona el repositorio\n2. Instala dependencias\n3. Ejecuta el proyecto",
        size: 123,
        updatedAt: "2025-12-08T16:00:00Z",
        updatedBy: {
          id: "3",
          username: "carlos_design",
          email: "carlos@sandworm.com",
        },
      },
    ],
    createdAt: "2025-11-15T09:00:00Z",
    updatedAt: "2025-12-08T16:00:00Z",
    isPrivate: true,
  },
  {
    id: "3",
    name: "backend-api",
    description: "API REST del backend en Node.js",
    owner: {
      id: "1",
      username: "demo_user",
      email: "demo@sandworm.com",
    },
    collaborators: [
      {
        id: "2",
        username: "maria_dev",
        email: "maria@sandworm.com",
      },
    ],
    files: [],
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2025-12-01T10:00:00Z",
    isPrivate: false,
  },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [repositories, setRepositories] =
    useState<Repository[]>(mockRepositories);
  const [selectedRepo, setSelectedRepo] =
    useState<Repository | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Update mock repositories owner to current user
    setRepositories((repos) =>
      repos.map((repo) => ({
        ...repo,
        owner: user,
      })),
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRepo(null);
    setSearchTerm("");
  };

  const handleCreateRepo = (newRepo: Repository) => {
    setRepositories([newRepo, ...repositories]);
  };

  const handleUpdateRepo = (updatedRepo: Repository) => {
    setRepositories((repos) =>
      repos.map((repo) =>
        repo.id === updatedRepo.id ? updatedRepo : repo,
      ),
    );
    setSelectedRepo(updatedRepo);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onCreateRepo={() => setShowCreateModal(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {selectedRepo ? (
        <RepositoryView
          repository={selectedRepo}
          currentUser={currentUser}
          onBack={() => setSelectedRepo(null)}
          onUpdateRepo={handleUpdateRepo}
        />
      ) : (
        <Dashboard
          repositories={repositories}
          onSelectRepo={setSelectedRepo}
          searchTerm={searchTerm}
        />
      )}

      {showCreateModal && (
        <CreateRepoModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRepo}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}