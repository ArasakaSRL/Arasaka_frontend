interface Props {
    contenido: string
}

export default function MensajeCuerpo({ contenido }: Props) {
    return (
        <div className="rounded-xl bg-slate-50 border border-slate-100 px-5 py-4 my-1">
            <p className="text-[14px] text-slate-700 whitespace-pre-wrap leading-7 tracking-normal">
                {contenido}
            </p>
        </div>
    )
}
