export function MaxWidthWrapper(
    { 
        children, 
        classname
    }: Readonly<{ children: React.ReactNode, classname?: string }>) {
    return (
        <div className={`max-w-6xl px-3 mx-auto border-x border-dashed border-stone-300 ${classname}`}>
            { children }
        </div>
    )
}