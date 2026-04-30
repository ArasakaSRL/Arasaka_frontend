interface Props {
    nombre : string;
    total  : number;
}

export function BoxCantidad({nombre, total}:Props){
    return(
        <div>{nombre} {total}</div>
    );
}