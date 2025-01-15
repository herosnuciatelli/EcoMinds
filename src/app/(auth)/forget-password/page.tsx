import { ForgetPasswordForm } from "./_components/form";

export default function Page() {
    return (
        <div className="py-24 grid place-items-center">
            <div className="max-w-md">
                <h2 className="font-bold text-3xl">Resetar Sua Senha</h2>
                <p className="py-1 text-sm">Insira o seu email e nós vamos te enviar um link para resetar sua senha.</p>
                <ForgetPasswordForm />
            </div>
        </div>
    )
}