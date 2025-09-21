"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";

interface FormData {
  name: string;
  birthDate: string;
  description: string;
  image: string;
}

interface Author extends FormData {
  id: number;
}

export default function CrearUsuario() {
  const [autores, setAutores] = useState<Author[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const crearAutor = async (nuevoAutor: FormData): Promise<Author> => {
    const response = await fetch("http://127.0.0.1:8080/api/authors", {
      method: "POST",
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const autorCreado = await crearAutor(data);
      setAutores([...autores, autorCreado]);
      reset();
    } catch (err) {
      console.error(err);
      alert("Error al crear autor");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Usuario</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            {...register("name", { required: "El nombre es obligatorio" })}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="block font-medium">Fecha de Nacimiento</label>
          <input
            type="date"
            {...register("birthDate", { required: "La fecha es obligatoria" })}
            className="w-full border p-2 rounded"
          />
          {errors.birthDate && (
            <span className="text-red-500">{errors.birthDate.message}</span>
          )}
        </div>

        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            {...register("description", {
              required: "La descripción es obligatoria",
            })}
            className="w-full border p-2 rounded"
          />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>

        <div>
          <label className="block font-medium">URL de Imagen</label>
          <input
            type="text"
            {...register("image", { required: "La imagen es obligatoria" })}
            className="w-full border p-2 rounded"
          />
          {errors.image && (
            <span className="text-red-500">{errors.image.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear Usuario
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-6">Autores</h2>
      <ul className="mt-2 space-y-2">
        {autores.map((autor) => (
          <li
            key={autor.id}
            className="border p-3 rounded flex items-center space-x-3"
          >
            <Image
              src={autor.image}
              alt={autor.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
              unoptimized
            />
            <div>
              <p className="font-bold">{autor.name}</p>
              <p className="text-sm text-gray-600">{autor.birthDate}</p>
              <p className="text-sm">{autor.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
