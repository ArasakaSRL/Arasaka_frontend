import Select, { type SingleValue, type StylesConfig } from 'react-select'

interface PaisOption {
    value: string
    label: string
    code: string
}

const PAISES: PaisOption[] = [
    { value: 'Argentina', label: 'Argentina', code: 'AR' },
    { value: 'Bolivia', label: 'Bolivia', code: 'BO' },
    { value: 'Brasil', label: 'Brasil', code: 'BR' },
    { value: 'Chile', label: 'Chile', code: 'CL' },
    { value: 'Colombia', label: 'Colombia', code: 'CO' },
    { value: 'Costa Rica', label: 'Costa Rica', code: 'CR' },
    { value: 'Cuba', label: 'Cuba', code: 'CU' },
    { value: 'Ecuador', label: 'Ecuador', code: 'EC' },
    { value: 'El Salvador', label: 'El Salvador', code: 'SV' },
    { value: 'Guatemala', label: 'Guatemala', code: 'GT' },
    { value: 'Honduras', label: 'Honduras', code: 'HN' },
    { value: 'México', label: 'México', code: 'MX' },
    { value: 'Nicaragua', label: 'Nicaragua', code: 'NI' },
    { value: 'Panamá', label: 'Panamá', code: 'PA' },
    { value: 'Paraguay', label: 'Paraguay', code: 'PY' },
    { value: 'Perú', label: 'Perú', code: 'PE' },
    { value: 'Puerto Rico', label: 'Puerto Rico', code: 'PR' },
    { value: 'República Dominicana', label: 'República Dominicana', code: 'DO' },
    { value: 'Uruguay', label: 'Uruguay', code: 'UY' },
    { value: 'Venezuela', label: 'Venezuela', code: 'VE' },
]

const getFlagUrl = (code: string) =>
    `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`

const customStyles: StylesConfig<PaisOption> = {
    control: (base, state) => ({
        ...base,
        borderRadius: '0.75rem',
        borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
        fontSize: '14px',
        minHeight: '40px',
        '&:hover': { borderColor: '#3b82f6' },
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '14px',
        backgroundColor: state.isSelected ? '#1e2a5e' : state.isFocused ? '#eff6ff' : 'white',
        color: state.isSelected ? 'white' : '#374151',
        cursor: 'pointer',
    }),
    singleValue: (base) => ({ ...base, color: '#374151', fontSize: '14px', display: 'flex', alignItems: 'center' }),
    placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '14px' }),
    menu: (base) => ({ ...base, borderRadius: '0.75rem', overflow: 'hidden', zIndex: 20 }),
}

const formatOptionLabel = (option: PaisOption) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
            src={getFlagUrl(option.code)}
            alt={option.label}
            style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }}
        />
        <span>{option.label}</span>
    </div>
)

interface PaisSelectProps {
    value: string
    onChange: (val: string) => void
}

export default function PaisSelect({ value, onChange }: PaisSelectProps) {
    const selected = PAISES.find(p => p.value === value) ?? null

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1">
                País
            </label>
            <Select<PaisOption>
                options={PAISES}
                value={selected}
                onChange={(opt: SingleValue<PaisOption>) => onChange(opt?.value ?? '')}
                formatOptionLabel={formatOptionLabel}
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                styles={customStyles}
                placeholder="Selecciona tu país..."
                isClearable
                noOptionsMessage={() => 'No se encontró el país'}
            />
        </div>
    )
}
