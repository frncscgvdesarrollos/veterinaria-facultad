'use client';

export default function Error({ error, reset }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">¡Ups! Algo salió mal.</h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
