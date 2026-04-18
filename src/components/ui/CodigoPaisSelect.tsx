import Select, { type SingleValue, type StylesConfig } from 'react-select'

interface CodigoPaisOption {
    value: string   // código telefónico ej: "+57"
    label: string   // nombre del país
    code: string    // código ISO ej: "CO"
}

const CODIGOS_PAISES: CodigoPaisOption[] = [
    { value: '+54', label: 'Argentina (+54)', code: 'AR' },
    { value: '+591', label: 'Bolivia (+591)', code: 'BO' },
    { value: '+55', label: 'Brasil (+55)', code: 'BR' },
    { value: '+56', label: 'Chile (+56)', code: 'CL' },
    { value: '+57', label: 'Colombia (+57)', code: 'CO' },
    { value: '+506', label: 'Costa Rica (+506)', code: 'CR' },
    { value: '+53', label: 'Cuba (+53)', code: 'CU' },
    { value: '+593', label: 'Ecuador (+593)', code: 'EC' },
    { value: '+503', label: 'El Salvador (+503)', code: 'SV' },
    { value: '+502', label: 'Guatemala (+502)', code: 'GT' },
    { value: '+504', label: 'Honduras (+504)', code: 'HN' },
    { value: '+52', label: 'México (+52)', code: 'MX' },
    { value: '+505', label: 'Nicaragua (+505)', code: 'NI' },
    { value: '+507', label: 'Panamá (+507)', code: 'PA' },
    { value: '+595', label: 'Paraguay (+595)', code: 'PY' },
    { value: '+51', label: 'Perú (+51)', code: 'PE' },
    { value: '+1787', label: 'Puerto Rico (+1787)', code: 'PR' },
    { value: '+1809', label: 'Rep. Dominicana (+1809)', code: 'DO' },
    { value: '+598', label: 'Uruguay (+598)', code: 'UY' },
    { value: '+58', label: 'Venezuela (+58)', code: 'VE' },
]

const getFlagUrl = (code: string) =>
    `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`

const customStyles: StylesConfig<CodigoPaisOption> = {
    control: (base, state) => ({
        ...base,
        borderRadius: '0.75rem',
        borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
        fontSize: '14px',
        minHeight: '40px',
        minWidth: '120px',
        '&:hover': { borderColor: '#3b82f6' },
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '13px',
        backgroundColor: state.isSelected ? '#1e2a5e' : state.isFocused ? '#eff6ff' : 'white',
        color: state.isSelected ? 'white' : '#374151',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    }),
    singleValue: (base) => ({ ...base, color: '#374151', fontSize: '14px', display: 'flex', alignItems: 'center' }),
    placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '13px' }),
    menu: (base) => ({ ...base, borderRadius: '0.75rem', overflow: 'hidden', zIndex: 20, minWidth: '220px' }),
    dropdownIndicator: (base) => ({ ...base, padding: '0 6px' }),
    indicatorSeparator: () => ({ display: 'none' }),
}

const formatOptionLabel = (option: CodigoPaisOption, { context }: { context: 'menu' | 'value' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <img
            src={getFlagUrl(option.code)}
            alt={option.label}
            style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }}
        />
        {context === 'value'
            ? <span>{option.value}</span>
            : <span>{option.label}</span>
        }
    </div>
)

interface CodigoPaisSelectProps {
    value: string
    onChange: (val: string) => void
}

export default function CodigoPaisSelect({ value, onChange }: CodigoPaisSelectProps) {
    const selected = CODIGOS_PAISES.find(p => p.value === value) ?? null

    return (
        <Select<CodigoPaisOption>
            options={CODIGOS_PAISES}
            value={selected}
            onChange={(opt: SingleValue<CodigoPaisOption>) => onChange(opt?.value ?? '')}
            formatOptionLabel={formatOptionLabel}
            getOptionLabel={(opt) => opt.label}
            getOptionValue={(opt) => opt.value}
            styles={customStyles}
            placeholder="+00"
            noOptionsMessage={() => 'No encontrado'}
        />
    )
}
