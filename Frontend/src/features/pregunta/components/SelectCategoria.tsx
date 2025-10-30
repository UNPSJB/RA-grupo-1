interface Categoria {
  id: number;
  codigo: string;
  texto: string;
}

interface CategoriaSelectorProps {
  categorias: Categoria[];
  categoriaElegida: string;
  onChange: (id: string) => void;
}

export default function CategoriaSelector({
  categorias,
  categoriaElegida,
  onChange,
}: CategoriaSelectorProps) {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Categoría</label>
      <select
        className="form-select"
        value={categoriaElegida}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Elegi una categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={String(cat.id)}>
            {cat.codigo} - {cat.texto}
          </option>
        ))}
      </select>
    </div>
  );
}