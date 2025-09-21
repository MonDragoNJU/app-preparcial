"use client";

import React, { useState } from "react";

interface Author {
  id: number;
  name: string;
  birthDate: string;
  description: string;
  image: string;
}

//Se crean los manejadores de estado como lo dice en el enunciado
export default function CrearUsuario() {
  const [autores, setAutores] = useState<Author[]>([]);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const crearAutor = async (nuevoAutor: Omit<Author, "id">): Promise<Author> => {
    const response = await fetch("http://127.0.0.1:8080/api/authors", {
      method: "POST", //Esto porque tenemos que publicar el autor que acabamos de crear
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoAutor),
    });

    if (!response.ok) {
      throw new Error(`Error al crear autor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const autorCreado = await crearAutor({
        name,
        birthDate,
        description,
        image,
      });
      setAutores([...autores, autorCreado]);
      setName("");
      setBirthDate("");
      setDescription("");
      setImage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Usuario</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Fecha de Nacimiento</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">URL de Imagen</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
