function ErrorWarning({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="py-1.5">
            {children}
        </div>
    )
}

function Title({ children }: {
    children: React.ReactNode
}) {
    return <span className="text-rose-700 text-sm">{children}</span>
}

ErrorWarning.Title = Title


export { ErrorWarning }