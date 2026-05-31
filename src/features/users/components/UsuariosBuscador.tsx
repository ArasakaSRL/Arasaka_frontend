import { Search } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const UserSearch = ({
  value,
  onChange,
}: Props) => {
  return (
    <div className="relative w-full md:w-96">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar talento o username..."
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500
        "
      />
    </div>
  )
}