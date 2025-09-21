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

  async function obtenerDatos(): Promise<Author[]> {
    const response = await fetch("http://127.0.0.1:8080/api/authors");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

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

  if (loading) return <div className="p-6">Cargando autores...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Lista de Autores</h1>
      {authors.length === 0 ? (
        <p className="text-center text-gray-600">No se encontraron autores</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authors.map((author) => (
            <div
              key={author.id}
              className="border rounded-md p-4 bg-white"
            >
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
                  <h3 className="font-medium text-sm mb-1">Libros:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {author.books.slice(0, 3).map((book) => (
                      <li key={book.id}>{book.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
