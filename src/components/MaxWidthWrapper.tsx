export function MaxWidthWrapper(
    { 
        children, 
        classname
    }: Readonly<{ children: React.ReactNode, classname?: string }>) {
    return (
        <div className={`max-w-6xl px-3 mx-auto ${classname}`}>
            { children }
        </div>
    )
}