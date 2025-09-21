"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Book = {
  id: number;
  name: string;
  image: string;
};

type Author = {
  id: number;
  name: string;
  description: string;
  image: string;
  birthDate: string;
  books?: Book[];
};

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  async function obtenerDatos(): Promise<Author[]> {
    const response = await fetch("http://127.0.0.1:8080/api/authors");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  //Usamos useEffect para cargar los datos al crear el componente y no cada vez que se renderiza
  useEffect(() => {
    obtenerDatos()
      .then((data) => {
        setAuthors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (author: Author) => {
    setEditingAuthor(author); //Funcion para cambiar el estado de edicion del autor y que se pueda renderizar el formulario
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/authors/${editingAuthor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingAuthor),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al actualizar autor: ${response.status}`);
      }

      const updated = await response.json();

      setAuthors((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );

      setEditingAuthor(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/authors/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error al eliminar autor: ${response.status}`);
      }

      setAuthors((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando autores...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Lista de Autores</h1>

      {editingAuthor && (
        <form
          onSubmit={handleSave}
          className="border p-4 mb-6 rounded bg-gray-50 space-y-3"
        >
          <h2 className="text-lg font-semibold">Editar Autor</h2>

          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={editingAuthor.name}
              onChange={(e) =>
                setEditingAuthor({ ...editingAuthor, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={editingAuthor.birthDate}
              onChange={(e) =>
                setEditingAuthor({
                  ...editingAuthor,
                  birthDate: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              value={editingAuthor.description}
              onChange={(e) =>
                setEditingAuthor({
                  ...editingAuthor,
                  description: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">URL Imagen</label>
            <input
              type="text"
              value={editingAuthor.image}
              onChange={(e) =>
                setEditingAuthor({ ...editingAuthor, image: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => setEditingAuthor(null)}
          >
            Cancelar
          </button>
        </form>
      )}

      {authors.length === 0 ? (
        <p className="text-center text-gray-600">No se encontraron autores</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authors.map((author) => (
            <div key={author.id} className="border rounded-md p-4 bg-white">
              <div className="flex items-center gap-4">
                <Image
                  src={author.image}
                  alt={author.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                  unoptimized
                />
                <div>
                  <h2 className="text-lg font-semibold">{author.name}</h2>
                  <p className="text-sm text-gray-500">{author.birthDate}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-3">{author.description}</p>

              {author.books && author.books.length > 0 && (
                <div className="mt-3">
                  <h3 className="font-medium text-sm mb-2">Libros:</h3>
                  <div className="flex flex-wrap gap-3">
                    {author.books.slice(0, 3).map((book) => (
                      <div
                        key={book.id}
                        className="flex flex-col items-center w-24"
                      >
                        <Image
                          src={book.image}
                          alt={book.name}
                          width={70}
                          height={100}
                          className="object-cover rounded"
                          unoptimized
                        />
                        <p className="text-xs text-center mt-1">{book.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditClick(author)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(author.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
